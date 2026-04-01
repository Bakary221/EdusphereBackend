import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { AuthModule } from '@modules/auth/auth.module';
import { RolesGuard } from '@common/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, RolesGuard],
})
export class SuperAdminModule {}
