'use client';
import { doc, setDoc, Firestore, serverTimestamp } from 'firebase/firestore';

interface UserProfileData {
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

export function createUserProfile(
  firestore: Firestore,
  userId: string,
  data: UserProfileData,
  merge = false
) {
  const userProfileRef = doc(firestore, 'users', userId);
  return setDoc(
    userProfileRef,
    {
      ...data,
      // Use serverTimestamp for createdAt to ensure it's accurate
      createdAt: serverTimestamp(), 
    },
    { merge }
  );
}

    