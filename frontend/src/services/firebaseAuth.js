import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Helper to format clean user-friendly authentication error messages
export const formatAuthError = (error) => {
  const code = error?.code || error?.message || '';
  if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Invalid email address or password. Please check your credentials.';
  }
  if (code.includes('email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Google sign-in was cancelled.';
  }
  return 'Authentication failed. Please verify your details.';
};

// Configure safe standard local persistence for reliable browser sessions
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch (e) {}

// Register User or Admin in Firebase Auth + Firestore
export const signUpUser = async (name, email, password, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile name
    await updateProfile(user, { displayName: name });

    const userProfile = {
      uid: user.uid,
      id: user.uid,
      name,
      email: user.email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    // Ensure Firestore user document is created immediately to satisfy Firestore Security Rules
    try {
      await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
    } catch (dbErr) {
      console.warn('Firestore user doc creation warning:', dbErr);
    }

    const token = await user.getIdToken();

    return {
      success: true,
      user: userProfile,
      token
    };
  } catch (error) {
    return {
      success: false,
      message: formatAuthError(error)
    };
  }
};

// Sign In User
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profile = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || user.email.split('@')[0],
      email: user.email.toLowerCase(),
      role: 'user'
    };

    // Fetch user profile doc from Firestore if present, or create doc if missing
    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        profile.name = data.name || profile.name;
        profile.role = data.role || profile.role;
      } else {
        await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore doc check warning:', e);
    }

    const token = await user.getIdToken();

    return {
      success: true,
      user: profile,
      token
    };
  } catch (error) {
    return {
      success: false,
      message: formatAuthError(error)
    };
  }
};

// Google Social Auth Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userProfile = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || 'NexusCart Member',
      email: user.email ? user.email.toLowerCase() : '',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    try {
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        userProfile.name = data.name || userProfile.name;
        userProfile.role = data.role || userProfile.role;
      } else {
        await setDoc(doc(db, 'users', user.uid), userProfile, { merge: true });
      }
    } catch (e) {
      console.warn('Google Auth Firestore doc creation warning:', e);
    }

    const token = await user.getIdToken();

    return {
      success: true,
      user: userProfile,
      token
    };
  } catch (error) {
    return {
      success: false,
      message: formatAuthError(error)
    };
  }
};

// Sign In Admin Helper
export const signInAdmin = async (email, password) => {
  return await signInUser(email, password);
};

// Sign Out User
export const signOutUser = async () => {
  try {
    await signOut(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Auth State Observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = {
        uid: user.uid,
        id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email.toLowerCase(),
        role: 'user'
      };

      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          profile.name = data.name || profile.name;
          profile.role = data.role || profile.role;
        }
      } catch (e) {}

      callback(profile);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
      }
      callback(null);
    }
  });
};
