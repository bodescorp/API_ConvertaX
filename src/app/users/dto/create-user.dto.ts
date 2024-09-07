import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nome de usuário', example: 'john_doe' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  password: string;
}
