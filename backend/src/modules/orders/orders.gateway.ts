import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/tracking' })
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribe_order')
  handleSubscribe(@MessageBody() data: { order_id: string }, @ConnectedSocket() client: Socket) {
    client.join(`order:${data.order_id}`);
    client.emit('subscribed', { order_id: data.order_id });
  }

  @SubscribeMessage('unsubscribe_order')
  handleUnsubscribe(@MessageBody() data: { order_id: string }, @ConnectedSocket() client: Socket) {
    client.leave(`order:${data.order_id}`);
  }

  emitOrderStatusChange(orderId: string, status: string, data?: any) {
    this.server.to(`order:${orderId}`).emit('order_status_changed', {
      order_id: orderId,
      status,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  emitRiderLocation(orderId: string, lat: number, lng: number) {
    this.server.to(`order:${orderId}`).emit('rider_location', {
      order_id: orderId,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
    });
  }

  emitNewOrderToVendor(vendorId: string, order: any) {
    this.server.to(`vendor:${vendorId}`).emit('new_order', order);
  }

  emitDeliveryOffer(riderId: string, order: any) {
    this.server.to(`rider:${riderId}`).emit('delivery_offer', order);
  }
}
