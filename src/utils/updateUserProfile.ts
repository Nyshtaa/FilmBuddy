// utils/updateUserProfile.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const updateUserProfile = async (uid: string, displayName: string, photoURL: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      displayName,
      photoURL,
    });
  } catch (err) {
    console.error("Помилка при оновленні профілю:", err);
  }
};
