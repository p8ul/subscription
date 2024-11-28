export interface Order {
  id?: number; // Unique identifier for each order
  totalAmount: number; // Total price of the order
  createdAt: string; // Date and time when the order was placed
}
