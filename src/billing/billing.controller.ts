import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Response } from 'express';


@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('room/:booking_id')
  async generateBillingPdf(
    @Param('booking_id', ParseIntPipe) booking_id: number,
    @Res() res: Response,
  ) {
    const { pdfBuffer, responseDto } = await this.billingService.generateBillingPdf(booking_id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${responseDto.booking_id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}