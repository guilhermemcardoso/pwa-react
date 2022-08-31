import { Material } from "./Material";

interface ProductMaterial {
  item: Material;
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
