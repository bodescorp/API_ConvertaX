import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
  @ApiProperty({
    description: 'The JWT token returned upon successful authentication.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'The expiration time of the JWT token in seconds.',
    example: 3600,
  })
  expiresIn: number;
}

export interface RequestWithUserId extends Request {

    user: {

        sub: string;

        username: string;
    }
}