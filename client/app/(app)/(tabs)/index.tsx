import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Ensure you're importing IconSymbol
import { useEffect, useState } from "react"; // Import useState and useEffect for fetching data

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
    backgroundColor: "#ffbae4",
  },
  btnDark: {
    backgroundColor: "#585ce5",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  upcomingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  upcomingList: {
    marginTop: 10,
  },
  upcomingItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

// Define Buddy type
interface Buddy {
  buddyId: string;
  name: string;
  birthday: Date;
  nickname: string;
  customMessage: string;
}

export default function HomeScreen() {
  const { userInfo, session } = useAuth();
  const router = useRouter();
  const [buddies, setBuddies] = useState<Buddy[]>([]); // Type state with Buddy[] array
  const [loading, setLoading] = useState(false);

  // Fetch buddies only if session and userInfo are available
  useEffect(() => {
    if (!session || !userInfo) {
      return; // Skip fetching if no session or user info
    }

    const fetchUpcomingBuddies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/users/${userInfo.email}/buddies`
        );
        const data = await response.json();

        // Sort buddies by next upcoming birthday
        const sortedBuddies = data
          .map((buddy: Buddy) => ({
            ...buddy,
            birthday: new Date(buddy.birthday), // Ensure it's a Date object
          }))
          .sort((a: Buddy, b: Buddy) => {
            const currentDate = new Date();
            const nextA = new Date(
              currentDate.getFullYear(),
              a.birthday.getMonth(),
              a.birthday.getDate()
            );
            const nextB = new Date(
              currentDate.getFullYear(),
              b.birthday.getMonth(),
              b.birthday.getDate()
            );

            // If birthday is already passed this year, set to next year
            if (nextA < currentDate)
              nextA.setFullYear(currentDate.getFullYear() + 1);
            if (nextB < currentDate)
              nextB.setFullYear(currentDate.getFullYear() + 1);

            return nextA.getTime() - nextB.getTime(); // Compare by timestamp
          });

        setBuddies(sortedBuddies); // Update state with sorted buddies
      } catch (error) {
        console.error("Error fetching buddies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBuddies();
  }, [session, userInfo]); // Run when session or userInfo changes

  if (!session || !userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Session has expired. Please log in again.
        </Text>
        <TouchableOpacity
          style={[styles.btn, styles.btnLight]}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={[styles.btnText]}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>
        Welcome, {userInfo?.name?.split(" ")[0]}!
      </Text>

      <TouchableOpacity
        style={[styles.btn, styles.btnLight]}
        onPress={() => router.push("/buddies")}
      >
        <IconSymbol size={20} name="book.fill" color="#151718" />
        <Text style={styles.btnText}>View Buddies</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnDark]}
        onPress={() => router.push("/add-buddy")}
      >
        <IconSymbol size={20} name="plus.circle.fill" color="#fff" />
        <Text style={[styles.btnText, styles.btnTextLight]}>Add Buddy</Text>
      </TouchableOpacity>

      {/* Display upcoming birthdays */}
      {buddies.length > 0 && !loading && (
        <>
          <Text style={styles.upcomingText}>Upcoming Birthdays:</Text>
          <View style={styles.upcomingList}>
            {buddies.map((buddy) => (
              <Text key={buddy.buddyId} style={styles.upcomingItem}>
                {buddy.name} - {buddy.birthday.toLocaleDateString()}
              </Text>
            ))}
          </View>
        </>
      )}

      {loading && <Text>Loading upcoming birthdays...</Text>}
    </View>
  );
}
