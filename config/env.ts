/**
 * Environment access for infrastructure layers.
 *
 * Nothing above `infrastructure` should read `process.env` directly — import
 * `env` from here so required variables are declared in exactly one place.
 */
const env = {
  pin: process.env.PIN,
  spreadsheetId: process.env.SHEETID,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
};

export { env };
