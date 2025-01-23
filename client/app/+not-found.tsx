import { Link, Stack, useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Link href="/" style={styles.link}>
        <Text onPress={() => router.push("/add-buddy")}>
          Go to home screen!
        </Text>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
