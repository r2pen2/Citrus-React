import { firestore } from "./firebase";
import { onSnapshot, doc, collection, addDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";


const USER_COLLECTION = "users";
const BADGES_COLLECTION = "badges";
const DEFAULT_PROFILE_PICTURES = "defaultProfilePictures"

/**
 * Syncronizes database with the current user.
 * If user does not exist in the database, create a document with default data.
 * If the user already exists in the database, update their metadata.
 * @param {Object} user the current user
 */
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

export async function updateDisplayNameById(id, newName) {
    console.log("Setting displayName of user: " + id);
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            data.personalData.displayName = newName;
            await setDoc(docRef, data);
            resolve();
        } else {
            console.log("No user with this ID exists on DB");
            reject();
        }
    })
}

export async function getDisplayNameById(id) {
    console.log("Getting displayName of user: " + id);
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().personalData.displayName) {
                resolve(docSnap.data().personalData.displayName);
            } else {
                resolve("?");
            }
        } else {
            console.log("No user with this ID exists on DB");
            resolve("?")
        }
    })
}

export async function getPhotoUrlById(id) {
    console.log("Getting phptoUrl of user: " + id);
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().personalData.profilePictureUrl) {
                resolve(docSnap.data().personalData.profilePictureUrl);
            } else {
                resolve("?");
            }
        } else {
            console.log("No user with this ID exists on DB");
            resolve("?")
        }
    })
}