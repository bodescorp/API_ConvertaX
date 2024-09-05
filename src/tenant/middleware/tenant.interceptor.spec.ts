import { TenantInterceptor } from './middleware/tenant.interceptor';

describe('TenantInterceptor', () => {
  it('should be defined', () => {
    expect(new TenantInterceptor()).toBeDefined();
  });
});
