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
import { useAuth } from "../../../auth/ctx";
import { useRouter } from "expo-router";

// Stylesheets
import globalStyles from "@/app/styles/GlobalStyles";

export default function SettingsScreen() {
  const { userInfo, signOut } = useSession();
  const router = useRouter();
  const { session } = useAuth();
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get current custom message
  useEffect(() => {
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
      {/* Custom Message */}
      <Text style={globalStyles.label}>Update Custom Message:</Text>
      <TextInput
        style={globalStyles.input}
        value={customMessage}
        onChangeText={setCustomMessage}
        placeholder="Enter your custom message"
        editable={!loading}
      />

      <TouchableOpacity
        style={[globalStyles.btn, globalStyles.btnLight]}
        onPress={handleSaveMessage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={globalStyles.btnText}>Save Custom Message</Text>
        )}
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[globalStyles.btn, globalStyles.redBtn]}
        onPress={signOut}
      >
        <Text style={globalStyles.btnText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
