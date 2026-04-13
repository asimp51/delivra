import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Chat Service — real-time messaging between customer and rider
 *
 * How it works:
 * 1. When order is picked up, chat room opens: chat:{order_id}
 * 2. Customer and rider both join the room
 * 3. Messages are exchanged via WebSocket
 * 4. Chat auto-closes after delivery
 *
 * Messages are NOT persisted — they only exist during the active delivery.
 * For persistent chat, add a messages table.
 */
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_chat')
  handleJoin(@MessageBody() data: { order_id: string; user_type: string }, @ConnectedSocket() client: Socket) {
    client.join(`chat:${data.order_id}`);
    client.emit('chat_joined', { order_id: data.order_id });
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: { order_id: string; sender_type: string; sender_name: string; message: string }, @ConnectedSocket() client: Socket) {
    const msg = {
      ...data,
      timestamp: new Date().toISOString(),
      id: `msg_${Date.now()}`,
    };

    // Broadcast to everyone in the chat room (customer + rider)
    this.server.to(`chat:${data.order_id}`).emit('new_message', msg);
  }

  @SubscribeMessage('leave_chat')
  handleLeave(@MessageBody() data: { order_id: string }, @ConnectedSocket() client: Socket) {
    client.leave(`chat:${data.order_id}`);
  }
}
