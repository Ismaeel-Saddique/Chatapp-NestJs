import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { UserService } from "src/api/user/user.service";
@Injectable()
export class GatewayGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient()
        const token = this.extractTokenFromHandshake(client);


        if (!token) {
            throw new WsException('Unauthorized');
        }

        const user = await this.userService.validateToken(token);
        if (!user) {
            throw new WsException('Unauthorized');
        }

        // Attach the user to the WebSocket client object
        client.user = user;
        return true;
    }

    extractTokenFromHandshake(client: any): string {
        return client.handshake?.query?.token; // Adjust this based on how the token is sent
    }

}
