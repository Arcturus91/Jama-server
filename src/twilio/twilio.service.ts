import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioWhatsappService {
  private twilioClient: Twilio;
  private twilioNumber: string;
  private jamaNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = new Twilio(accountSid, authToken);
    this.twilioNumber = process.env.TWILIO_SENDER_NUMBER;
    this.jamaNumber = process.env.JAMA_NUMBER;
  }

  sendMessages(userId: string, mealName: string) {
    this.twilioClient.messages
      .create({
        body: `Ha llegado un pedido de userId: ${userId}. Solicitó un: ${mealName}`,
        from: this.twilioNumber,
        to: this.jamaNumber,
      })
      .then((message) => console.log('message sent', message.sid))
      .catch((error) => {
        console.error('Error sending sms message:', error);
      });
  }
}
