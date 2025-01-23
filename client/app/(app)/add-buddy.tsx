import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { useAuth } from "../../auth/ctx";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

// Stylesheets
import globalStyles from "../styles/GlobalStyles";

export default function AddBuddy() {
  const { userInfo, session } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthday: new Date(),
    nickname: "",
    customMessage: "",
  });

  // Customize header for this page
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Buddy",
      headerShown: true,
      headerBackTitle: "Back",
    });
  }, [navigation]);

  // Update values
  const handleChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit logic
  const handleSubmit = async () => {
    if (!userInfo?.email) {
      Alert.alert("Error", "User email not found. Please log in again.");
      return;
    }

    // Form validation
    if (!formData.name || !formData.birthday) {
      Alert.alert("Validation Error", "Name and Birthday are required fields.");
      return;
    }

    setLoading(true);

    // Post request
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
            birthday: formData.birthday.toISOString().split("T")[0],
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
    <View style={globalStyles.container}>
      {/* Form */}
      {/* Name */}
      <Text style={globalStyles.label}>Name</Text>
      <TextInput
        style={globalStyles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Birthday */}
      <Text style={globalStyles.label}>Birthday</Text>
      <TouchableOpacity
        style={globalStyles.input}
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

      {/* Nickname */}
      <Text style={globalStyles.label}>Nickname (Optional)</Text>
      <TextInput
        style={globalStyles.input}
        value={formData.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
      />

      {/* Custom message */}
      <Text style={globalStyles.label}>Custom Message (Optional)</Text>
      <TextInput
        style={globalStyles.input}
        value={formData.customMessage}
        onChangeText={(text) => handleChange("customMessage", text)}
      />

      <TouchableOpacity
        style={globalStyles.btn}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={globalStyles.btnText}>
          {loading ? "Adding..." : "Add Buddy"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
