import { Tabs } from "expo-router";
import React from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarActiveTintColor: "#585ce5",
          headerTitle: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="buddies"
        options={{
          title: "Buddies",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
          headerTitle: "Buddies",
          tabBarActiveTintColor: "#585ce5",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wrench.adjustable.fill" color={color} />
          ),
          tabBarActiveTintColor: "#585ce5",
          headerTitle: "Settings",
        }}
      />
    </Tabs>
  );
}
