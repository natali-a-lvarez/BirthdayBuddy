import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Ensure you're importing IconSymbol

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Apply consistent padding here
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  btn: {
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding to give space for text and icon
    borderRadius: 5,
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Vertically center the items
    justifyContent: "center", // Horizontally center the items
    marginVertical: 10,
  },
  btnText: {
    color: "#151718",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // Space between the icon and the text
  },
  btnTextLight: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnLight: {
    backgroundColor: "#ceb2fe",
  },
  btnDark: {
    backgroundColor: "#585ce5",
  },
});

export default function HomeScreen() {
  const { userInfo } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Welcome, {userInfo?.name?.split(" ")[0]}!
      </Text>

      <TouchableOpacity
        style={[styles.btn, styles.btnLight]}
        onPress={() => router.push("/buddies")}
      >
        {/* Add contact book icon */}
        <IconSymbol size={20} name="book.fill" color="#151718" />
        <Text style={styles.btnText}>View Buddies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnDark]}
        onPress={() => router.push("/add-buddy")}
      >
        {/* Add plus icon */}
        <IconSymbol size={20} name="plus.circle.fill" color="#fff" />
        <Text style={[styles.btnText, styles.btnTextLight]}>Add Buddy</Text>
      </TouchableOpacity>
    </View>
  );
}
