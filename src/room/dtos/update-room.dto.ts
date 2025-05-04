import { IsNotEmpty, IsString , IsInt,IsEnum, IsOptional} from "class-validator";
import { RoomStatus} from '../entities/room.entity'
import { HousekeepingStatus } from '../entities/room.entity'

export class UpdateRoomDto  {

        @IsOptional()
        @IsNotEmpty()
        @IsInt()
        capacity?: number;
    
        @IsOptional()
        @IsNotEmpty()
        @IsString()
        type?: string;

        @IsOptional()
        @IsNotEmpty()
        @IsString()
        description?: string;
    
        @IsOptional()
        @IsNotEmpty()
        @IsInt()
        price?: number;
    
        @IsOptional()
        @IsInt()
        discount?: number;
    
        @IsOptional()
        @IsEnum(RoomStatus)
        room_status?: RoomStatus;
        
        @IsOptional()
        @IsEnum(HousekeepingStatus)
        housekeeping_status?:HousekeepingStatus ;
}