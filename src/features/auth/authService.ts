import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, type User } from "firebase/auth";
import { firebaseAuth } from "../../lib/firebase";

export interface AuthUser {
    uid: string;
    email: string;
}

function wait<T>(value: T, ms: number = 300): Promise<T> {
    return new Promise<T>((resolve) => {
        setTimeout(() => resolve(value), ms);
    });
}

export const authService = {
    register: async (email: string, password: string): Promise<AuthUser> => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => userCredential.user as AuthUser);
    },
    login: async (email: string, password: string): Promise<AuthUser> => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => userCredential.user as AuthUser)
    },

    logout: async (): Promise<void> => {
       return firebaseAuth.signOut();
    },

    getCurrentUser: async (): Promise<AuthUser | null> => {
       return firebaseAuth.currentUser ?
            wait(firebaseAuth.currentUser as AuthUser) : null;
    },
    onAuthChanged: (callback: (user: AuthUser | null) => void) => {
        return onAuthStateChanged(firebaseAuth, (usr: User | null) => {
            const user = usr ? { uid: usr.uid, email: usr.email || '' } : null;
            callback(user);
        });
    }
};
