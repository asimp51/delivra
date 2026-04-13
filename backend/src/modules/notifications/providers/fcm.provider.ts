/**
 * Firebase Cloud Messaging Provider
 * WIRING GUIDE:
 *
 * STEP 1: Get FCM Server Key
 *   1. Go to Firebase Console → Project Settings → Cloud Messaging
 *   2. Copy "Server Key" (Legacy) or use service account for v1 API
 *   3. Set in .env: FCM_SERVER_KEY=your_key
 *
 * STEP 2: Install firebase-admin SDK:
 *   npm install firebase-admin
 *
 * STEP 3: Download service account JSON from Firebase Console
 *   → Project Settings → Service Accounts → Generate new private key
 *   → Save as backend/firebase-service-account.json
 *   → Add to .gitignore!
 *
 * STEP 4: Store user FCM tokens
 *   When Flutter app calls NotificationService.initialize(),
 *   it gets an FCM token and sends it to: PATCH /api/auth/me { fcm_token: "..." }
 *   Store this token in the users table (add fcm_token column)
 *
 * STEP 5: Send notifications on status changes
 *   In orders.service.ts, after updating order status:
 *   await this.fcmProvider.sendToUser(order.customer_id, {
 *     title: 'Order Update',
 *     body: 'Your order is being prepared!',
 *     data: { order_id: order.id, status: 'preparing' }
 *   });
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FcmProvider {
  constructor(private config: ConfigService) {
    // Initialize Firebase Admin SDK
    // const serviceAccount = require('../../../firebase-service-account.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    // });
  }

  /**
   * Send push notification to a specific user
   * @param fcmToken User's FCM device token
   * @param notification Title and body
   * @param data Deep link data (e.g., { order_id, status })
   */
  async sendToDevice(
    fcmToken: string,
    notification: { title: string; body: string },
    data?: Record<string, string>,
  ) {
    // await admin.messaging().send({
    //   token: fcmToken,
    //   notification: {
    //     title: notification.title,
    //     body: notification.body,
    //   },
    //   data: data || {},
    //   android: {
    //     priority: 'high',
    //     notification: { sound: 'default', channelId: 'delivra_orders' },
    //   },
    //   apns: {
    //     payload: { aps: { sound: 'default', badge: 1 } },
    //   },
    // });

    console.log(`[FCM] Notification: ${notification.title} → ${fcmToken.substring(0, 20)}...`);
  }

  /**
   * Send to multiple devices (e.g., all vendor's devices)
   */
  async sendToMultipleDevices(
    fcmTokens: string[],
    notification: { title: string; body: string },
    data?: Record<string, string>,
  ) {
    // await admin.messaging().sendEachForMulticast({
    //   tokens: fcmTokens,
    //   notification,
    //   data: data || {},
    // });
  }

  /**
   * Predefined notification templates for order events
   */
  getOrderNotification(status: string, orderNumber: string) {
    const templates: Record<string, { title: string; body: string }> = {
      confirmed: { title: 'Order Confirmed!', body: `${orderNumber} has been accepted by the vendor.` },
      preparing: { title: 'Being Prepared', body: `Your order ${orderNumber} is being prepared.` },
      ready_for_pickup: { title: 'Order Ready!', body: `${orderNumber} is ready and waiting for a rider.` },
      rider_assigned: { title: 'Rider Assigned', body: `A rider is heading to pick up ${orderNumber}.` },
      picked_up: { title: 'Picked Up!', body: `Your order ${orderNumber} is on its way!` },
      in_transit: { title: 'Almost There!', body: `${orderNumber} is nearby. Get ready!` },
      delivered: { title: 'Delivered!', body: `${orderNumber} has been delivered. Enjoy!` },
      cancelled: { title: 'Order Cancelled', body: `${orderNumber} has been cancelled.` },
    };
    return templates[status] || { title: 'Order Update', body: `${orderNumber} status updated.` };
  }
}
