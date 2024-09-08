import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from '../tenant.service';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly tenetService: TenantService
  ){}
  async intercept(
    context: ExecutionContext, 
    next: CallHandler)
    : Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const taskUser = await this.usersRepository.findOne({
        where: {id:user.sub},
      });
      if (!taskUser) {
        throw new HttpException("User not a have Task",HttpStatus.NON_AUTHORITATIVE_INFORMATION);
      }
  
      this.tenetService.setTenant(taskUser);
  
      return next.handle();
    }
  }
