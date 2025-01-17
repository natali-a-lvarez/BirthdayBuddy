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

const checkUserExists = async (email: string | undefined) => {
  const response = await fetch("http://127.0.0.1:5000/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get users");
  }

  const users = await response.json();

  // Find a user with the given email
  const existingUser = users.find(
    (user: any) => user.email.toLowerCase() === email?.toLowerCase()
  );

  return !!existingUser; // Return true if user exists, false otherwise
};

export default function SignIn() {
  const { signIn } = useSession();
  const { userInfo } = useAuth();
  let isSigningIn = false;

  const handleSignIn = async () => {
    if (isSigningIn) return;
    isSigningIn = true;

    try {
      await signIn();

      // Check if user exists, and if not, create them
      const userExists = await checkUserExists(userInfo?.email);

      if (userExists) {
        router.replace("/");
      } else {
        const response = await fetch("http://127.0.0.1:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userInfo?.name,
            email: userInfo?.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        router.replace("/");
      }
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
      ></Image>
      <Text style={styles.text}>
        Please{" "}
        <Text onPress={handleSignIn} style={styles.boldText}>
          Sign in
        </Text>{" "}
        to continue
      </Text>
    </View>
  );
}
