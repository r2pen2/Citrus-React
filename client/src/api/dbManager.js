import { firestore } from "./firebase";
import { onSnapshot, doc, collection, addDoc, getDoc, setDoc } from "firebase/firestore";


const USER_COLLECTION = "users";
const BADGES_COLLECTION = "badges";
const DEFAULT_PROFILE_PICTURES = "defaultProfilePictures"

export async function createUserDocument(user) {
    const defaultData = { 
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
    await setDoc(doc(firestore, USER_COLLECTION, user.uid), defaultData);
}