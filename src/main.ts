import { bootstrapApplication } from '@angular/platform-browser';
import { startServer } from '@planess/train-a-backend';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

startServer()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((err) => console.error(err));
