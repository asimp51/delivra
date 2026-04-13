import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/delivery' })
export class DeliveryGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('rider_go_online')
  handleGoOnline(@MessageBody() data: { rider_id: string }, @ConnectedSocket() client: Socket) {
    client.join(`rider:${data.rider_id}`);
    client.emit('online', { status: 'online' });
  }

  @SubscribeMessage('rider_go_offline')
  handleGoOffline(@MessageBody() data: { rider_id: string }, @ConnectedSocket() client: Socket) {
    client.leave(`rider:${data.rider_id}`);
    client.emit('offline', { status: 'offline' });
  }

  @SubscribeMessage('vendor_subscribe')
  handleVendorSubscribe(@MessageBody() data: { vendor_id: string }, @ConnectedSocket() client: Socket) {
    client.join(`vendor:${data.vendor_id}`);
  }

  emitToRider(riderId: string, event: string, data: any) {
    this.server.to(`rider:${riderId}`).emit(event, data);
  }

  emitToVendor(vendorId: string, event: string, data: any) {
    this.server.to(`vendor:${vendorId}`).emit(event, data);
  }
}
