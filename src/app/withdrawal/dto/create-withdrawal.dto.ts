import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'O valor da retirada',
    example: 100.50,
    minimum: 0,
  })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  @Min(0, { message: 'O valor deve ser maior ou igual a 0' })
  amount: number;
}
