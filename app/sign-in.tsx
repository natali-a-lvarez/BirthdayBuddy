import { router } from "expo-router";
import { Text, View } from "react-native";

import { useSession } from "../auth/ctx";

export default function SignIn() {
  const { signIn } = useSession();
  let isSigningIn = false;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={async () => {
          if (isSigningIn) return;
          isSigningIn = true;

          try {
            await signIn(); // Ensure signIn completes before navigating
            router.replace("/"); // Navigate only after sign-in is successful
          } catch (error) {
            console.error("Sign-In Error:", error);
          } finally {
            isSigningIn = false;
          }
        }}
      >
        Sign In
      </Text>
    </View>
  );
}
