import { BadRequestException } from '@nestjs/common';

export const SUPPORTED_ASPECT_RATIOS = ['16:9', '9:16', '1:1'] as const;

export type AspectRatio = (typeof SUPPORTED_ASPECT_RATIOS)[number];

export interface CreateVideoRequest {
  prompt: string;
  aspectRatio: AspectRatio;
  duration: number;
}

/**
 * Validates and normalizes the API body without coupling this early module to
 * a validation library. DTO decorators can be introduced with a future API
 * validation layer if the application needs them.
 */
export function parseCreateVideoRequest(body: unknown): CreateVideoRequest {
  if (!isObject(body)) {
    throw new BadRequestException('Request body must be an object.');
  }

  const { prompt, aspectRatio, duration } = body;

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new BadRequestException('prompt must be a non-empty string.');
  }

  if (!isAspectRatio(aspectRatio)) {
    throw new BadRequestException(
      `aspectRatio must be one of: ${SUPPORTED_ASPECT_RATIOS.join(', ')}.`,
    );
  }

  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration <= 0) {
    throw new BadRequestException('duration must be a positive number.');
  }

  return {
    prompt: prompt.trim(),
    aspectRatio,
    duration,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAspectRatio(value: unknown): value is AspectRatio {
  return (
    typeof value === 'string' &&
    (SUPPORTED_ASPECT_RATIOS as readonly string[]).includes(value)
  );
}
