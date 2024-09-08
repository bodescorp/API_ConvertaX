import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantInterceptor } from './middleware/tenant.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [TenantService, TenantInterceptor],
  exports: [TenantService,TenantInterceptor]
})
export class TenantModule {}
