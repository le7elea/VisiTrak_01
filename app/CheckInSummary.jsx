import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import SuccessCard from "../components/SuccessCard";
import Header from "../components/Sucess-header";

export default function CheckInSummary() {
  const { name, referenceNumber, checkInTime, office, address } = useLocalSearchParams(); // 🔥 referenceNumber replaces exitKey
  const { width } = useWindowDimensions();

  const scale = Math.min(Math.max(width / 400, 0.8), 1.6);

  const sizes = {
    paddingVertical: 40 * scale,
    paddingHorizontal: 16 * scale,
    messageFont: 22 * scale,
    messageSpacing: 28 * scale,
  };

  return (
    <LinearGradient colors={["#381366", "#4A2279", "#573483"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 10 * scale }}>
          <Header title="VisiTrak" />
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: sizes.paddingVertical,
            paddingHorizontal: sizes.paddingHorizontal,
          }}
          showsVerticalScrollIndicator={false}
        >
          <SuccessCard
            name={name || "Guest Visitor"}
            address={address || "N/A"}
            referenceNumber={referenceNumber || "N/A"}
            checkIn={checkInTime || "N/A"}
            visiting={office || "N/A"}
          />

          <View style={{ marginTop: sizes.messageSpacing }}>
            <Text style={{ textAlign: "center", color: "white", fontSize: sizes.messageFont, fontWeight: "600" }}>
              Have a great visit!
            </Text>
          </View>
        </ScrollView>

        <Footer />
      </SafeAreaView>
    </LinearGradient>
  );
}