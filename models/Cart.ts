export interface CartItem {
    id?: number; // Unique identifier for each cart item
    productId: number; // Foreign key linking to Product
    quantity: number; // Quantity of the product in the cart
  }