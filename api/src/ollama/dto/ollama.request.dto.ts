// ==================================================
// dto/ollama.request.dto.ts
// (Create a 'dto' folder in your src directory)
// ==================================================
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// --- DTO for /api/generate ---
export class GenerateRequestDto {
  @IsString()
  @IsNotEmpty()
  model?: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  // Add other optional Ollama parameters as needed
  @IsOptional()
  @IsObject()
  options?: Record<string, any>;

  @IsOptional()
  @IsString()
  system?: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsArray()
  context?: number[];
}

// --- DTO for /api/chat ---
class MessageDto {
  @IsString()
  @IsNotEmpty()
  role: 'system' | 'user' | 'assistant';

  @IsString()
  @IsNotEmpty()
  content: string;

  // Optional: Add images if needed for multimodal models
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => MessageDto) // Required for nested validation
  @IsNotEmpty()
  messages: MessageDto[];

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;

  @IsOptional()
  @IsString()
  template?: string;
}
