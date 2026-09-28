import type { CreateVideoRequest } from '../dto/create-video.request';

export type VideoGenerationStatus = 'processing' | 'completed' | 'failed';

export interface ProviderGenerationJob {
  providerJobId: string;
}

export interface ProviderGenerationStatus {
  status: VideoGenerationStatus;
  videoUrl?: string;
}

/**
 * Boundary for model vendors. Provider implementations own external API
 * details; the service only uses these vendor-neutral job operations.
 */
export interface VideoGenerationProvider {
  generate(request: CreateVideoRequest): Promise<ProviderGenerationJob>;
  getStatus(providerJobId: string): Promise<ProviderGenerationStatus>;
}

export const VIDEO_GENERATION_PROVIDER = Symbol('VIDEO_GENERATION_PROVIDER');
