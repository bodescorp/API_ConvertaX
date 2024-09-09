import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'strongpassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
