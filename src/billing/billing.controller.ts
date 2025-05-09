import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';

@Controller('billing')
export class BillingController {

    constructor() {}
    
    //create bill by taking booking id in param
     @Post('bill/:bookingId')
    async createBill(@Param('bookingId', ParseIntPipe) bookingId: number) {
      



    }
}
