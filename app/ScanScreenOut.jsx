import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Card from "../components/Card";
import Divider from "../components/Divider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Logos from "../components/Logos";
// import { getVisitByReferenceNumber } from "../firebase/visits"; // 🔥 NEW — looks up the visit doc, nothing more
import { getVisitByReferenceNumber } from "../lib/visits.service";

export default function EntryScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isLarge = width > 800;
  const scale = isLarge ? 1.4 : width > 600 ? 1.2 : 1;

  // 🔥 NEW: reference number modal state
  const [showRefModal, setShowRefModal] = useState(false);
  const [refInput, setRefInput] = useState("");
  const [refError, setRefError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleUseReference = async () => {
    if (!refInput.trim()) {
      setRefError("Please enter your reference number.");
      return;
    }
    setChecking(true);
    setRefError("");
    try {
      const visit = await getVisitByReferenceNumber(refInput);
      if (!visit) {
        setRefError("Reference number not found. Please check and try again.");
        return;
      }
      setShowRefModal(false);
      setRefInput("");
      // Only the name is carried over — nothing gets written anywhere yet.
      router.push({
        pathname: "/FeedbackForm",
        params: {
          referenceNumber: visit.referenceNumber, // used only to lock/autofill the name field in the UI
          name: visit.name,
        },
      });
    } catch (e) {
      setRefError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/BG009.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <View
            className="px-6"
            style={{ paddingTop: (StatusBar.currentHeight || 0) + 10 * scale }}
          >
            <Header title="VisiTrak" />
          </View>

          <View
            className="flex-1 justify-center px-6"
            style={{
              paddingHorizontal: 24 * scale,
              marginTop: 20 * scale,
              marginBottom: 20 * scale,
            }}
          >
            <Card
              style={{
                transform: [{ scale }],
                maxWidth: Math.min(width * 0.9, 500 * scale),
                alignSelf: "center",
              }}
            >
              <Logos scale={scale} />

              <View className="items-center mt-4">
                <Text
                  className="text-white font-semibold mb-4"
                  style={{ fontSize: 18 * scale }}
                >
                  Scan QR Code
                </Text>

                <View
                  className="bg-white rounded-lg justify-center items-center mb-6"
                  style={{
                    width: 160 * scale,
                    height: 160 * scale,
                    borderRadius: 12 * scale,
                    shadowOpacity: 0.4,
                    shadowRadius: 6 * scale,
                  }}
                >
                  <Image
                    source={require("../assets/images/qr-out.png")}
                    style={{ width: 144 * scale, height: 144 * scale }}
                    resizeMode="contain"
                  />
                </View>

                <Divider text="or" scale={scale} />

                {/* 🔥 NEW: Use Reference # — sits between QR/Divider and Check Out */}
                <Pressable
                  onPress={() => setShowRefModal(true)}
                  className="flex-row items-center bg-white/15 border border-white/40 rounded-2xl"
                  style={{
                    paddingVertical: 10 * scale,
                    paddingHorizontal: 20 * scale,
                    marginTop: 14 * scale,
                    minWidth: width * 0.7,
                    maxWidth: width * 0.9,
                    justifyContent: "center",
                  }}
                >
                  <Feather name="hash" size={18 * scale} color="white" />
                  <Text className="text-white font-semibold ml-2" style={{ fontSize: 14 * scale }}>
                    Use Reference #
                  </Text>
                </Pressable>

                {/* Check Out button — unchanged, stays exactly where it was */}
                <Link href="/FeedbackForm" asChild>
                  <Pressable
                    className="flex-row items-center bg-white rounded-2xl shadow-md"
                    style={{
                      paddingVertical: 12 * scale,
                      paddingHorizontal: 24 * scale,
                      marginTop: 16 * scale,
                      minWidth: width * 0.7,
                      maxWidth: width * 0.9,
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons name="file-document-outline" size={24 * scale} color="black" />
                    <Text className="font-semibold ml-2 px-3" style={{ fontSize: 15 * scale }}>
                      Check Out
                    </Text>
                    <Feather name="arrow-right" size={20 * scale} color="black" />
                  </Pressable>
                </Link>
              </View>
            </Card>
          </View>

          <View style={{ paddingBottom: 20 * scale }}>
            <Footer scale={scale} />
          </View>
        </View>

        {/* 🔥 NEW: Reference number modal */}
        <Modal
          transparent
          animationType="fade"
          visible={showRefModal}
          onRequestClose={() => setShowRefModal(false)}
        >
          <View className="flex-1 bg-black/40 justify-center items-center px-8">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[320px]">
              <Text className="text-lg font-semibold text-gray-800 text-center">
                Enter Reference Number
              </Text>
              <Text className="text-center text-gray-500 text-sm mt-1 mb-4">
                {`We'll pull up your name automatically from your check-in.`}
              </Text>

              <TextInput
                placeholder="e.g. A1B2C3D4E"
                autoCapitalize="characters"
                value={refInput}
                onChangeText={(t) => { setRefInput(t); setRefError(""); }}
                className="border border-gray-300 rounded-lg px-4 py-3 text-center text-gray-800 tracking-widest font-semibold"
                maxLength={9}
              />

              {refError ? (
                <Text className="text-red-500 text-xs text-center mt-2">{refError}</Text>
              ) : null}

              <Pressable
                onPress={handleUseReference}
                disabled={checking}
                className="bg-purple-800 py-3 rounded-md mt-5"
              >
                {checking ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">CONTINUE</Text>
                )}
              </Pressable>

              <Pressable onPress={() => { setShowRefModal(false); setRefInput(""); setRefError(""); }} className="mt-3">
                <Text className="text-center text-gray-500 text-sm">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}