import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Message } from "./message.entity";

@Module({
imports:[
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message])
],
exports:[
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Message])
]
})

export class EntityModule{}