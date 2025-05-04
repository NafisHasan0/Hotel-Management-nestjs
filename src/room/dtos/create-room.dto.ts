import { IsNotEmpty, IsString , IsInt,IsEnum} from "class-validator";
import { RoomStatus} from '../entities/room.entity'
import { HousekeepingStatus } from '../entities/room.entity'
export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    room_num: number;

    @IsNotEmpty()
    @IsInt()
    floor: number;

    @IsNotEmpty()
    @IsInt()
    capacity: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    price: number;

    @IsInt()
    discount: number;

    @IsEnum(RoomStatus)
    room_status: RoomStatus;
    
    @IsEnum(HousekeepingStatus)
    housekeeping_status:HousekeepingStatus ;
  }