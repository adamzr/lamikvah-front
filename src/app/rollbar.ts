import Rollbar from 'rollbar';
import {
  Injectable,
  Inject,
  InjectionToken,
  ErrorHandler
} from '@angular/core';

const rollbarConfig = {
  accessToken: '7084372e84204614bd910b214fe038ff',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err:any) : void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}