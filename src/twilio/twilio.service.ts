import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioMessagingService {
  private twilioClient: Twilio;
  private twilioWspNumber: string;
  private jamaWspNumber: string;
  private twilioSMSNumber: string;
  private jamaSMSNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  sendSMS(userId: string, mealName: string, clientNumber: string) {
    this.twilioSMSNumber = this.configService.get('TWILIO_SMS_SENDER_NUMBER');
    this.jamaSMSNumber = this.configService.get('JAMA_SMS_NUMBER');
    console.log('jama sms number and ckienbt number', clientNumber);
    this.twilioClient.messages
      .create({
        body: `Ha llegado un pedido de userId: ${userId}. Solicitó un: ${mealName}`,
        from: this.twilioSMSNumber,
        to: this.jamaSMSNumber,
      })
      .then((message) => {
        console.log('message sent to admin', message.sid);
        this.twilioClient.messages
          .create({
            body: `Su pedido ha sido registrado.`,
            from: this.twilioSMSNumber,
            to: clientNumber,
          })
          .then((message2) =>
            console.log('message sent to client', message2.sid),
          );
      })
      .catch((error) => {
        console.error('Error sending sms message:', error);
      });
  }

  sendWSP(userId: string, mealName: string) {
    this.twilioWspNumber = this.configService.get('TWILIO_WSP_SENDER_NUMBER');
    this.jamaWspNumber = this.configService.get('JAMA_WSP_NUMBER');

    this.twilioClient.messages
      .create({
        body: `Ha llegado un pedido de userId: ${userId}. Solicitó un: ${mealName}`,
        from: this.twilioWspNumber,
        to: this.jamaWspNumber,
      })
      .then((message) => console.log('message sent', message.sid))
      .catch((error) => {
        console.error('Error sending sms message:', error);
      });
  }
}
