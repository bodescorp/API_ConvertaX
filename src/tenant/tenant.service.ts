import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entities/user.entity';

@Injectable()
export class TenantService {
    private tenant: UserEntity

    setTenant(tenant:UserEntity){
        this.tenant = tenant
    }

    getTenant(){
        return this.tenant
    }
}
