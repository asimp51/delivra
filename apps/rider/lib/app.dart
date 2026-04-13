import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'config/routes.dart';

class DelivraRiderApp extends StatelessWidget {
  const DelivraRiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Delivra Rider',
      debugShowCheckedModeBanner: false,
      theme: RiderTheme.lightTheme,
      routerConfig: riderRouter,
    );
  }
}
