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

// Helper to format clean, user-friendly authentication error messages without leaking database strings
export const formatAuthError = (error) => {
  const code = (error?.code || error?.message || '').toLowerCase();
  
  if (code.includes('database') || code.includes('closing') || code.includes('hidden') || code.includes('internal error')) {
    return 'Authentication failed. Please verify your email address and password.';
  }
  if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Invalid email address or password. Please check your credentials.';
  }
  if (code.includes('email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (code.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('popup-blocked')) {
    return 'Google sign-in popup was blocked by your browser. Please allow popups or sign in with email.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completing.';
  }
  return 'Authentication failed. Please verify your details.';
};

// Configure standard local persistence (allows simultaneous logins on multiple devices)
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch (e) {}

// Register User or Admin in Firebase Auth + Firestore
export const signUpUser = async (name, email, password, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Update Firebase Auth profile name
    await updateProfile(user, { displayName: name.trim() }).catch(() => {});

    const userProfile = {
      uid: user.uid,
      id: user.uid,
      name: name.trim(),
      email: user.email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    // Non-blocking Firestore user profile creation
    try {
      setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch(() => {});
    } catch (e) {}

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
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    const profile = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || user.email.split('@')[0],
      email: user.email.toLowerCase(),
      role: 'user'
    };

    // Fetch or create user doc from Firestore silently
    try {
      getDoc(doc(db, 'users', user.uid))
        .then((userSnap) => {
          if (userSnap.exists()) {
            const data = userSnap.data();
            profile.name = data.name || profile.name;
            profile.role = data.role || profile.role;
          } else {
            setDoc(doc(db, 'users', user.uid), profile, { merge: true }).catch(() => {});
          }
        })
        .catch(() => {});
    } catch (e) {}

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
    provider.setCustomParameters({ prompt: 'select_account' });
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
      setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch(() => {});
    } catch (e) {}

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
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const profile = {
        uid: user.uid,
        id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email.toLowerCase(),
        role: 'user'
      };

      callback(profile);

      try {
        getDoc(doc(db, 'users', user.uid))
          .then((userSnap) => {
            if (userSnap.exists()) {
              const data = userSnap.data();
              if (data.name || data.role) {
                callback({
                  ...profile,
                  name: data.name || profile.name,
                  role: data.role || profile.role
                });
              }
            }
          })
          .catch(() => {});
      } catch (e) {}
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
      }
      callback(null);
    }
  });
};
