/* eslint-disable @typescript-eslint/no-unused-vars */
// ==================================================
// ollama.module.ts
// ==================================================
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule
import { ConfigModule } from '@nestjs/config'; // For environment variables
import { OllamaController } from './ollama.controller';
import { OllamaService } from './ollama.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make config available globally
    }),
  ],
  controllers: [OllamaController],
  providers: [OllamaService],
})
export class OllamaModule {}


