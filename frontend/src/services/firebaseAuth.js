import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
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
      id: user.uid,
      name,
      email: user.email.toLowerCase(),
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    // Async background store in Firestore "users" collection
    setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch(() => {});

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

// Ultra-fast Sign In User (Instant response, no hanging)
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

    // Fast background profile sync
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
      message: error.message.replace('Firebase: ', '')
    };
  }
};

// Google Social Auth Sign In (Ultra-fast response)
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
      message: error.message.replace('Firebase: ', '')
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
    await signOut(auth);
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

      // Async background role check
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
      callback(null);
    }
  });
};
