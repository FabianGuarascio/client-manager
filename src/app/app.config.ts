import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

/**
 * AngularFire compat (7.6.1) expone sus servicios via NgModules, no via
 * providers standalone (`provideFirestore`/`provideAuth` son de la API
 * modular v9, que este proyecto no usa) — se registran con
 * `importProvidersFrom` en vez de perder la compatibilidad de versiones.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
    ),
  ],
};
