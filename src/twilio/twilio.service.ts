import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from 'src/constants/constants';

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
    const trimmedUserId = userId.slice(0, 5);
    console.log('jama sms number and ckienbt number', clientNumber);
    this.twilioClient.messages
      .create({
        body: `Ha llegado un pedido de userId: ${trimmedUserId}. Solicitó un: ${mealName}`,
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

  sendOrderStatusSMS(
    orderId: string,
    mealName: string,
    clientNumber: string,
    orderStatus: string,
  ) {
    this.twilioSMSNumber = this.configService.get('TWILIO_SMS_SENDER_NUMBER');
    this.jamaSMSNumber = this.configService.get('JAMA_SMS_NUMBER');
    const trimmedOrderId = orderId.slice(0, 5);
    const orderStatusSMS = this.orderStatusResponse(orderStatus);

    this.twilioClient.messages
      .create({
        body: `Su orden: ${trimmedOrderId} con comida ${mealName} está ${orderStatusSMS}`,
        from: this.twilioSMSNumber,
        to: clientNumber,
      })
      .then((message) => {
        console.log('message sent to client', message.sid);
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

  private orderStatusResponse(orderStatus: string): string {
    let orderStatusSMS: string;
    switch (orderStatus) {
      case OrderStatus.onCooking:
        orderStatusSMS = 'En preparación';
        break;
      case OrderStatus.onDelivery:
        orderStatusSMS = 'Lista para entrega';
      case OrderStatus.completed:
        orderStatusSMS = 'Completa';
    }
    return orderStatusSMS;
  }
}
