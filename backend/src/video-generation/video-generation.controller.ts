import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import {
  parseCreateVideoRequest,
  type CreateVideoRequest,
} from './dto/create-video.request';
import {
  type VideoCreationResponse,
  VideoGenerationService,
  type VideoStatusResponse,
} from './video-generation.service';

@Controller('videos')
export class VideoGenerationController {
  constructor(private readonly videoGenerationService: VideoGenerationService) {}

  @Post()
  create(@Body() body: unknown): Promise<VideoCreationResponse> {
    const request: CreateVideoRequest = parseCreateVideoRequest(body);
    return this.videoGenerationService.create(request);
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<VideoStatusResponse> {
    return this.videoGenerationService.getById(id);
  }
}
