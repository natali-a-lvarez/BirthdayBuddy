import { router } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { useAuth } from "../auth/ctx";

import { useSession } from "../auth/ctx";

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: "#585ce5",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  shadowProp: {
    shadowColor: "#64646f",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default function SignIn() {
  const { signIn } = useSession(); // Valid usage
  const { userInfo } = useAuth(); // Valid usage
  let isSigningIn = false;

  const handleSignIn = async () => {
    if (isSigningIn) return;
    isSigningIn = true;

    try {
      await signIn();

      router.replace("/");
    } catch (error) {
      console.error("Sign-In Error:", error);
    } finally {
      isSigningIn = false;
    }
  };

  

  return (
    <View style={styles.container}>
      <Image
        style={[styles.logo, styles.shadowProp]}
        source={require("../assets/images/logo.png")}
      />
      <Text style={styles.text}>
        Please{" "}
        <Text onPress={handleSignIn} style={styles.boldText}>
          Sign in{" "}
        </Text>
        to continue
      </Text>
    </View>
  );
}
