import { Module, forwardRef } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { BookingModule } from '../booking/booking.module';


@Module({
  imports: [TypeOrmModule.forFeature([Reservation]),UserModule,RoomModule,BookingModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
  
})
export class ReservationModule {}
