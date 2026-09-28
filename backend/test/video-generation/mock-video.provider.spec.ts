import * as assert from 'node:assert/strict';
import { test } from 'node:test';

import { MockVideoProvider } from '../../src/video-generation/providers/mock-video.provider';
import type { VideoGenerationProvider } from '../../src/video-generation/providers/video-generation.provider';

test('mock provider fulfills the provider abstraction with a completed result', async () => {
  const provider: VideoGenerationProvider = new MockVideoProvider();

  const job = await provider.generate({
    prompt: 'A neon city in the rain',
    aspectRatio: '1:1',
    duration: 5,
  });
  const result = await provider.getStatus(job.providerJobId);

  assert.match(job.providerJobId, /^mock-[0-9a-f-]{36}$/i);
  assert.deepEqual(result, {
    status: 'completed',
    videoUrl: 'https://example.com/mock-video.mp4',
  });
});
