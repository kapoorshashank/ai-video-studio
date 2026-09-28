import { Injectable } from '@nestjs/common';

import type { CreateVideoRequest } from '../dto/create-video.request';
import type {
  ProviderGenerationJob,
  ProviderGenerationStatus,
  VideoGenerationProvider,
} from './video-generation.provider';

interface AgnesImageResponse {
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

interface AgnesCreateVideoResponse {
  video_id?: string;
  id?: string;
  status?: string;
  seconds?: string;
  size?: string;
}

interface AgnesVideoStatusResponse {
  status?: string;
  url?: string;
  remixed_from_video_id?: string;
}

@Injectable()
export class AgnesVideoProvider implements VideoGenerationProvider {
  private readonly apiBaseUrl = 'https://apihub.agnes-ai.com/v1';
  private readonly resultUrl = 'https://apihub.agnes-ai.com/agnesapi';

  async generate(
    request: CreateVideoRequest,
  ): Promise<ProviderGenerationJob> {
    const isPortrait = request.aspectRatio === '9:16';

    const imageWidth = isPortrait ? 576 : 1024;
    const imageHeight = isPortrait ? 1024 : 576;

    const videoWidth = isPortrait ? 768 : 1152;
    const videoHeight = isPortrait ? 1344 : 768;

    const numFrames = request.duration === 10 ? 241 : 121;

    console.log('🎨 GENERATING REFERENCE IMAGE...');

    const imageResponse = await fetch(
      `${this.apiBaseUrl}/images/generations`,
      {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          model: 'agnes-image-2.1-flash',
          prompt: this.buildImagePrompt(request.prompt),
          size: `${imageWidth}x${imageHeight}`,
          extra_body: {
            response_format: 'url',
          },
        }),
      },
    );

    if (!imageResponse.ok) {
      const errorBody = await imageResponse.text();

      throw new Error(
        `Agnes image generation failed with status ${imageResponse.status}: ${errorBody}`,
      );
    }

    const imageData =
      (await imageResponse.json()) as AgnesImageResponse;

    const imageUrl = imageData.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error(
        'Agnes image generation did not return a public image URL.',
      );
    }

    console.log('🎨 REFERENCE IMAGE:', imageUrl);

    console.log('🎬 GENERATING VIDEO...', {
      aspectRatio: request.aspectRatio,
      duration: request.duration,
      videoWidth,
      videoHeight,
      numFrames,
    });

    const videoResponse = await fetch(`${this.apiBaseUrl}/videos`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        model: 'agnes-video-v2.0',
        prompt: request.prompt,
        image: imageUrl,
        negative_prompt:
          'blurry, low quality, distorted, deformed, bad anatomy, extra limbs, flickering, jitter, artifacts, text, watermark',
        width: videoWidth,
        height: videoHeight,
        num_frames: numFrames,
        frame_rate: 24,
        num_inference_steps: 30,
      }),
    });

    if (!videoResponse.ok) {
      const errorBody = await videoResponse.text();

      throw new Error(
        `Agnes video creation failed with status ${videoResponse.status}: ${errorBody}`,
      );
    }

    const videoData =
      (await videoResponse.json()) as AgnesCreateVideoResponse;

    console.log('🎬 VIDEO CREATE RESPONSE:', videoData);

    const videoId = videoData.video_id ?? videoData.id;

    if (!videoId) {
      throw new Error(
        'Agnes video creation did not return a video_id.',
      );
    }

    return {
      providerJobId: videoId,
    };
  }

  async getStatus(
    providerJobId: string,
  ): Promise<ProviderGenerationStatus> {
    const response = await fetch(
      `${this.resultUrl}?video_id=${encodeURIComponent(providerJobId)}`,
      {
        headers: this.headers(),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `Agnes video status check failed with status ${response.status}: ${errorBody}`,
      );
    }

    const data =
      (await response.json()) as AgnesVideoStatusResponse;

    return {
      status: this.toVideoGenerationStatus(data.status),
      ...(data.status === 'completed' &&
      (data.url || data.remixed_from_video_id)
        ? {
            videoUrl:
              data.url ?? data.remixed_from_video_id,
          }
        : {}),
    };
  }

  private buildImagePrompt(prompt: string): string {
    return [
      prompt,
      'Photorealistic cinematic frame.',
      'Highly detailed subject.',
      'Natural realistic anatomy.',
      'Professional cinematography.',
      'Dramatic but realistic lighting.',
      'Sharp subject details.',
      'Film-quality composition.',
      'No text or watermark.',
    ].join(' ');
  }

  private headers(): HeadersInit {
    const apiKey = process.env.AGNES_API_KEY;

    if (!apiKey) {
      throw new Error(
        'AGNES_API_KEY is required for Agnes video generation.',
      );
    }

    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private toVideoGenerationStatus(
    status: string | undefined,
  ): ProviderGenerationStatus['status'] {
    if (status === 'completed') {
      return 'completed';
    }

    if (status === 'failed') {
      return 'failed';
    }

    return 'processing';
  }
}

export { AgnesVideoProvider as MockVideoProvider };