import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  @ApiProperty({ description: 'O ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'Nome de usuário', example: 'john_doe' })
  username: string;
}
