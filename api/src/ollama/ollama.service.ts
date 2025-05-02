// ==================================================
// ollama.service.ts
// ==================================================
import { Injectable, Logger, InternalServerErrorException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GenerateRequestDto, ChatRequestDto } from './dto/ollama.request.dto'; // Assuming DTOs are in dto folder

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly ollamaApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {
    // Get Ollama URL from environment variable or use a default
    // Default assumes running via Docker Compose with service name 'ollama'
    this.ollamaApiUrl = this.configService.get<string>(
      'OLLAMA_API_URL',
      'http://ollama:11434', // Default for docker-compose
    );
    this.logger.log(`Ollama API URL set to: ${this.ollamaApiUrl}`);
  }

  // --- Generate Endpoint ---
  async generate(generateDto: GenerateRequestDto): Promise<any> {
    const url = `${this.ollamaApiUrl}/api/generate`;
    this.logger.log(`Forwarding generate request to ${url} for model ${generateDto.model}`);

    try {
      // Use firstValueFrom to convert Observable to Promise
      const response = await firstValueFrom(
        this.httpService.post(url, {
            ...generateDto,
            stream: false // Force non-streaming for simple wrapper
        }),
      );
      this.logger.log(`Received successful response from Ollama generate endpoint.`);
      return response.data; // Return the data part of the Axios response
    } catch (error) {
        this.handleError(error, 'generate');
    }
  }

  // --- Chat Endpoint ---
  async chat(chatDto: ChatRequestDto): Promise<any> {
    const url = `${this.ollamaApiUrl}/api/chat`;
     this.logger.log(`Forwarding chat request to ${url} for model ${chatDto.model}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, {
            ...chatDto,
            stream: false // Force non-streaming for simple wrapper
        }),
      );
      this.logger.log(`Received successful response from Ollama chat endpoint.`);
      return response.data;
    } catch (error) {
       this.handleError(error, 'chat');
    }
  }

  // --- Error Handling ---
  private handleError(error: unknown, context: string): never {
     if (error instanceof AxiosError) {
        this.logger.error(`AxiosError in ${context}: ${error.message}`, error.stack);
        // Forward Ollama's error status and message if possible
        throw new HttpException(
          error.response?.data || { message: `Ollama API error: ${error.message}` },
          error.response?.status || 500,
        );
      } else {
        this.logger.error(`Unexpected error in ${context}: ${error}`, (error as Error).stack);
        throw new InternalServerErrorException(`An unexpected error occurred while contacting Ollama.`);
      }
  }
}