import { Module, forwardRef } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Accounts } from './entities/accounts.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { CouponModule } from '../coupon/coupon.module';
import { ManagementModule } from '../management/management.module';


@Module({
  imports: [TypeOrmModule.forFeature([Accounts, Booking]),
  forwardRef(() => UserModule),
  forwardRef(() =>RoomModule),
  forwardRef(() =>CouponModule),
  ManagementModule,],

  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
