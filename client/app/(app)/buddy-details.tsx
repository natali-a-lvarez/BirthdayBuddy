import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "expo-router";
import styles from "../styles/BuddyDetailsStyles";

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
      router.back();
    } catch (error) {
      console.error("Error saving buddy details:", error);
      Alert.alert("Error", "Failed to save buddy details.");
    }
  };

  const handleCancel = () => {
    router.back();
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
              router.back();
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
