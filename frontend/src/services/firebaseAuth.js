import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Helper to format clean user-friendly authentication error messages
const formatAuthError = (error) => {
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

// Configure strict session persistence (isolated per browser tab/session)
try {
  setPersistence(auth, browserSessionPersistence).catch(() => {});
} catch (e) {}

// Tab Session Keys
export const TAB_SESSION_MARKER = 'tab_authenticated_session';
export const TAB_SESSION_ID = 'tab_session_id';

// Check if current tab holds a verified active session
export const isTabSessionAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(TAB_SESSION_MARKER) === 'true';
};

// Mark tab session as authenticated
export const setTabSessionAuthenticated = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TAB_SESSION_MARKER, 'true');
};

// Helper to purge tab & window storage on logout or stale tab init
export const purgeTabSession = async () => {
  try {
    await signOut(auth);
  } catch (e) {}
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
    localStorage.clear();
  }
};


// Register User or Admin in Firebase Auth + Firestore
export const signUpUser = async (name, email, password, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userProfile = {
      uid: user.uid,
      id: user.uid,
      name,
      email: user.email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    setTabSessionAuthenticated();
    setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch(() => {});

    return {
      success: true,
      user: userProfile,
      token: await user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      message: formatAuthError(error)
    };
  }
};

// Ultra-fast Sign In User
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    setTabSessionAuthenticated();

    const profile = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || user.email.split('@')[0],
      email: user.email.toLowerCase(),
      role: 'user'
    };

    getDoc(doc(db, 'users', user.uid))
      .then((userSnap) => {
        if (userSnap.exists()) {
          const data = userSnap.data();
          profile.name = data.name || profile.name;
          profile.role = data.role || profile.role;
        }
      })
      .catch(() => {});

    return {
      success: true,
      user: profile,
      token: await user.getIdToken()
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

    setTabSessionAuthenticated();

    const userProfile = {
      uid: user.uid,
      id: user.uid,
      name: user.displayName || 'NexusCart Member',
      email: user.email ? user.email.toLowerCase() : '',
      role: 'user'
    };

    setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch(() => {});

    return {
      success: true,
      user: userProfile,
      token: await user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      message: formatAuthError(error)
    };
  }
};

// Sign In Admin
export const signInAdmin = async (email, password) => {
  return await signInUser(email, password);
};

// Sign Out
export const signOutUser = async () => {
  try {
    await purgeTabSession();
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Auth State Observer with One-Tab One-Login Enforcement
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Verify whether current tab session was authenticated
      if (!isTabSessionAuthenticated()) {
        // Force purge unauthenticated cross-tab session
        purgeTabSession();
        callback(null);
        return;
      }

      const profile = {
        uid: user.uid,
        id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email.toLowerCase(),
        role: 'user'
      };

      callback(profile);

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
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.clear();
      }
      callback(null);
    }
  });
};

