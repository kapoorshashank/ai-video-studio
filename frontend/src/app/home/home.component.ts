import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

interface HealthResponse {
  status: 'ok';
}

interface VideoCreationResponse {
  id: string;
  status: string;
}

interface VideoStatusResponse {
  id: string;
  status: string;
  videoUrl?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NgIf],
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);

  protected healthStatus = 'Checking backend…';
  protected generationStatus = '';
  protected videoUrl = '';

  protected selectedAspectRatio: '16:9' | '9:16' = '16:9';
  protected selectedDuration: 5 | 10 = 10;

  ngOnInit(): void {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: ({ status }) => {
        this.healthStatus = `Backend status: ${status}`;
      },
      error: () => {
        this.healthStatus =
          'Backend is unavailable. Start the API server to connect.';
      },
    });
  }

  protected generateVideo(prompt: string): void {
    this.videoUrl = '';
    this.generationStatus = 'Starting video generation…';

    this.http
      .post<VideoCreationResponse>('http://localhost:3000/api/videos', {
        prompt,
        aspectRatio: this.selectedAspectRatio,
        duration: this.selectedDuration,
      })
      .subscribe({
        next: ({ id }) => {
          this.pollVideo(id);
        },
        error: (error) => {
          console.error('VIDEO CREATION ERROR:', error);
          this.generationStatus = 'Video generation failed.';
        },
      });
  }

  private pollVideo(id: string): void {
    this.http
      .get<VideoStatusResponse>(`http://localhost:3000/api/videos/${id}`)
      .subscribe({
        next: (response) => {
          console.log('VIDEO STATUS RESPONSE:', response);

          this.generationStatus = `Video ${id}: ${response.status}`;

          if (response.status === 'completed' && response.videoUrl) {
            this.videoUrl = response.videoUrl;
            console.log('VIDEO URL SET:', this.videoUrl);
            return;
          }

          if (response.status === 'failed') {
            this.generationStatus = 'Video generation failed.';
            return;
          }

          setTimeout(() => this.pollVideo(id), 60000);
        },
        error: (error) => {
          console.error('VIDEO STATUS ERROR:', error);
          this.generationStatus = 'Unable to check video status.';
        },
      });
  }
}