import { firestore } from "./firebase";
import { onSnapshot, doc, collection, addDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";


const USER_COLLECTION = "users";
const BADGES_COLLECTION = "badges";
const DEFAULT_PROFILE_PICTURES = "defaultProfilePictures"

export async function syncUserDoc(user) {
    console.log("Syncing user " + user.uid);
    const docRef = doc(firestore, USER_COLLECTION, user.uid);
    const docSnap = await getDoc(docRef);
    var data = null;
    if (docSnap.exists()) {
        // This document already exists, so we update it
        console.log("User already exists in database. Just update metadata.");
        // Update metadata
        if (user.metadata) {
            await updateDoc(docRef, {
                metadata: {
                    emailVerified: user.emailVerified,
                    createdAt: user.metadata.createdAt,
                    creationTime: user.metadata.creationTime,
                    lastLoginAt: user.metadata.lastLoginAt,
                    lastSignInTime: user.metadata.lastSignInTime,
                },
            }).then(console.log("Done!"));
        }
    } else {
        // User doesn't exist is DB, so we make a new document.
        console.log("User is not already in the database. Creating document now.");
        // Sometimes there's just no metadata? What the hell?
        if (user.metadata) {
            console.log("Found metadata!");
            data = { 
                personalData: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    profilePictureUrl: user.photoURL,
                },
                metadata: {
                    emailVerified: user.emailVerified,
                    createdAt: user.metadata.createdAt,
                    creationTime: user.metadata.creationTime,
                    lastLoginAt: user.metadata.lastLoginAt,
                    lastSignInTime: user.metadata.lastSignInTime,
                },
                groups: [
        
                ],
                friends: [
        
                ],
                transactions: [
        
                ],
                settings: {
                    language: "en",
                    darkMode: false,
                },
                resources: {
                    profilePictures: [
        
                    ],
                },
                badges: [
                    
                ],
            };
        } else {
            data = { 
                personalData: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    profilePictureUrl: user.photoURL,
                },
                metadata: {
                    emailVerified: user.emailVerified,
                    createdAt: null,
                    creationTime: null,
                    lastLoginAt: null,
                    lastSignInTime: null,
                },
                groups: [
        
                ],
                friends: [
        
                ],
                transactions: [
        
                ],
                settings: {
                    language: "en",
                    darkMode: false,
                },
                resources: {
                    profilePictures: [
        
                    ],
                },
                badges: [
                    
                ],
            };
        }
        // Set the document
        await setDoc(docRef, data).then(console.log("Done!"));
    }
}