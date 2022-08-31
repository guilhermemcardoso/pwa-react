import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
} from "firebase/firestore";
import { Material } from "../../../models/Material";

const collectionName = "materials";

export async function addMaterial(
  material: Material
): Promise<Material | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, material.id), material);
    return material;
  } catch (error) {
    console.log("ERROR - addMaterial", error);
    return undefined;
  }
}

export async function updateMaterial(
  material: Material
): Promise<Material | undefined> {
  try {
    const db = getFirestore();
    await setDoc(doc(db, collectionName, material.id), material);
    return material;
  } catch (error) {
    console.log("ERROR - updateMaterial", error);
    return undefined;
  }
}

export function listen(callback: (materials: Material[]) => void) {
  const db = getFirestore();
  const q = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const materials: Material[] = [];
    querySnapshot.forEach((doc) => {
      const material: Material = doc.data() as Material;
      materials.push(material);
    });
    callback(materials);
  });

  return unsubscribe;
}
