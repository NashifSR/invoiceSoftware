import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../lib/firebase";

export const authService = {
  login: async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  },

  register: async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (name) {
      await updateProfile(result.user, {
        displayName: name,
      });
    }

    return result.user;
  },

  loginWithGoogle: async () => {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    return result.user;
  },

  logout: async () => {
    await signOut(auth);
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  getIdToken: async () => {
    if (!auth.currentUser) return null;

    return await auth.currentUser.getIdToken();
  },
};