import 'package:socket_io_client/socket_io_client.dart' as io;

/// Rider WebSocket Service — real-time delivery offers + location streaming
/// WIRING GUIDE:
/// 1. Connect when rider goes online
/// 2. Listen for delivery_offer events (new order assignments)
/// 3. Stream rider GPS location to backend every 5-10 seconds during delivery
/// 4. Disconnect when rider goes offline
class RiderSocketService {
  static const String _wsUrl = 'http://localhost:3000';
  // Production: 'https://api.delivra.com'

  io.Socket? _socket;

  void connect(String riderId) {
    _socket = io.io('$_wsUrl/delivery', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) {
      print('Rider socket connected');
      _socket!.emit('rider_go_online', {'rider_id': riderId});
    });

    _socket!.onDisconnect((_) => print('Rider socket disconnected'));
  }

  /// Listen for new delivery offers from system
  void onDeliveryOffer(Function(Map<String, dynamic>) callback) {
    _socket?.on('delivery_offer', (data) => callback(Map<String, dynamic>.from(data)));
  }

  /// Send rider GPS location to backend (during active delivery)
  void sendLocation(double lat, double lng, String orderId) {
    _socket?.emit('rider_location', {
      'latitude': lat,
      'longitude': lng,
      'order_id': orderId,
    });
  }

  void disconnect(String riderId) {
    _socket?.emit('rider_go_offline', {'rider_id': riderId});
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
