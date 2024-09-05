import { Module } from '@nestjs/common';
import { ViewModule } from './app/view/view.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),ViewModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
