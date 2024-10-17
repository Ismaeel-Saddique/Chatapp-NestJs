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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Message],
        synchronize: true, // Set this to false in production
      }),
    }),
    GatewayModule, UserModule, MessageModule, EntityModule],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {}
