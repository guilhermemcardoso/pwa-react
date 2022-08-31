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
import { Order } from "../../../models/Order";

const collectionName = "orders";

export async function addOrder(
  order: Order
): Promise<Order | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, order.id), order);
    return order;
  } catch (error) {
    console.log("ERROR - addOrder", error);
    return undefined;
  }
}

export async function updateOrder(
  order: Order
): Promise<Order | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, order.id), order);
    return order;
  } catch (error) {
    console.log("ERROR - updateOrder", error);
    return undefined;
  }
}

export function listen(callback: (orders: Order[]) => void) {
  const db = getFirestore();
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const order: Order = doc.data() as Order;
      orders.push(order);
    });
    callback(orders);
  });

  return unsubscribe;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName));

    const querySnapshot = await getDocs(q);
    const materials: Order[] = [];
    querySnapshot.forEach((doc) => {
      const material = doc.data() as Order;
      materials.push(material);
    });
    return materials;
  } catch (error) {
    console.log("ERROR - getOrders", error);
    return [];
  }
}

export async function deleteOrder(materials: Order[]): Promise<boolean> {
  const db = getFirestore();
  try {
    materials.map(async (item) => {
      await deleteDoc(doc(db, collectionName, item.id));
    });
    return true;
  } catch (error) {
    console.log("ERROR - deleteOrder", error);
    return false;
  }
}
