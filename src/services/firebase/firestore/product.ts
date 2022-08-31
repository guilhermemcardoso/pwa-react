import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Product } from "../../../models/Product";

const collectionName = "products";

export async function addProduct(
  product: Product
): Promise<Product | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, product.id), product);
    return product;
  } catch (error) {
    console.log("ERROR - addProduct", error);
    return undefined;
  }
}

export async function updateProduct(
  product: Product
): Promise<Product | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, product.id), product);
    return product;
  } catch (error) {
    console.log("ERROR - updateProduct", error);
    return undefined;
  }
}

export function listen(callback: (products: Product[]) => void) {
  const db = getFirestore();
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const product: Product = doc.data() as Product;
      products.push(product);
    });
    callback(products);
  });

  return unsubscribe;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName));

    const querySnapshot = await getDocs(q);
    const materials: Product[] = [];
    querySnapshot.forEach((doc) => {
      const material = doc.data() as Product;
      materials.push(material);
    });
    return materials;
  } catch (error) {
    console.log("ERROR - getProducts", error);
    return [];
  }
}

export async function deleteProduct(materials: Product[]): Promise<boolean> {
  const db = getFirestore();
  try {
    materials.map(async (item) => {
      await deleteDoc(doc(db, collectionName, item.id));
    });
    return true;
  } catch (error) {
    console.log("ERROR - deleteProduct", error);
    return false;
  }
}
