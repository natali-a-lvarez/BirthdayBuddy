import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useSession } from "../../auth/ctx";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // Display a loading screen while the session state is being initialized
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Redirect to the login page if no session exists
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack screenOptions={{ headerShown: false }} />;
}
