import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { UserService } from './api/user/user.service';
import { UserController } from './api/user/user.controller';
import { UserModule } from './api/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { MessageService } from './api/message/message.service';
import { MessageController } from './api/message/message.controller';
import { MessageModule } from './api/message/message.module';
import { EntityModule } from './entity/entity.module';
import { Message } from './entity/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.PGHOST,
        port: +process.env.PGPORT, 
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABAS,
        entities: [User, Message],
        synchronize: true, 
      }),
    }),
    GatewayModule, UserModule, MessageModule, EntityModule],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {}
