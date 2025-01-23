import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SectionList,
} from "react-native";
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/app/styles/BuddiesScreenStyles";
import { formatBirthday } from "../../utils/dateUtils";

// Stylesheets
import globalStyles from "../../styles/GlobalStyles";

type Buddy = {
  buddyId: number;
  name: string;
  birthday: string;
  nickname?: string;
  customMessage?: string;
};

export default function BuddiesScreen() {
  const { userInfo, session } = useAuth();
  const router = useRouter();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all buddies for logged in user
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

  // Filter by search query
  const filteredBuddies = buddies.filter((buddy) =>
    buddy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define how buddies will be grouped
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

  // Define sections
  const sections = Object.keys(groupedBuddies)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groupedBuddies[letter],
    }));

  // If user is not logged in make them log in
  if (!session || !userInfo) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>
          Session has expired. Please log in again.
        </Text>
        <TouchableOpacity
          style={[globalStyles.btn, globalStyles.btnLight]}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={[globalStyles.btnText]}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[globalStyles.container, globalStyles.bckgLight]}>
      {/* Add buddy btn */}
      <TouchableOpacity
        style={[globalStyles.btn, globalStyles.btnDark]}
        onPress={() => router.push("/add-buddy")}
      >
        <View style={globalStyles.btnContentRow}>
          <IconSymbol size={20} name="plus.circle.fill" color="#fff" />
          <Text style={globalStyles.btnTextLight}>Add Buddy</Text>
        </View>
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Buddies"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Buddy list */}
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
                params: { buddyId: item.buddyId },
              })
            }
          >
            <Text style={styles.buddyName}>{item.name}</Text>
            <Text style={styles.buddyBirthday}>
              {formatBirthday(new Date(item.birthday))}
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
