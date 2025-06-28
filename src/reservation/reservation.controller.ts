import { Controller, Post, Body,Get,Delete, Param, ParseIntPipe } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dtos/reservation.dto';
import { Role } from '../auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}


  @Post('booking')
  // @Role('user')
  // @Role('manager')
  // @Role('receptionist')
  // @Role('admin')
  async create(@Body() dto: CreateReservationDto) {
    return this.reservationService.create(dto);
  }

  //get all the reservations
  // @Role('manager')
  // @Role('receptionist')
  // @Role('admin')
    @Get('getAllReservations')
    async getAllReservations() {
        return this.reservationService.getAllReservations();
    }

    //delete my reservation in param use pipe
    // @Role('user')
    @Delete('deleteReservation/:reservation_id')
    async deleteReservation(@Param('reservation_id',ParseIntPipe) reservation_id: number) {
        return this.reservationService.deleteReservation(reservation_id);
    }
    
    

    

}