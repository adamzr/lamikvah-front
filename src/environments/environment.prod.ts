// `.env.json` is generated by the `npm run build` command
import env from './.env.json';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'https://mikvah.site',
  callbackUrl: 'https://lamikvah.org/callback',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ],
  stripeKey: 'pk_live_dLo2lxvl9eKLaOqwk4XKFOi3'
};
