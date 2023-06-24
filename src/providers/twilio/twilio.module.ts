import { Module } from '@nestjs/common';
import { TwilioWhatsappService } from './twilio.service';

@Module({
  providers: [TwilioWhatsappService],
  exports: [TwilioWhatsappService],
})
export class TwilioModule {}
