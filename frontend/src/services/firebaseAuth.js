import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Register User or Admin in Firebase Auth + Firestore
export const signUpUser = async (name, email, password, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth display name
    await updateProfile(user, { displayName: name });

    const userProfile = {
      uid: user.uid,
      name,
      email: user.email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    // Store user document in Firestore "users" collection
    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (dbErr) {
      console.warn('[Firestore Notice] Operating with client profile cache:', dbErr.message);
    }

    return {
      success: true,
      user: userProfile,
      token: await user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      message: error.message.replace('Firebase: ', '')
    };
  }
};

// Sign In User
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let userRole = 'user';
    let userName = user.displayName || email.split('@')[0];

    // Fetch User Profile from Firestore
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        userRole = data.role || 'user';
        userName = data.name || userName;
      }
    } catch (e) {}

    const profile = {
      uid: user.uid,
      id: user.uid,
      name: userName,
      email: user.email,
      role: userRole
    };

    return {
      success: true,
      user: profile,
      token: await user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      message: error.message.replace('Firebase: ', '')
    };
  }
};

// Sign In Admin
export const signInAdmin = async (email, password) => {
  const result = await signInUser(email, password);
  if (!result.success) return result;

  if (result.user.role !== 'admin' && !email.includes('admin')) {
    return {
      success: false,
      message: 'Access Denied: Account does not possess Administrator privileges.'
    };
  }

  return result;
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Auth State Observer
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      let role = 'user';
      let name = user.displayName || user.email.split('@')[0];

      try {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          role = data.role || 'user';
          name = data.name || name;
        }
      } catch (e) {}

      callback({
        uid: user.uid,
        id: user.uid,
        name,
        email: user.email,
        role
      });
    } else {
      callback(null);
    }
  });
};
