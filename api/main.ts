import { NestFactory } from '@nestjs/core';
import { OllamaModule } from './src/ollama/ollama.module'; // Adjust path if needed
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OllamaModule);
  const logger = new Logger('Bootstrap');

  // Optional: Enable CORS if your frontend is on a different origin
  app.enableCors();

  const port = process.env.PORT || 3000; // Use PORT from env or default to 3000
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  logger.log(`Ollama Wrapper API ready at http://localhost:${port}/api/ollama`);
}
bootstrap();

