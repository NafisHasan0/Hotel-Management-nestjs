import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('BillingHistory')
export class BillingHistory {
  @PrimaryGeneratedColumn()
  billing_id: number;

  @Column()
  booking_id: number;

  @Column()
  room_num: number;

  @Column({ type: 'bytea' })
  pdf_data: Buffer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generated_date: Date;
}