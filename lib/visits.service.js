import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";


const REF_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateReferenceNumber = () =>
  Array.from({ length: 9 }, () =>
    REF_CHARS.charAt(Math.floor(Math.random() * REF_CHARS.length))
  ).join("");


/**
 * Add a visitor log to Firestore
 * @param {Object} visit
 *  - name: string
 *  - office: string
 *  - purpose: string
 *  - satisfaction: number (1-5)
 *  - comment: string
 */
export const addVisit = async (visit) => {
  const referenceNumber = generateReferenceNumber();
  try {
    await setDoc(doc(db, "visits", referenceNumber), {
      ...visit,
      referenceNumber,
      createdAt: serverTimestamp(),
    });
    return referenceNumber;
  } catch (error) {
    console.error("Error adding visit:", error);
    throw error;
  }
};


export const getVisitByReferenceNumber = async (referenceNumber) => {
  try {
    const cleaned = referenceNumber.trim().toUpperCase();
    const snap = await getDoc(doc(db, "visits", cleaned));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching visit:", error);
    throw error;
  }
};


export const addFeedback = async (feedback) => {
  const { addDoc, collection } = await import("firebase/firestore");
  try {
    await addDoc(collection(db, "feedback"), {
      ...feedback,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw error;
  }
};