import { Module } from '@nestjs/common';
import { ChatGateway} from './chat.gateway';
import { UserModule } from 'src/api/user/user.module';
import { PassportModules } from 'src/passport/passport.module';
import { MessageModule } from 'src/api/message/message.module';
import { UserService } from 'src/api/user/user.service';

@Module({
  imports: [UserModule, PassportModules, MessageModule],
  providers: [ChatGateway, UserService]
})
export class GatewayModule {}
