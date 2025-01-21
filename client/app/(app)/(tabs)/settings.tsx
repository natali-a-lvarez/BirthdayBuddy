import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSession } from "../../../auth/ctx";
import styles from "../../styles/SettingsStyles";

export default function SettingsScreen() {
  const { userInfo, signOut } = useSession();
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the current custom message
    const fetchCustomMessage = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:5000/users/${userInfo?.email}`
        );
        const data = await response.json();
        setCustomMessage(data.defaultMessage || ""); // Set the current message
      } catch (error) {
        console.error("Failed to fetch custom message:", error);
        Alert.alert("Error", "Failed to fetch your custom message.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomMessage();
  }, [userInfo]);

  const handleSaveMessage = async () => {
    if (!customMessage.trim()) {
      Alert.alert("Validation Error", "Custom message cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:5000/users/${userInfo?.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ defaultMessage: customMessage }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Your custom message has been updated.");
      } else {
        throw new Error("Failed to update custom message.");
      }
    } catch (error) {
      console.error("Error updating custom message:", error);
      Alert.alert("Error", "Failed to update your custom message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Message */}
      <Text style={styles.label}>Update Custom Message:</Text>
      <TextInput
        style={styles.input}
        value={customMessage}
        onChangeText={setCustomMessage}
        placeholder="Enter your custom message"
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={handleSaveMessage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Save Custom Message</Text>
        )}
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
