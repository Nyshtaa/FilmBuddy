import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { fetchMovieDetails, fetchMovies } from "./movieService";

// Отримати всі фільми з певного списку користувача
export const getUserList = async (userId: string, listName: string) => {
  const snap = await getDocs(collection(db, `users/${userId}/${listName}`));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Перетворити фільм у вектор жанрів + рейтинг + рік
const getMovieVector = (movie: any): number[] => {
  const genreVec: number[] = Array(20).fill(0);
  const genreIds: number[] = movie.genre_ids || [];

  genreIds.forEach((gid: number) => {
    if (gid >= 0 && gid < 20) genreVec[gid] = 1;
  });

  const rating: number = movie.vote_average || 5;
  const year: number = movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : 2000;

  return [...genreVec, rating, year];
};

// cosine similarity
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot: number = a.reduce((sum: number, v: number, i: number) => sum + v * b[i], 0);
  const magA: number = Math.sqrt(a.reduce((sum: number, v: number) => sum + v * v, 0));
  const magB: number = Math.sqrt(b.reduce((sum: number, v: number) => sum + v * v, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

// 🔥 Основна функція: рекомендації для авторизованих
export const getSmartRecommendedMovies = async (userId: string): Promise<any[]> => {
  const watched = await getUserList(userId, "watched");
  const watchedIds = new Set(watched.map((m: any) => Number(m.id)));

  const detailed = await Promise.all(watched.map((m: any) => fetchMovieDetails(Number(m.id))));
  if (!detailed.length) return [];

  const userVector: number[] = detailed
    .reduce((acc: number[], movie: any) => {
      const vec = getMovieVector(movie);
      return acc.map((v: number, i: number) => v + vec[i]);
    }, Array(22).fill(0))
    .map((sum: number) => sum / detailed.length);

  const allPopular: any[] = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetchMovies("popular", page);
    allPopular.push(...res);
  }

  const scored = allPopular
    .filter((movie: any) => movie.poster_path && !watchedIds.has(movie.id))
    .map((movie: any) => {
      const vec = getMovieVector(movie);
      const score = cosineSimilarity(userVector, vec);
      return { ...movie, score };
    });

  // фільтруємо унікальні id
  const uniqueMap = new Map();
  scored.forEach((m) => {
    if (!uniqueMap.has(m.id)) uniqueMap.set(m.id, m);
  });

  return Array.from(uniqueMap.values())
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 20);
}

// 🔓 Топ-10 для гостей
export const getGuestTopMovies = async (): Promise<any[]> => {
  const popular = await fetchMovies("popular");
  return popular.slice(0, 20);
};
