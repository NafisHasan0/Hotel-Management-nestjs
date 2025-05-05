import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Rooms } from '../room/entities/room.entity';
import { Booking } from '../booking/entities/booking.entity';
import { User } from '../user/entities/user.entity';
import { CreateReservationDto } from './dtos/reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    @InjectRepository(Rooms) private roomsRepository: Repository<Rooms>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateReservationDto): Promise<any> {
    // Validate user
    const user = await this.userRepository.findOneBy({ user_id: dto.user_id });
    if (!user) {
      return { message: 'User not found' };
    }

    // Validate dates
    const checkinDate = new Date(dto.checkin_date);
    const checkoutDate = new Date(dto.checkout_date);
    if (checkinDate >= checkoutDate) {
      return { message: 'Check-in date must be before check-out date' };
    }

    // Validate rooms (check existence only, no room_status)
    const rooms = await this.roomsRepository.find({
      where: { room_num: In(dto.room_num) },
    });
    if (rooms.length !== dto.room_num.length) {
      return { message: 'One or more rooms do not exist' };
    }

    // Check for conflicts in Reservation table
    const conflictingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.room_num && :roomNums', { roomNums: dto.room_num })
      .andWhere(
        '(:checkin <= reservation.checkout_date AND :checkout >= reservation.checkin_date)',
        { checkin: checkinDate, checkout: checkoutDate },
      )
      .andWhere(
        'NOT (reservation.checkout_date = :checkin)',
        { checkin: checkinDate },
      )
      .getMany();

    if (conflictingReservations.length > 0) {
      return { message: 'One or more rooms are not available for the selected dates' };
    }

    // Check for conflicts in Booking table
    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.room_num && :roomNums', { roomNums: dto.room_num })
      .andWhere(
        '(:checkin <= booking.checkout_date AND :checkout >= booking.checkin_date)',
        { checkin: checkinDate, checkout: checkoutDate },
      )
      .andWhere(
        'NOT (booking.checkout_date = :checkin)',
        { checkin: checkinDate },
      )
      .getMany();

    if (conflictingBookings.length > 0) {
      return { message: 'One or more rooms are not available for the selected dates (booking conflict)' };
    }

    // Calculate total price
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = rooms.reduce((sum, room) => {
      const roomPrice = Number(room.room_price) * nights;
      return sum + roomPrice;
    }, 0);

    // Create reservation
    const reservation = this.reservationRepository.create({
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      number_of_guests: dto.number_of_guests,
      room_num: dto.room_num,
      total_price: totalPrice,
      typeOfBooking: 'website',
      user_id: dto.user_id,
      user,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    return {
      reservation_id: savedReservation.reservation_id,
      checkin_date: savedReservation.checkin_date,
      checkout_date: savedReservation.checkout_date,
      number_of_guests: savedReservation.number_of_guests,
      room_num: savedReservation.room_num,
      total_price: savedReservation.total_price,
      booking_date: savedReservation.booking_date,
      typeOfBooking: savedReservation.typeOfBooking,
      user_id: savedReservation.user_id,
    };
  }
}