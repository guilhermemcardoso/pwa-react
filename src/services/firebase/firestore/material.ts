import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
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

export async function updateMaterialAvailability(
  materialId: string,
  quantity: number
): Promise<boolean> {
  try {
    const db = getFirestore();
    const docRef = doc(db, collectionName, materialId);
    await updateDoc(docRef, {
      quantity: quantity,
    });
    return true;
  } catch (error) {
    console.log("ERROR - updateMaterialAvailability", error);
    return false;
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

export async function getMaterials(): Promise<Material[]> {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName));

    const querySnapshot = await getDocs(q);
    const materials: Material[] = [];
    querySnapshot.forEach((doc) => {
      const material = doc.data() as Material;
      materials.push(material);
    });
    return materials;
  } catch (error) {
    console.log("ERROR - getMaterials", error);
    return [];
  }
}

export async function deleteMaterial(materials: Material[]): Promise<boolean> {
  const db = getFirestore();
  try {
    materials.map(async (item) => {
      await deleteDoc(doc(db, collectionName, item.id));
    });
    return true;
  } catch (error) {
    console.log("ERROR - deleteMaterial", error);
    return false;
  }
}
