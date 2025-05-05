import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Item')
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}