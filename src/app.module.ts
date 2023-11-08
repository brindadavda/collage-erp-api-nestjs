import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthLocalGuard } from './modules/auth.guard';
import { RoleLocalGuard } from './modules/role.guard';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/collage-erp-nest'),
    UserModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService , AuthLocalGuard , RoleLocalGuard],
})
export class AppModule {}
