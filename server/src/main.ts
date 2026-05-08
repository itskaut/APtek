// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ВКЛЮЧАЕМ CORS
  // Это позволит твоему фронтенду (например, на порту 5173) 
  // делать запросы к этому серверу (на порт 3000)
  app.enableCors();

  // Сервер будет слушать порт 3000
  await app.listen(3000);
  
  console.log(`Application is running on: http://localhost:3000`);
}

bootstrap();