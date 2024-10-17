import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: String;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

}
