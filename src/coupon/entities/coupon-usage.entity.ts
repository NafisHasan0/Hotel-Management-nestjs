import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { Booking } from '../../booking/entities/booking.entity';

import { Employee } from '../../management/entities/employee.entity';

@Entity('CouponUsage')
export class CouponUsage {
  @PrimaryGeneratedColumn()
  usage_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  used_at: Date;

  @ManyToOne(() => Coupon, (coupon) => coupon.couponUsages)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  //bookingid
  @Column({ type: 'int' })
  booking_id: number;



  @ManyToOne(() => Employee, (employee) => employee.couponUsages)
  @JoinColumn({ name: 'employee_used' })
  used_by: Employee;
}
