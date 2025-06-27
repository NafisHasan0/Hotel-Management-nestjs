import { Controller, Post, Body, Param, Patch, Get, Query,ParseIntPipe, BadRequestException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateInPersonBookingDto, CreateCheckinWithReservationDto, UpdateBookingDto, CreateAccountDto, CheckoutDto, SearchByPaymentStatusDto, SearchByTypeOfBookingDto, SearchByCouponCodeDto, RoomServiceDto } from './dtos/booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('in-person')
  async createInPersonBooking(@Body() dto: CreateInPersonBookingDto) {
    return this.bookingService.createInPersonBooking(dto);
  }

  @Post('checkin-reservation')
  async checkinWithReservation(@Body() dto: CreateCheckinWithReservationDto) {
    return this.bookingService.checkinWithReservation(dto);
  }

  @Patch('update/:booking_id')
  async updateBooking(@Param('booking_id') booking_id: number, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateBooking(booking_id, dto);
  }

  @Post('account/:booking_id')
  async createAccount(@Param('booking_id') booking_id: number, @Body() dto: CreateAccountDto) {
    return this.bookingService.createAccount(booking_id, dto);
  }

  @Post('checkout')
  async checkout(@Body() dto: CheckoutDto) {
    return this.bookingService.checkout(dto);
  }

  @Get('payment-status')
  async searchByPaymentStatus(@Query() dto: SearchByPaymentStatusDto) {
    return this.bookingService.searchByPaymentStatus(dto);
  }

  @Get('type')
  async searchByTypeOfBooking(@Query() dto: SearchByTypeOfBookingDto) {
    return this.bookingService.searchByTypeOfBooking(dto);
  }

  @Get('coupon')
  async searchByCouponCode(@Query() dto: SearchByCouponCodeDto) {
    return this.bookingService.searchByCouponCode(dto);
  }


  @Get('all')
  async viewAllBooking() {
    return this.bookingService.viewAllBooking();
  }

//search account by booking id
  @Get('account/:booking_id')
  async searchAccountByBookingId(@Param('booking_id') booking_id: number) {
    return this.bookingService.searchAccountByBookingId(booking_id);
  }

  //sarch booking by bookingid
  @Get(':booking_id')
  async searchBookingById(@Param('booking_id', ParseIntPipe) booking_id: number) {
    return this.bookingService.searchBookingById(booking_id);
  }


  //view all booking history
  @Get('bookinghistory/all') 
  async viewAllBookingHistory() {
    return this.bookingService.viewAllBookingHistory();
  }

  //search booking by inputing customer name
  @Get('searchbyname/:customer_name')
  async searchBookingByName(@Param('customer_name') customer_name: string) {
    return this.bookingService.searchBookingByName(customer_name);
  }
  


  @Get('due/:roomNum')
  async getBookingDetailsByRoomNumber(
    @Param('roomNum', ParseIntPipe) roomNum: number,
  ){
    return this.bookingService.getBookingDetailsByRoomNumber(roomNum);
  }

  @Post('available-rooms')
  async searchAvailableRooms(
    @Body() body: { checkin_date: string; checkout_date: string },
  ) {
    // Convert strings to Date objects
    const checkinDate = new Date(body.checkin_date);
    const checkoutDate = new Date(body.checkout_date);
  
    // Perform operations with the Date objects
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    if (checkinDate >= checkoutDate) {
      throw new BadRequestException('Check-in date must be before check-out date');
    }
  
    return this.bookingService.searchAvailableRooms(checkinDate, checkoutDate);
  }

  
 

}