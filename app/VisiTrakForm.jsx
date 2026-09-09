import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import BackgroundCarousel from "../components/BackgroundCarousel";
import ContactInfoSection from "../components/ContactInfoSection";
import Footer from "../components/Footer";
import PersonalInfoSection from "../components/PersonalInfoSection";
import SubmitButton from "../components/SubmitButton";
import TermsAgreement from "../components/TermsAgreement";
import VisitInfoSection from "../components/VisitInfoSection";

import { addVisit } from "../lib/visits.service";

import backG02 from "../assets/images/backG004.png";
import backG01 from "../assets/images/backG009.png";
import backG03 from "../assets/images/backG010.png";

export default function VisiTrakForm() {
  const router = useRouter();

  const scrollRef = useRef(null);
  const positions = useRef({});
  const addressParts = useRef({ municipality: "", barangay: "" });

  const [fullName, setFullName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [office, setOffice] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emojiRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    fullName: false,
    homeAddress: false,
    purpose: false,
    office: false,
    contactNumber: false,
    agreeTerms: false,
  });

  const purposes = ["COR/TOR", "MEDICAL", "PAYMENT", "INQUIRY", "SUBMISSION OF REQUIREMENTS", "VISIT", "SEMINAR / WEBINAR", "Other"];
  const offices = ["REGISTRAR", "CLINIC", "CASHIER", "CCIS/CTAS OFFICE", "CCIS EXTENSION OFFICE", "CCJ OFFICE", "Other"];
  const images = [backG01, backG02, backG03];

  const onSubmit = async () => {
    const digitsOnly = (contactNumber || "").replace(/[^0-9]/g, "");
    const newErrors = {
      fullName: fullName.trim() === "",
      homeAddress: homeAddress.trim() === "",
      purpose: purpose.trim() === "",
      office: office.trim() === "",
      contactNumber: digitsOnly.length !== 11,
      agreeTerms: !agreeTerms,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      const order = ["fullName", "homeAddress", "purpose", "office", "contactNumber", "agreeTerms"];
      const firstInvalid = order.find((k) => newErrors[k]);
      if (firstInvalid) {
        if (firstInvalid === "homeAddress") {
          if (!addressParts.current.municipality && positions.current.municipality != null) {
            scrollRef.current?.scrollTo({ y: Math.max(0, positions.current.municipality - 20), animated: true });
          } else if (addressParts.current.municipality && !addressParts.current.barangay && positions.current.barangay != null) {
            scrollRef.current?.scrollTo({ y: Math.max(0, positions.current.barangay - 20), animated: true });
          } else if (positions.current.homeAddress != null) {
            scrollRef.current?.scrollTo({ y: Math.max(0, positions.current.homeAddress - 20), animated: true });
          }
        } else if (firstInvalid === "contactNumber") {
          if (positions.current.contactNumber != null) {
            scrollRef.current?.scrollTo({ y: Math.max(0, positions.current.contactNumber - 20), animated: true });
          } else {
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        } else if (positions.current[firstInvalid] != null) {
          scrollRef.current?.scrollTo({ y: Math.max(0, positions.current[firstInvalid] - 20), animated: true });
        }
      }
      return;
    }

    // 🔥 NEW: save to Firestore and get the generated reference number back
    setSubmitting(true);
    try {
      const checkInTime = new Date().toLocaleTimeString();

      const referenceNumber = await addVisit({
        name: fullName,
        address: homeAddress,
        office,
        purpose,
        contactNumber,
        email,
        checkInTime,
        rating: emojiRating,
      });

      router.push({
        pathname: "/CheckInSummary",
        params: {
          name: fullName,
          address: homeAddress,
          office,
          purpose,
          contactNumber,
          email,
          checkInTime,
          referenceNumber, // 🔥 replaces old local exitKey
          rating: emojiRating,
        },
      });
    } catch (error) {
      Alert.alert("Something went wrong", "We couldn't save your check-in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#381366", "#4A2279", "#573483"]} className="flex-1">
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }}>
        <BackgroundCarousel images={images} />

        <View onLayout={(e) => { positions.current.header = e.nativeEvent.layout.y; }} />

        <PersonalInfoSection
          fullName={fullName}
          setFullName={setFullName}
          homeAddress={homeAddress}
          setHomeAddress={setHomeAddress}
          errors={errors}
          setErrors={setErrors}
          onNameLayout={(e) => { positions.current.fullName = e.nativeEvent.layout.y; }}
          onAddressLayout={(e) => { positions.current.homeAddress = e.nativeEvent.layout.y; }}
          onAddressPartsChange={(parts) => { addressParts.current = parts; }}
        />

        <VisitInfoSection
          purpose={purpose}
          setPurpose={setPurpose}
          office={office}
          setOffice={setOffice}
          purposes={purposes}
          offices={offices}
          errors={errors}
          setErrors={setErrors}
          onPurposeLayout={(e) => { positions.current.purpose = e.nativeEvent.layout.y; }}
          onOfficeLayout={(e) => { positions.current.office = e.nativeEvent.layout.y; }}
        />

        <ContactInfoSection
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          email={email}
          setEmail={setEmail}
          errors={errors}
          setErrors={setErrors}
          onContactLayout={(e) => { positions.current.contactNumber = e.nativeEvent.layout.y; }}
        />

        <TermsAgreement
          agreeTerms={agreeTerms}
          setAgreeTerms={setAgreeTerms}
          errors={errors}
          setErrors={setErrors}
          onTermsLayout={(e) => { positions.current.agreeTerms = e.nativeEvent.layout.y; }}
        />

        <SubmitButton onPress={onSubmit} disabled={submitting} loading={submitting} />
        <Footer />
      </ScrollView>
    </LinearGradient>
  );
}