import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        tabBarActiveTintColor: "#3575EC",
        tabBarInactiveTintColor: "#666666",
        tabBarLabelStyle: {
          fontFamily: "Montserrat-SemiBold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🔍</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#3575EC",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: "Hub",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>🌟</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
} 