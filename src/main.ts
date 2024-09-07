import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { config } from "dotenv";
import * as hbs from 'hbs';

config()
hbs.registerHelper('gt', (a: number, b: number) => a > b);
hbs.registerHelper('lt', (a: number, b: number) => a < b);
hbs.registerHelper('eq', (a: any, b: any) => a === b);
hbs.registerHelper('add', (a: number, b: number) => a + b);
hbs.registerHelper('subtract', (a: number, b: number) => a - b);


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key', // Substitua por uma chave secreta segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Defina como true se estiver usando HTTPS
  }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('API de Investimentos')
    .setDescription('A API para gerenciamento de investimentos')
    .setVersion('1.0')
    .addTag('investments')
    .addTag('withdrawals')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
