export interface Product {
    id?: number; // SQLite will auto-increment the ID
    name: string;
    category: string;
    description: string;
    quantity: number;
    price: number;
    volume: number; // Volume in ml or liters
    alcoholPercentage: number; // Alcohol content percentage
    measurementUnit: 'ml' | 'liter'; // Either ml or liter
    rating: number; // Used for popularity
    image: string; // URL for product image
  }