import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms } from './entities/room.entity';
import { RoomItem } from './entities/room-item.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { CreateRoomItemDto } from './dtos/create-room-item.dto';



@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Rooms) private roomRepository: Repository<Rooms>,
    @InjectRepository(RoomItem) private roomItemRepository: Repository<RoomItem>,
  ) {}

  // Room-related methods
  async createRoom(dto: CreateRoomDto) {
    const room = this.roomRepository.create(dto);
    return this.roomRepository.save(room);
  }

  async findRoomByRoomNum(room_num: number) {
    return this.roomRepository.findOneOrFail({ where: { room_num }, relations: ['room_items'] });
  }

  async findRoomsByRoomStatus(room_status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE') {
    return this.roomRepository.find({ where: { room_status }, relations: ['room_items'] });
  }

  async updateRoom(room_num: number, dto: UpdateRoomDto) {
    const room = await this.roomRepository.findOneOrFail({ where: { room_num }, relations: ['room_items'] });
    Object.assign(room, dto);
    return this.roomRepository.save(room);
  }

  // RoomItem-related methods
  async createRoomItem(dto: CreateRoomItemDto) {
    const room = await this.roomRepository.findOneOrFail({ where: { room_num: dto.room_num } });
    const roomItem = this.roomItemRepository.create({ ...dto, room });
    return this.roomItemRepository.save(roomItem);
  }

  async findAllRoomItems() {
    return this.roomItemRepository.find({ relations: ['room'] });
  }

  async findRoomItemByItemId(item_id: number) {
    return this.roomItemRepository.findOneOrFail({ where: { item_id }, relations: ['room'] });
  }

  async findRoomItemsByItemName(item_name: string){
    return this.roomItemRepository.find({ where: { item_name }, relations: ['room'] });
  }

  async findRoomItemsByRoomNum(room_num: number) {
    return this.roomItemRepository.find({ where: { room: { room_num } }, relations: ['room'] });
  }

  async updateRoomItem(item_id: number, dto: UpdateRoomItemDto){
    const roomItem = await this.roomItemRepository.findOneOrFail({ where: { item_id }, relations: ['room'] });
    if (dto.room_num && dto.room_num !== roomItem.room.room_num) {
      const room = await this.roomRepository.findOneOrFail({ where: { room_num: dto.room_num } });
      roomItem.room = room;
    }
    Object.assign(roomItem, dto);
    return this.roomItemRepository.save(roomItem);
  }

  
}