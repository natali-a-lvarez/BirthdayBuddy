import { Text } from "react-native";
import { useAuth } from "../../../auth/ctx";

export default function HomeScreen() {
  const { userInfo } = useAuth();

  return <Text>Welcome {userInfo?.name}!</Text>;
}
