import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entity/user.entity';
import { PassportModules } from 'src/passport/passport.module';
import { EntityModule } from 'src/entity/entity.module';

@Module({
  imports: [EntityModule, PassportModules],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
