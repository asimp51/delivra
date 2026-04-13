import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/api/api_config.dart';

/// WebSocket Service with AUTO-RECONNECTION
///
/// Features:
/// - Connects to /tracking namespace
/// - Auto-reconnects on disconnect (exponential backoff)
/// - Re-subscribes to active order on reconnect
/// - Connection state callbacks for UI indicators
class SocketService {
  io.Socket? _socket;
  String? _activeOrderId;
  bool _intentionalDisconnect = false;
  int _reconnectAttempts = 0;
  Timer? _reconnectTimer;

  // Connection state callbacks
  Function()? onConnected;
  Function()? onDisconnected;
  Function(String)? onReconnecting;

  void connect() {
    _intentionalDisconnect = false;
    _reconnectAttempts = 0;

    _socket = io.io('${ApiConfig.wsUrl}/tracking', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'reconnection': true,
      'reconnectionDelay': 1000,
      'reconnectionDelayMax': 10000,
      'reconnectionAttempts': 50,
    });

    _socket!.onConnect((_) {
      print('[Socket] Connected');
      _reconnectAttempts = 0;
      onConnected?.call();

      // Re-subscribe to active order after reconnect
      if (_activeOrderId != null) {
        subscribeToOrder(_activeOrderId!);
      }
    });

    _socket!.onDisconnect((_) {
      print('[Socket] Disconnected');
      onDisconnected?.call();

      if (!_intentionalDisconnect) {
        _attemptReconnect();
      }
    });

    _socket!.onConnectError((err) {
      print('[Socket] Connection error: $err');
      if (!_intentionalDisconnect) {
        _attemptReconnect();
      }
    });
  }

  void _attemptReconnect() {
    _reconnectAttempts++;
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    final delay = Duration(seconds: (1 << _reconnectAttempts).clamp(1, 30));
    onReconnecting?.call('Reconnecting in ${delay.inSeconds}s (attempt $_reconnectAttempts)');

    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(delay, () {
      if (!_intentionalDisconnect) {
        print('[Socket] Reconnecting... attempt $_reconnectAttempts');
        _socket?.connect();
      }
    });
  }

  void subscribeToOrder(String orderId) {
    _activeOrderId = orderId;
    _socket?.emit('subscribe_order', {'order_id': orderId});
  }

  void unsubscribeFromOrder(String orderId) {
    _socket?.emit('unsubscribe_order', {'order_id': orderId});
    if (_activeOrderId == orderId) _activeOrderId = null;
  }

  void onOrderStatusChanged(Function(Map<String, dynamic>) callback) {
    _socket?.on('order_status_changed', (data) => callback(Map<String, dynamic>.from(data)));
  }

  void onRiderLocation(Function(Map<String, dynamic>) callback) {
    _socket?.on('rider_location', (data) => callback(Map<String, dynamic>.from(data)));
  }

  // Chat support
  void joinChat(String orderId) {
    _socket?.emit('join_chat', {'order_id': orderId});
  }

  void sendChatMessage(String orderId, String message, String senderType, String senderName) {
    _socket?.emit('send_message', {
      'order_id': orderId,
      'message': message,
      'sender_type': senderType,
      'sender_name': senderName,
    });
  }

  void onNewChatMessage(Function(Map<String, dynamic>) callback) {
    _socket?.on('new_message', (data) => callback(Map<String, dynamic>.from(data)));
  }

  bool get isConnected => _socket?.connected ?? false;

  void disconnect() {
    _intentionalDisconnect = true;
    _reconnectTimer?.cancel();
    _activeOrderId = null;
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
