import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

bootstrapApplication(AppComponent, appConfig)
  .then(() => defineElement(lottie.loadAnimation))
  .catch((err) => console.error(err));
