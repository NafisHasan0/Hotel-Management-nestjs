import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantHistoryDto } from './create-restaurant-history.dto';

export class UpdateRestaurantHistoryDto extends PartialType(CreateRestaurantHistoryDto) {}