# 🎬 FilmBuddy

**FilmBuddy** is a mobile movie recommendation app built with React Native, Expo, and Firebase. It fetches real-time data from the TMDb API and allows users to rate, review, and organize movies into personal lists.

## 🚀 Features

- 🔐 User registration and login (Firebase Authentication)
- 📊 Smart movie recommendations (custom algorithm)
- 📝 User reviews with replies, likes, and dislikes
- ❤️ Favorite movies
- 👁️ Watched list
- ⏳ Watch later list
- 🔍 Search by title or genre
- 🎲 Random movie selection

## 🛠️ Tech Stack

- **React Native + Expo**
- **Firebase Authentication & Firestore**
- **TypeScript**
- **TMDb (The Movie Database) API**
- **React Navigation**

## 🧠 Recommendation Algorithm

The recommendation system considers:
- Genres from favorite and watched movies
- User review content
- Movie ratings and popularity
- Recency and watch history

## 📦 Installation

```bash
git clone https://github.com/Nyshtaa/FilmBuddy.git
cd FilmBuddy
npm install
npx expo start
