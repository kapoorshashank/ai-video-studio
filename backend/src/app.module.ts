import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { VideoGenerationModule } from './video-generation/video-generation.module';

@Module({
  imports: [HealthModule, VideoGenerationModule],
})
export class AppModule {}
