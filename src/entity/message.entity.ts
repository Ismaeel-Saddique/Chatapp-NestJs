// src/entity/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Adjust the path as needed

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    MessageId: string;
  
    @Column()
    content: string;
  
    @Column()
    username: string; // Store the username directly
  
    @Column()
    userId: string; // Store the user ID directly
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  }