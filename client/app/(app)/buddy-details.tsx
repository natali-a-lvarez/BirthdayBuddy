import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DatePicker from "react-native-date-picker"; // Import the date picker
import { useNavigation } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center", // Align text vertically
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#ffbae4",
  },
  btnText: {
    color: "#151718",
    fontSize: 16,
    fontWeight: "bold",
  },
  // New styles for the delete button
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#f0f0f0", // Light grey background
    borderWidth: 1,
    borderColor: "#ff4d4d", // Red border
  },
  deleteBtnText: {
    color: "#ff4d4d", // Red text
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function BuddyDetails() {
  const { buddyId } = useLocalSearchParams(); // Get buddyId from the URL params
  const router = useRouter();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Buddy details",
      headerShown: true,
      headerBackTitle: "Back",
    });
  }, [navigation]);

  const [buddy, setBuddy] = useState({
    name: "",
    birthday: new Date(), // Use Date object for the date picker
    nickname: "",
    customMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false); // Control date picker visibility

  useEffect(() => {
    const fetchBuddyDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/buddies/${buddyId}`
        );
        const data = await response.json();

        // Ensure birthday is always a Date object
        const birthday = new Date(data.birthday);
        setBuddy((prev) => ({
          ...prev,
          ...data,
          birthday: isNaN(birthday.getTime()) ? new Date() : birthday, // Validate the date
        }));
      } catch (error) {
        console.error("Error fetching buddy details:", error);
      }
    };

    if (buddyId) {
      fetchBuddyDetails();
    }
  }, [buddyId]);

  const handleChange = (field: string, value: string | Date) => {
    setBuddy((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/buddies/${buddyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buddy,
          birthday: buddy.birthday.toISOString().split("T")[0], // Ensure birthday is a valid date string
        }),
      });

      if (!response.ok) throw new Error("Failed to update buddy");

      Alert.alert("Success", "Buddy updated successfully!");
      router.push("/buddies"); // Navigate back to the buddies list
    } catch (error) {
      console.error("Error saving buddy details:", error);
      Alert.alert("Error", "Failed to save buddy details.");
    }
  };

  const handleCancel = () => {
    router.push("/buddies");
  };

  // Delete the buddy with confirmation
  const handleDelete = () => {
    Alert.alert(
      "Delete Buddy",
      "Are you sure you want to delete this buddy?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(
                `http://127.0.0.1:5000/buddies/${buddyId}`,
                {
                  method: "DELETE",
                }
              );
              if (!response.ok) throw new Error("Failed to delete buddy");
              Alert.alert("Success", "Buddy deleted successfully!");
              router.push("/buddies"); // Navigate back to the buddies list
            } catch (error) {
              console.error("Error deleting buddy:", error);
              Alert.alert("Error", "Failed to delete buddy.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Buddy Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={buddy.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Name"
      />

      {/* Birthday Picker */}
      <Text style={styles.label}>Birthday</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setDatePickerOpen(true)}
      >
        <Text>{buddy.birthday.toISOString().split("T")[0]} </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isDatePickerOpen}
        date={buddy.birthday}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          handleChange("birthday", date);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />

      <Text style={styles.label}>Nickname</Text>
      <TextInput
        style={styles.input}
        value={buddy.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
        placeholder="Nickname"
      />

      <Text style={styles.label}>Custom Message</Text>
      <TextInput
        style={styles.input}
        value={buddy.customMessage}
        onChangeText={(text) => handleChange("customMessage", text)}
        placeholder="Custom Message"
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Saving..." : "Save Buddy"}
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteBtn} // Updated button style
        onPress={handleDelete}
      >
        <Text style={styles.deleteBtnText}>Delete Buddy</Text>
      </TouchableOpacity>
    </View>
  );
}
