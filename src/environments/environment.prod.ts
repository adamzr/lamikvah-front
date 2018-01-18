// `.env.json` is generated by the `npm run build` command
import env from './.env.json';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'https://api.chucknorris.io',
  callbackUrl: 'https://mikvah.netlify.com/callback',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ]
};
