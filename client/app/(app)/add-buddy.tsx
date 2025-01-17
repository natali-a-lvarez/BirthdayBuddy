import { Text } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function AddBuddy() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Buddy",
      headerShown: true,
      headerBackTitle: "Back",
    });
  }, [navigation]);

  return <Text>Add Buddy</Text>;
}
