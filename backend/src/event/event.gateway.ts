import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  import { AuththenticationSoket } from 'src/auth/guard/authSocket.guard';

  
  @WebSocketGateway({
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:3000",];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true, 
    },
    perMessageDeflate: true,
  })
  export class EventGeteWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    private activeUsers = new Map<string, Set<string>>();
    private clientToUser = new Map<string, string>();
  
    constructor(
      private readonly authenticationSoket: AuththenticationSoket,
    ) {}
  
    async afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }
  
    async handleConnection(client: Socket) {
      try {
        const user = await this.authenticationSoket.authenticate(client);
        if (!user) {
          throw new WsException('Unauthorized');
        }
  
        const userId = user._id.toString();
  
        if (!this.activeUsers.has(userId)) {
          this.activeUsers.set(userId, new Set());
        }
  
        this.activeUsers.get(userId).add(client.id);
        this.clientToUser.set(client.id, userId);
  
        client.join(`user:${userId}`);
        console.log(`{ ${userId}: [${Array.from(this.activeUsers.get(userId)).join(', ')}] }`);
      } catch (error) {
        console.error('Error during connection:', error);
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket) {
      const userId = this.clientToUser.get(client.id);
  
      if (userId) {
        const userSockets = this.activeUsers.get(userId);
        if (userSockets) {
          userSockets.delete(client.id);
          this.clientToUser.delete(client.id);
  
          // Log disconnect
          console.log(`disconnect: ${client.id} from ${userId}`);
  
          if (userSockets.size === 0) {
            this.activeUsers.delete(userId);
            this.server.emit('userDisconnected', { userId });
            console.log(`{ ${userId}: [] }`);
          } else {
            console.log(`{ ${userId}: [${Array.from(userSockets).join(', ')}] }`);
          }
        }
      }
    }
    
    getServer(): Server {
        return this.server;
    }

    @SubscribeMessage('locationUpdate')
    async handleLocationUpdate(client: Socket, payload: { lat: number; lng: number }) {
      const userId = this.clientToUser.get(client.id);
      if (!userId) {
        throw new WsException('Unauthorized');
      }

      const position = { userId, lat: payload.lat, lng: payload.lng };
      this.server.to(client.id).emit('userLocationChanged', position);
    
    }

  @SubscribeMessage('userPositionUpdate')
    handlePositionUpdate(client: Socket, data: any) {
    console.log('User position update:', data);
    client.emit('positionUpdated', data);
  }
    
}