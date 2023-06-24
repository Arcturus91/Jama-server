export enum UserType {
  USER = 'user',
  CHEF = 'chef',
  ADMIN = 'admin',
}

export const jwtConstants = {
  secret: 'gato',
};

export const twloConstants = {
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  twilioSecret: process.env.TWLIO_SECRRET,
};
