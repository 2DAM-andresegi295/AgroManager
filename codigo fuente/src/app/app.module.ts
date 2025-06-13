import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';





@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      menuType: 'overlay',}),
     AppRoutingModule,
     IonicModule],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy},
    provideFirebaseApp(() => initializeApp({ projectId: "agromanager-e2ec7", appId: "1:904391927976:web:5902175d6e878a0a71ba9d", storageBucket: "agromanager-e2ec7.firebasestorage.app", apiKey: "AIzaSyA6bU_OuTFQ4zYmEtAWppggYVdo_W7on78", authDomain: "agromanager-e2ec7.firebaseapp.com", messagingSenderId: "904391927976", measurementId: "G-MPZY5LHBS3" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
