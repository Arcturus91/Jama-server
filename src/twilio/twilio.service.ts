import { Injectable } from '@nestjs/common';
/* import { Twilio } from 'twilio'; */
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioWhatsappService {
  /* private twilioClient: Twilio;
  private twilioNumber: string;
  private jamaNumber: string;
  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  sendMessages(userId: string, mealName: string) {
    this.twilioNumber = this.configService.get('TWILIO_SENDER_NUMBER');
    this.jamaNumber = this.configService.get('JAMA_NUMBER');

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
  } */
}
