import { Module } from '@nestjs/common';

import { AgnesVideoProvider } from './providers/mock-video.provider';
import { VIDEO_GENERATION_PROVIDER } from './providers/video-generation.provider';
import { VideoGenerationController } from './video-generation.controller';
import { VideoGenerationService } from './video-generation.service';

@Module({
  controllers: [VideoGenerationController],
  providers: [
    VideoGenerationService,
    AgnesVideoProvider,
    {
      provide: VIDEO_GENERATION_PROVIDER,
      useExisting: AgnesVideoProvider,
    },
  ],
})
export class VideoGenerationModule {}
