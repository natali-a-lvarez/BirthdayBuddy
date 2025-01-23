import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "expo-router";

// Stylesheets
import globalStyles from "../styles/GlobalStyles";

export default function BuddyDetails() {
  const { buddyId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [buddy, setBuddy] = useState({
    name: "",
    birthday: new Date(),
    nickname: "",
    customMessage: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  // Customize header for this page
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Buddy details",
      headerShown: true,
      headerBackTitle: "Back",
    });
  }, [navigation]);

  // Get buddy details
  useEffect(() => {
    const fetchBuddyDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/buddies/${buddyId}`
        );
        const data = await response.json();

        const birthday = new Date(data.birthday);
        setBuddy((prev) => ({
          ...prev,
          ...data,
          birthday: isNaN(birthday.getTime()) ? new Date() : birthday,
        }));
      } catch (error) {
        console.error("Error fetching buddy details:", error);
      }
    };

    if (buddyId) {
      fetchBuddyDetails();
    }
  }, [buddyId]);

  // Update changed values
  const handleChange = (field: string, value: string | Date) => {
    setBuddy((prev) => ({ ...prev, [field]: value }));
  };

  // Save
  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/buddies/${buddyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buddy,
          birthday: buddy.birthday.toISOString().split("T")[0],
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

  // Delete buddy with confirmation
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
    <View style={globalStyles.container}>
      {/* Buddy Name Input */}
      <Text style={globalStyles.label}>Name</Text>
      <TextInput
        style={globalStyles.input}
        value={buddy.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Name"
      />

      {/* Birthday Picker */}
      <Text style={globalStyles.label}>Birthday</Text>
      <TouchableOpacity
        style={globalStyles.input}
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

      {/* Nickname */}
      <Text style={globalStyles.label}>Nickname</Text>
      <TextInput
        style={globalStyles.input}
        value={buddy.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
        placeholder="Nickname"
      />

      {/* Custom message */}
      <Text style={globalStyles.label}>Custom Message</Text>
      <TextInput
        style={globalStyles.input}
        value={buddy.customMessage}
        onChangeText={(text) => handleChange("customMessage", text)}
        placeholder="Custom Message"
      />

      {/* Save Btn */}
      <TouchableOpacity
        style={globalStyles.btn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={globalStyles.btnText}>
          {loading ? "Saving..." : "Save Buddy"}
        </Text>
      </TouchableOpacity>

      {/* Delete Btn */}
      <TouchableOpacity
        style={[globalStyles.btn, globalStyles.redBtn]}
        onPress={handleDelete}
      >
        <Text style={globalStyles.btnText}>Delete Buddy</Text>
      </TouchableOpacity>
    </View>
  );
}
