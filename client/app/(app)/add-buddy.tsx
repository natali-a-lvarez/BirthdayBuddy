import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { useAuth } from "../../auth/ctx";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";
import styles from "../styles/AddBuddyStyles";

export default function AddBuddy() {
  const { userInfo } = useAuth(); // Retrieve user info from the session
  const router = useRouter();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Buddy",
      headerShown: true,
      headerBackTitle: "Back",
    });
  }, [navigation]);

  const [formData, setFormData] = useState({
    name: "",
    birthday: new Date(), // Use Date object for the date picker
    nickname: "",
    customMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false); // Control date picker visibility

  const handleChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userInfo?.email) {
      Alert.alert("Error", "User email not found. Please log in again.");
      return;
    }

    if (!formData.name || !formData.birthday) {
      Alert.alert("Validation Error", "Name and Birthday are required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/users/${userInfo.email}/buddies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            birthday: formData.birthday.toISOString().split("T")[0], // Format date for the backend
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add buddy");
      }

      Alert.alert("Success", "Buddy added successfully!");
      router.back();
    } catch (error) {
      console.error("Error adding buddy:", error);
      Alert.alert(
        "Error",
        "An error occurred while adding the buddy. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <Text style={styles.label}>Birthday</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setDatePickerOpen(true)}
      >
        <Text>{formData.birthday.toISOString().split("T")[0]} </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={isDatePickerOpen}
        date={formData.birthday}
        mode="date"
        onConfirm={(date) => {
          setDatePickerOpen(false);
          handleChange("birthday", date);
        }}
        onCancel={() => setDatePickerOpen(false)}
      />

      <Text style={styles.label}>Nickname (Optional)</Text>
      <TextInput
        style={styles.input}
        value={formData.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
      />

      <Text style={styles.label}>Custom Message (Optional)</Text>
      <TextInput
        style={styles.input}
        value={formData.customMessage}
        onChangeText={(text) => handleChange("customMessage", text)}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Adding..." : "Add Buddy"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
