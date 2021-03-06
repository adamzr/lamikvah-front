// `.env.json` is generated by the `npm run build` command
import * as envData from './.env';

export const environment = {
  production: false,
  version: envData.env.npm_package_version,
  serverUrl: 'https://mikvah.site',
  callbackUrl: 'https://test.mikvah.website/callback',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ],
  stripeKey: 'pk_test_Xrh9lP7HMEWdXVqy6l2ixTqi'
};
