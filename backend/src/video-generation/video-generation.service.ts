import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { CreateVideoRequest } from './dto/create-video.request';
import {
  VIDEO_GENERATION_PROVIDER,
  type VideoGenerationProvider,
  type VideoGenerationStatus,
} from './providers/video-generation.provider';

export interface VideoCreationResponse {
  id: string;
  status: 'processing';
}

export interface VideoStatusResponse {
  id: string;
  status: VideoGenerationStatus;
  videoUrl?: string;
}

interface StoredVideo {
  id: string;
  providerJobId: string;
  status: VideoGenerationStatus;
  videoUrl?: string;
}

@Injectable()
export class VideoGenerationService {
  private readonly videos = new Map<string, StoredVideo>();

  constructor(
    @Inject(VIDEO_GENERATION_PROVIDER)
    private readonly provider: VideoGenerationProvider,
  ) {}

  async create(request: CreateVideoRequest): Promise<VideoCreationResponse> {
    const providerJob = await this.provider.generate(request);
    const video: StoredVideo = {
      id: randomUUID(),
      providerJobId: providerJob.providerJobId,
      status: 'processing',
    };

    this.videos.set(video.id, video);

    return { id: video.id, status: 'processing' };
  }

  async getById(id: string): Promise<VideoStatusResponse> {
    const video = this.videos.get(id);

    if (!video) {
      throw new NotFoundException(`Video ${id} was not found.`);
    }

    if (video.status === 'processing') {
      const providerStatus = await this.provider.getStatus(video.providerJobId);
      video.status = providerStatus.status;
      video.videoUrl = providerStatus.videoUrl;
    }

    return this.toStatusResponse(video);
  }

  private toStatusResponse(video: StoredVideo): VideoStatusResponse {
    return {
      id: video.id,
      status: video.status,
      ...(video.videoUrl ? { videoUrl: video.videoUrl } : {}),
    };
  }
}
