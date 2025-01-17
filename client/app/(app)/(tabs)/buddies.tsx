import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SectionList,
} from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Define the Buddy type
type Buddy = {
  buddyId: number;
  name: string;
  birthday: string;
  nickname?: string;
  customMessage?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  btnDark: {
    backgroundColor: "#585ce5",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  buddyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  buddyName: {
    fontSize: 16,
  },
  buddyBirthday: {
    fontSize: 14,
    color: "#aaa",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default function BuddiesScreen() {
  const { userInfo } = useAuth();
  const router = useRouter();

  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/users/${userInfo?.email}/buddies`
        );
        const data: Buddy[] = await response.json();
        setBuddies(data);
      } catch (error) {
        console.error("Error fetching buddies:", error);
      }
    };

    if (userInfo?.email) {
      fetchBuddies();
    }
  }, [userInfo]);

  const filteredBuddies = buddies.filter((buddy) =>
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedBuddies = filteredBuddies.reduce<Record<string, Buddy[]>>(
    (acc, buddy) => {
      const firstLetter = buddy.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(buddy);
      return acc;
    },
    {}
  );

  const sections = Object.keys(groupedBuddies)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groupedBuddies[letter],
    }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options); // Formats as "Jan 15"
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, styles.btnDark]}
        onPress={() => router.push("/add-buddy")}
      >
        <IconSymbol size={20} name="plus.circle.fill" color="#fff" />
        <Text style={styles.btnText}>Add Buddy</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Buddies"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.buddyId.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buddyItem}
            onPress={() =>
              router.push({
                pathname: "/buddy-details",
                params: { buddyId: item.buddyId }, // Navigate to the Buddy details page with the buddyId
              })
            }
          >
            <Text style={styles.buddyName}>{item.name}</Text>
            <Text style={styles.buddyBirthday}>
              {formatDate(item.birthday)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No buddies found.</Text>
        }
      />
    </View>
  );
}
