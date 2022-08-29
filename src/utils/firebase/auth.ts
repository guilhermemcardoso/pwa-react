import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

export async function firebaseSignIn(
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password);
    const { user } = response;
    console.log("FIREBASE SIGN IN", response);
    return user;
  } catch (error) {
    console.log("FIREBASE SIGN IN", error);
    return undefined;
  }
}

export function firebaseGetCurrentUser(): User | undefined {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log("FIREBASE GET CURRENT USER", currentUser);
    return currentUser || undefined;
  } catch (error) {
    return undefined;
  }
}

export async function firebaseCreateUser(
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password);
    const { user } = response;
    return user;
  } catch (error) {
    return undefined;
  }
}

export async function firebaseSignOut() {
  try {
    const auth = getAuth();
    await signOut(auth);
    return true;
  } catch (error) {
    return false;
  }
}
