import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/dtos/createmessage.dto';
import { Message } from 'src/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
      ) {}
    
      async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        const message = this.messageRepository.create(createMessageDto); // Create a new message instance
        return this.messageRepository.save(message); // Save the instance
      }
    
      async getAllMessages(): Promise<Message[]> {
        return this.messageRepository.find(); // Fetch all messages
      }
    }

