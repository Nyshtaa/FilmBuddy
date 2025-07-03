import { getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

export const addToFavorites = async (movie: {
  id: number;
  title: string;
  poster: string;
  genre_ids: number[];
  year?: string;
  rating?: number;
}) => {
  const user = getAuth().currentUser;
  if (!user) return;

  await addDoc(collection(db, `users/${user.uid}/favorites`), {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    genre_ids: movie.genre_ids,
    year: movie.year || new Date().getFullYear().toString(),
    rating: movie.rating || 6.5,
  });
};
