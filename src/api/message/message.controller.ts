import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageservice: MessageService){}

    @Get()
    async getMessages() {
        return await this.messageservice.getAllMessages();
    }

}
