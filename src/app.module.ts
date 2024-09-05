import { Module } from '@nestjs/common';
import { ViewModule } from './app/view/view.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),ViewModule, DbModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
