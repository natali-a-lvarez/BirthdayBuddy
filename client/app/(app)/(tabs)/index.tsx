import { Text, Button, View } from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { userInfo } = useAuth();
  const router = useRouter();

  return (
    <View>
      <Text>Welcome {userInfo?.name}!</Text>
      <Button title="View Buddies" onPress={() => router.push("/buddies")} />
      <Button title="Add Buddy" onPress={() => router.push("/add-buddy")} />
    </View>
  );
}
