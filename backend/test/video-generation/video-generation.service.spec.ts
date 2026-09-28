import { BadRequestException } from '@nestjs/common';
import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  parseCreateVideoRequest,
  type CreateVideoRequest,
} from '../../src/video-generation/dto/create-video.request';
import { MockVideoProvider } from '../../src/video-generation/providers/mock-video.provider';
import type {
  ProviderGenerationJob,
  ProviderGenerationStatus,
  VideoGenerationProvider,
} from '../../src/video-generation/providers/video-generation.provider';
import { VideoGenerationService } from '../../src/video-generation/video-generation.service';

class RecordingProvider implements VideoGenerationProvider {
  receivedRequest?: CreateVideoRequest;

  async generate(request: CreateVideoRequest): Promise<ProviderGenerationJob> {
    this.receivedRequest = request;
    return { providerJobId: 'recording-job-1' };
  }

  async getStatus(_providerJobId: string): Promise<ProviderGenerationStatus> {
    return {
      status: 'completed',
      videoUrl: 'https://example.com/recording-video.mp4',
    };
  }
}

test('creates a processing video with an internal ID', async () => {
  const provider = new RecordingProvider();
  const service = new VideoGenerationService(provider);
  const request = parseCreateVideoRequest({
    prompt: 'A cinematic sunrise over the Himalayas',
    aspectRatio: '9:16',
    duration: 8,
  });

  const created = await service.create(request);

  assert.equal(created.status, 'processing');
  assert.match(created.id, /^[0-9a-f-]{36}$/i);
  assert.deepEqual(provider.receivedRequest, request);
});

test('rejects an invalid prompt', () => {
  assert.throws(
    () =>
      parseCreateVideoRequest({
        prompt: '   ',
        aspectRatio: '16:9',
        duration: 8,
      }),
    BadRequestException,
  );
});

test('rejects an invalid aspect ratio', () => {
  assert.throws(
    () =>
      parseCreateVideoRequest({
        prompt: 'A mountain landscape',
        aspectRatio: '4:3',
        duration: 8,
      }),
    BadRequestException,
  );
});

test('rejects an invalid duration', () => {
  assert.throws(
    () =>
      parseCreateVideoRequest({
        prompt: 'A mountain landscape',
        aspectRatio: '16:9',
        duration: 0,
      }),
    BadRequestException,
  );
});

test('retrieves a video and updates its status from the provider', async () => {
  const service = new VideoGenerationService(new MockVideoProvider());
  const created = await service.create(
    parseCreateVideoRequest({
      prompt: 'Ocean waves at dusk',
      aspectRatio: '16:9',
      duration: 6,
    }),
  );

  const video = await service.getById(created.id);

  assert.deepEqual(video, {
    id: created.id,
    status: 'completed',
    videoUrl: 'https://example.com/mock-video.mp4',
  });
});
