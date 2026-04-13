import 'package:socket_io_client/socket_io_client.dart' as io;

/// Vendor WebSocket — listens for new incoming orders in real-time
/// Plays audio alert when new order arrives
class VendorSocketService {
  static const String _wsUrl = 'http://localhost:3000';
  io.Socket? _socket;

  void connect(String vendorId) {
    _socket = io.io('$_wsUrl/delivery', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    _socket!.onConnect((_) {
      _socket!.emit('vendor_subscribe', {'vendor_id': vendorId});
    });
  }

  /// Listen for new order notifications
  void onNewOrder(Function(Map<String, dynamic>) callback) {
    _socket?.on('new_order', (data) => callback(Map<String, dynamic>.from(data)));
  }

  /// Listen for rider assignment updates
  void onRiderAssigned(Function(Map<String, dynamic>) callback) {
    _socket?.on('rider_assigned', (data) => callback(Map<String, dynamic>.from(data)));
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
