// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyA6bU_OuTFQ4zYmEtAWppggYVdo_W7on78",
    authDomain: "agromanager-e2ec7.firebaseapp.com",
    projectId: "agromanager-e2ec7",
    storageBucket: "agromanager-e2ec7.firebasestorage.app",
    messagingSenderId: "904391927976",
    appId: "1:904391927976:web:5d883fbe73e7a40b71ba9d",
    measurementId: "G-JPZEQ03SFX"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
