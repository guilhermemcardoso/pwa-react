import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Unity } from "../../../models/Unity";

const collectionName = "unities";

export async function addUnity(unity: Unity): Promise<Unity | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, unity.id), unity);
    return unity;
  } catch (error) {
    console.log("ERROR - addUnity", error);
    return undefined;
  }
}

export async function updateUnity(unity: Unity): Promise<Unity | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, unity.id), unity);
    return unity;
  } catch (error) {
    console.log("ERROR - updateUnity", error);
    return undefined;
  }
}

export function listen(callback: (unities: Unity[]) => void) {
  const db = getFirestore();
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const unities: Unity[] = [];
    querySnapshot.forEach((doc) => {
      const unity: Unity = doc.data() as Unity;
      unities.push(unity);
    });
    callback(unities);
  });

  return unsubscribe;
}

export async function getUnities(): Promise<Unity[]> {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName));

    const querySnapshot = await getDocs(q);
    const unities: Unity[] = [];
    querySnapshot.forEach((doc) => {
      const unity = doc.data() as Unity;
      unities.push(unity);
    });
    return unities;
  } catch (error) {
    console.log("ERROR - getUnities", error);
    return [];
  }
}

export async function deleteUnity(unities: Unity[]): Promise<boolean> {
  const db = getFirestore();
  try {
    unities.map(async (item) => {
      await deleteDoc(doc(db, collectionName, item.id));
    });
    return true;
  } catch (error) {
    console.log("ERROR - deleteUnity", error);
    return false;
  }
}
