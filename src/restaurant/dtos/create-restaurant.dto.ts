export class CreateRestaurantDto {
    food_id: number;
    item_name: string;
    item_price: number;
    food_type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DESSERT' | 'BEVERAGE';
    description: string;
    availability: boolean;
  }