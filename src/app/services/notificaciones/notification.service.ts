import { inject, Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  messaging;

  constructor() {
    const firebaseApp = inject(FirebaseApp);
    this.messaging = getMessaging(firebaseApp);
  }

  async requestPermission() {
    const token = await getToken(this.messaging, {
      vapidKey: 'TU_VAPID_KEY_PUBLICA',
    });
    console.log('Token del dispositivo:', token);
  }

  listenToMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Notificación recibida en foreground:', payload);
    });
  }
  
}
