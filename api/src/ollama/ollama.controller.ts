
// ==================================================
// ollama.controller.ts
// ==================================================
import { Controller, Post, Body, HttpCode, ValidationPipe } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { GenerateRequestDto, ChatRequestDto } from './dto/ollama.request.dto'; // Assuming DTOs are in dto folder

@Controller('api/ollama') // Base path for the controller
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('generate')
  @HttpCode(200) // Set default success code to 200
  async generate(@Body(new ValidationPipe()) generateDto: GenerateRequestDto) {
    // ValidationPipe automatically validates incoming body against the DTO
    return this.ollamaService.generate(generateDto);
  }

  @Post('chat')
  @HttpCode(200)
  async chat(@Body(new ValidationPipe()) chatDto: ChatRequestDto) {
    return this.ollamaService.chat(chatDto);
  }
}