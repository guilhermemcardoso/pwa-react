export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  description: string;
  products: OrderProduct[];
  discount: number;
  total: number;
  subtotal: number;
  customerName: string;
  createdAt: string;
}
