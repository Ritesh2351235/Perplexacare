"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Move interfaces outside of the component
interface UserProfile {
  fullName: string;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  occupation: string | null;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  getUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
  signInWithGoogle: async () => { },
  resetPassword: async () => { },
  loading: true,
  getUserProfile: async () => null,
  updateUserProfile: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize getUserProfile to prevent unnecessary re-renders
  const getUserProfile = async () => {
    if (!currentUser) {
      console.warn('No authenticated user');
      return null;
    }

    try {
      const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        console.log('Retrieved profile data:', profileData);

        // Ensure all required fields exist with defaults if missing
        const completeProfile: UserProfile = {
          fullName: profileData.fullName || currentUser.displayName || '',
          age: profileData.age ?? null,
          gender: profileData.gender ?? null,
          height: profileData.height ?? null,
          weight: profileData.weight ?? null,
          occupation: profileData.occupation ?? null,
          medicalHistory: Array.isArray(profileData.medicalHistory) ? profileData.medicalHistory : [],
          currentMedications: Array.isArray(profileData.currentMedications) ? profileData.currentMedications : [],
          allergies: Array.isArray(profileData.allergies) ? profileData.allergies : [],
          emergencyContactName: profileData.emergencyContactName ?? null,
          emergencyContactPhone: profileData.emergencyContactPhone ?? null,
        };

        setUserProfile(completeProfile);
        return completeProfile;
      } else {
        console.warn('No profile found for user:', currentUser.uid);
        // Create a default profile if none exists
        const defaultProfile: UserProfile = {
          fullName: currentUser.displayName || '',
          age: null,
          gender: null,
          height: null,
          weight: null,
          occupation: null,
          medicalHistory: [],
          currentMedications: [],
          allergies: [],
          emergencyContactName: null,
          emergencyContactPhone: null,
        };

        try {
          await setDoc(doc(db, 'profiles', currentUser.uid), defaultProfile);
          setUserProfile(defaultProfile);
          return defaultProfile;
        } catch (error) {
          console.error('Error creating default profile:', error);
          setUserProfile(defaultProfile);
          return defaultProfile;
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set a default profile on error so the UI doesn't break
      const fallbackProfile: UserProfile = {
        fullName: currentUser.displayName || '',
        age: null,
        gender: null,
        height: null,
        weight: null,
        occupation: null,
        medicalHistory: [],
        currentMedications: [],
        allergies: [],
        emergencyContactName: null,
        emergencyContactPhone: null,
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.email : 'no user');
      setCurrentUser(user);

      if (user) {
        try {
          // Get the user profile when the auth state changes
          await getUserProfile();
        } catch (error) {
          console.error('Error loading user profile on auth change:', error);
          // Set a default profile on error
          setUserProfile({
            fullName: user.displayName || '',
            age: null,
            gender: null,
            height: null,
            weight: null,
            occupation: null,
            medicalHistory: [],
            currentMedications: [],
            allergies: [],
            emergencyContactName: null,
            emergencyContactPhone: null,
          });
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []); // Remove getUserProfile from dependencies

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with full name
    await updateProfile(user, {
      displayName: fullName
    });

    // Create initial user profile in Firestore
    const initialProfile: UserProfile = {
      fullName,
      age: null,
      gender: null,
      height: null,
      weight: null,
      occupation: null,
      medicalHistory: [],
      currentMedications: [],
      allergies: [],
      emergencyContactName: null,
      emergencyContactPhone: null,
    };

    try {
      await setDoc(doc(db, 'profiles', user.uid), initialProfile);
      setUserProfile(initialProfile);
    } catch (error) {
      console.error('Error creating initial user profile:', error);
      // Still set profile in state even if Firestore fails
      setUserProfile(initialProfile);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    try {
      // Check if user profile exists, if not create one
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
      if (!profileDoc.exists()) {
        const initialProfile: UserProfile = {
          fullName: user.displayName || '',
          age: null,
          gender: null,
          height: null,
          weight: null,
          occupation: null,
          medicalHistory: [],
          currentMedications: [],
          allergies: [],
          emergencyContactName: null,
          emergencyContactPhone: null,
        };
        await setDoc(doc(db, 'profiles', user.uid), initialProfile);
        setUserProfile(initialProfile);
      } else {
        setUserProfile(profileDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error handling Google sign-in profile:', error);
      // Set a default profile on error
      const defaultProfile: UserProfile = {
        fullName: user.displayName || '',
        age: null,
        gender: null,
        height: null,
        weight: null,
        occupation: null,
        medicalHistory: [],
        currentMedications: [],
        allergies: [],
        emergencyContactName: null,
        emergencyContactPhone: null,
      };
      setUserProfile(defaultProfile);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');

    try {
      const userRef = doc(db, 'profiles', currentUser.uid);

      // Get current profile data first
      const currentProfileDoc = await getDoc(userRef);
      const currentProfileData = currentProfileDoc.exists()
        ? currentProfileDoc.data() as UserProfile
        : null;

      // Merge the new profile data with existing data
      const updatedProfile = {
        ...(currentProfileData || {}),
        ...profile,
        // Ensure arrays are properly handled
        medicalHistory: Array.isArray(profile.medicalHistory) ? profile.medicalHistory : currentProfileData?.medicalHistory || [],
        currentMedications: Array.isArray(profile.currentMedications) ? profile.currentMedications : currentProfileData?.currentMedications || [],
        allergies: Array.isArray(profile.allergies) ? profile.allergies : currentProfileData?.allergies || [],
      };

      // Update Firestore
      await setDoc(userRef, updatedProfile);

      // Update local state
      setUserProfile(updatedProfile as UserProfile);

      // Verify the update
      const verifyDoc = await getDoc(userRef);
      if (verifyDoc.exists()) {
        const verifiedData = verifyDoc.data() as UserProfile;
        setUserProfile(verifiedData);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error; // Propagate the error to handle it in the UI
    }
  };

  const value = {
    currentUser,
    userProfile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    loading,
    getUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 