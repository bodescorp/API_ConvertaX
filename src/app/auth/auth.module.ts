import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/db/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [JwtModule.registerAsync({
    global:true,
    imports:[],
    useFactory: async(configService:ConfigService) =>({
      secret:configService.get<string>('JWT_SECRET'),
      signOptions:{expiresIn: +configService.get<number>('JWT_EXPIRATION_TIME')}
    }),
    inject:[ConfigService]
  }), TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
