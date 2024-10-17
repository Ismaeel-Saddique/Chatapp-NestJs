import { Module } from '@nestjs/common';
import { EntityModule } from 'src/entity/entity.module';
import { MessageService } from './message.service';

@Module({
    imports:[EntityModule],
    providers: [MessageService],
    exports: [MessageService], 
})
export class MessageModule {}
