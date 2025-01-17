import { StyleSheet, Image, Platform, View, Text } from "react-native";

import { useSession } from "../../../auth/ctx";

export default function TabTwoScreen() {
  const { signOut } = useSession();

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          onPress={() => {
            // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            signOut();
          }}
        >
          Sign Out
        </Text>
      </View>
    </>
  );
}
