import { useRouter } from "expo-router";
import 'expo-router/entry';
import { useEffect } from "react";

import { InteractionManager } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      router.replace("/(tabs)/home");
    });
  }, [router]);
  

  return null;
}
