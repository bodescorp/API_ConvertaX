import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as fs from 'fs';

config();
async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  let httpsOptions = undefined;

  // Carregar certificados apenas em produção
  if (isProduction) {
    httpsOptions = {
      key: fs.readFileSync(join(__dirname, '..', 'certs/key.pem')),
      cert: fs.readFileSync(join(__dirname, '..', 'certs/cert.pem')),
    };
  }

  // Criar a aplicação
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: httpsOptions,
  });

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe());

  // Configurações do Handlebars
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Configuração do Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Investimentos')
    .setDescription('A API para gerenciamento de investimentos')
    .setVersion('1.0')
    .addTag('investments')
    .addTag('withdrawals')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Definir a porta e iniciar o servidor
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Application is running on ${isProduction ? 'https' : 'http'}://localhost:${port}/view`);
  });
}

bootstrap();
