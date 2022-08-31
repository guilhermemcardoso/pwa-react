export interface ProductMaterial {
  materialId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  materials: ProductMaterial[];
  createdAt: string;
}
