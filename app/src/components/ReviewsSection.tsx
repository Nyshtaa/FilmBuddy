import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../config/firebase";

 export default function ReviewsSection({ movieId, movieTitle }: { movieId: string; movieTitle: string }) {
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const user = getAuth().currentUser;
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "reviews"), where("movieId", "==", movieId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userSnap = await getDoc(doc(db, "users", data.userId));
          const userData = userSnap.exists() ? userSnap.data() : {};
          return {
            id: docSnap.id,
            ...data,
            userName: userData.userName || "anon",
            avatar: userData.photoURL || null,
          };
        })
      );
      setReviews(list);
    });
    return () => unsubscribe();
  }, [movieId]);

  const handleAddReview = async () => {
    if (!text.trim() || !user) return;

    await addDoc(collection(db, "reviews"), {
      movieId,
      movieTitle,
      text,
      userId: user.uid,
      timestamp: serverTimestamp(),
      likes: 0,
      dislikes: 0,
      replyTo,
    });

    setText("");
    setReplyTo(null);
  };

  const handleVote = async (reviewId: string, type: "like" | "dislike") => {
    if (!user) {
      router.push("/login");
      return;
    }

    const voteRef = doc(db, "reviews", reviewId, "votes", user.uid);
    const voteSnap = await getDoc(voteRef);

    if (voteSnap.exists()) {
      const prev = voteSnap.data().type;
      if (prev === type) {
        await deleteDoc(voteRef);
        await updateDoc(doc(db, "reviews", reviewId), {
          [type === "like" ? "likes" : "dislikes"]: increment(-1),
        });
      } else {
        await setDoc(voteRef, { type });
        await updateDoc(doc(db, "reviews", reviewId), {
          likes: increment(type === "like" ? 1 : -1),
          dislikes: increment(type === "dislike" ? 1 : -1),
        });
      }
    } else {
      await setDoc(voteRef, { type });
      await updateDoc(doc(db, "reviews", reviewId), {
        [type === "like" ? "likes" : "dislikes"]: increment(1),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (user && confirm("Видалити відгук?")) {
      await deleteDoc(doc(db, "reviews", id));
    }
  };

  const toggleReplies = (id: string) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }: { item: any }) => {
    const replies = reviews.filter((r) => r.replyTo === item.id);
    const expanded = expandedReplies[item.id];

    return (
      <View style={styles.review}>
        <View style={styles.userRow}>
          {item.avatar && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
          <Text style={styles.user}>{item.userName}</Text>
        </View>
        <Text style={styles.reviewText}>{item.text}</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleVote(item.id, "like")}>
            <Text style={styles.like}>👍 {item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVote(item.id, "dislike")}>
            <Text style={styles.dislike}>👎 {item.dislikes}</Text>
          </TouchableOpacity>
          {user && (
            <>
              <TouchableOpacity onPress={() => setReplyTo(item.id)}>
                <Text style={styles.replyButton}>Відповісти</Text>
              </TouchableOpacity>
              {user.uid === item.userId && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.replyButton}>Видалити</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {replies.length > 0 && (
          <TouchableOpacity onPress={() => toggleReplies(item.id)}>
            <Text style={styles.replyButton}>
              {expanded ? "Приховати відповіді" : `Показати відповіді (${replies.length})`}
            </Text>
          </TouchableOpacity>
        )}

{reviews
  .filter((r) => r.replyTo === item.id)
  .map((reply) =>
    React.createElement(
      View,
      { style: styles.reply, key: String(reply.id) },
      <>
        <View style={styles.userRow}>
          {reply.avatar && (
            <Image source={{ uri: reply.avatar }} style={styles.avatar} />
          )}
          <Text style={styles.user}>{reply.userName}</Text>
        </View>
        <Text style={styles.reviewText}>{reply.text}</Text>
      </>
    )
  )}

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Відгуки</Text>

      {user ? (
        <>
          {replyTo && <Text style={styles.replyingTo}>Відповідаєте на коментар</Text>}
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Напишіть відгук..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleAddReview}>
            <Text style={styles.buttonText}>Залишити</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.loginPrompt} onPress={() => router.push("/login")}>
          <Text style={styles.loginPromptText}>Увійдіть, щоб залишити відгук</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={reviews.filter((r) => !r.replyTo)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: { marginTop: 20, marginBottom: 50 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderColor: "#7B61FF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 10,
    backgroundColor: "#1e1e1e",
  },
  button: {
    backgroundColor: "#7B61FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  review: {
    backgroundColor: "#1e1e1e",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  userRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  user: { color: "#888", fontSize: 14 },
  reviewText: { color: "#fff", fontSize: 15 },
  replyButton: { color: "#7B61FF", marginTop: 6, fontSize: 13 },
  reply: {
    marginTop: 6,
    paddingLeft: 10,
    borderLeftColor: "#7B61FF",
    borderLeftWidth: 2,
  },
  actions: { flexDirection: "row", marginTop: 8, gap: 15 },
  like: { color: "#7BFF8F" },
  dislike: { color: "#FF6F6F" },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  replyingTo: { color: "#7B61FF", fontStyle: "italic", marginBottom: 8 },
  loginPrompt: {
    backgroundColor: "#2e2e2e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginPromptText: {
    color: "#7B61FF",
    fontWeight: "600",
  },
});
