import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, MessageBody, ConnectedSocket,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/api/user/user.service';
import { User } from 'src/entity/user.entity';
import { CreateMessageDto } from 'src/dtos/createmessage.dto';
import { MessageService } from 'src/api/message/message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: { [clientId: string]: User } = {}; // To store connected users
  private readonly jwtService: JwtService;
  private readonly userService: UserService;
  private readonly messageService : MessageService;

  constructor(jwtService: JwtService, userService: UserService, messageService: MessageService) {
    this.jwtService = jwtService;
    this.userService = userService;
    this.messageService = messageService; 
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token; // Get the token from the client's handshake
    if (!token) {
      console.log(`Client ${client.id} did not provide a token.`);
      client.disconnect(); // Disconnect if no token is provided
      return;
    }
    try {
      const payload = this.jwtService.verify(token); // Verify the JWT token
      const user = await this.userService.findById(payload.userid); // Fetch the user from the repository
      if (user) {
        this.users[client.id] = user;
        this.server.emit('users', this.users);
        console.log(`Client connected: ${client.id} as ${user.username}`);
      } else {
        console.log(`User not found for token, disconnecting client ${client.id}.`);
        client.disconnect();
      }
    } catch (error) {
      console.error(`Invalid token from client ${client.id}:`, error.message);
      client.disconnect(); // Disconnect if token verification fails
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    delete this.users[client.id];
    this.server.emit('users', this.users); // Emit updated user list to all clients
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket) {
    const user = this.users[client.id]
    if (user) {
      console.log(`${user.username} joined the chat`);
      this.server.emit('users', this.users); // Emit updated user list to all clients
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { message: string }) {
    const user = this.users[client.id]
    if (user) {
      const messageDto: CreateMessageDto = {
        content: data.message,
        username: user.username,
        userId: user.userId.toString(),
      }
      await this.messageService.createMessage(messageDto); // Save to database
      this.server.emit('message', { username: user.username, message: data.message });
    }
    else {
      console.log(`Client with ID ${client.id} attempted to send a message without joining.`);
    }
  }

}
