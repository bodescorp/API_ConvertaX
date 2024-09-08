import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('users')
@Controller('users')
@UseGuards(ThrottlerGuard)


export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: CreateUserResponseDto })
  @ApiResponse({ status: 409, description: 'Nome de usuário já registrado' })
  async create(@Body() user: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.usersService.create(user);
  }
}
