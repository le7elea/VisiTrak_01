import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";

import successIcon from "../assets/images/success_icon.png";

export default function SuccessCard({ name, address, checkIn, visiting, referenceNumber }) {
  const { width } = useWindowDimensions();
  const [copied, setCopied] = useState(false);

  const isLargeScreen = width > 800;
  const scale = isLargeScreen ? 1.4 : width > 600 ? 1.2 : 1;

  const handleCopy = async () => {
    if (!referenceNumber) return;
    await Clipboard.setStringAsync(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      className="relative bg-white/10 backdrop-blur-md border border-indigo-300 rounded-2xl shadow-lg self-center mt-24"
      style={{ width: Math.min(width * 0.9, 500 * scale), padding: 20 * scale }}
    >
      <View
        className="absolute"
        style={{ top: -95 * scale, left: "50%", transform: [{ translateX: -(92 * scale) / 2 }] }}
      >
        <Image source={successIcon} style={{ width: 144 * scale, height: 144 * scale }} resizeMode="contain" />
      </View>

      <Text className="text-center text-green-400 font-semibold mt-12" style={{ fontSize: 20 * scale }}>
        Successfully Checked In
      </Text>

      <View className="bg-green-400 opacity-70 self-center" style={{ height: 1, width: "90%", marginVertical: 12 * scale }} />

      <View className="flex-row items-center justify-center mt-2">
        <View className="mt-4">
          <Text className="text-white font-bold mb-2" style={{ fontSize: 25 * scale }}>{name}</Text>
          <Text className="text-white font-medium mt-1 mb-5" style={{ fontSize: 18 * scale, textAlign: "center" }}>
            {address}
          </Text>
        </View>
      </View>

      {/* 🔥 NEW: Reference Number block */}
      {referenceNumber ? (
        <View
          className="bg-purple-900/40 border border-purple-300/50 rounded-xl items-center"
          style={{ padding: 14 * scale, marginTop: 6 * scale }}
        >
          <Text className="text-white/80" style={{ fontSize: 13 * scale }}>YOUR REFERENCE NUMBER</Text>
          <Text
            className="text-white font-extrabold tracking-widest mt-1"
            style={{ fontSize: 26 * scale }}
          >
            {referenceNumber}
          </Text>

          <Pressable
            onPress={handleCopy}
            className="flex-row items-center bg-white/90 rounded-lg mt-3"
            style={{ paddingVertical: 8 * scale, paddingHorizontal: 16 * scale }}
          >
            <Feather name={copied ? "check" : "copy"} size={16 * scale} color="#381366" />
            <Text className="font-semibold ml-2" style={{ fontSize: 14 * scale, color: "#381366" }}>
              {copied ? "Copied!" : "Copy Reference Number"}
            </Text>
          </Pressable>

          <Text className="text-yellow-200 text-center mt-3" style={{ fontSize: 12 * scale }}>
            ⚠️ Take a screenshot or copy this now. It will not be shown again once you leave this screen.
          </Text>
        </View>
      ) : null}

      <View className="bg-gray-400/40" style={{ height: 1, marginVertical: 16 * scale }} />

      <View style={{ gap: 8 * scale }}>
        <View className="flex-row justify-between">
          <Text className="text-white font-medium" style={{ fontSize: 17 * scale }}>CHECK IN:</Text>
          <Text className="text-white font-normal" style={{ fontSize: 17 * scale }}>{checkIn}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-white font-medium" style={{ fontSize: 17 * scale }}>VISITING:</Text>
          <Text className="text-white font-normal" style={{ fontSize: 17 * scale }}>{visiting}</Text>
        </View>
      </View>
    </View>
  );
}