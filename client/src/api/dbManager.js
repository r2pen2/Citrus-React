import { firestore } from "./firebase";
import { onSnapshot, doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";


const USER_COLLECTION = "users";
const GROUP_COLLECTION = "groups";
const TRANSACTION_COLLECTION = "transactions";
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
                transactions: {
                    active: [],
                    inactive: [],
                },
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

/**
 * Update user display name on DB by ID
 * @param {String} id user ID
 * @param {String} newName name to put on DB
 * @returns {Object} new user object
 */
export async function updateDisplayNameById(id, newName) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            data.personalData.displayName = newName;
            await setDoc(docRef, data);
            resolve(data);
        } else {
            console.log("No user with this ID exists on DB");
            reject();
        }
    })
}

/**
 * Get a user's display name by ID
 * @param {String} id user ID
 * @returns {String} user display name
 */
export async function getDisplayNameById(id) {
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

/**
 * Get a user's phone number by ID
 * @param {String} id user ID
 * @returns {String} user phone number
 */
export async function getPhoneNumberById(id) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().personalData.phoneNumber) {
                resolve(docSnap.data().personalData.phoneNumber);
            } else {
                resolve(null);
            }
        } else {
            console.log("No user with this ID exists on DB");
            resolve(null)
        }
    })
}

/**
 * Get a user's profile photo url by ID
 * @param {String} id user ID
 * @returns {String} user profile photo url
 */
export async function getPhotoUrlById(id) {
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

/**
 * Adds a transaction to a user's active transaction array
 * @param {String} userId user's id to get transaction added
 * @param {String} transactionId id of transaction to add
 */
export async function addTransactionToUser(userId, transactionId) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            data.transactions.active.push(transactionId);
            await setDoc(docRef, data);
            resolve(true);
        } else {
            console.log("No user with this ID exists on DB");
            reject("No user with this ID");
        }
    })
}

/**
 * Creates a transaction on the DB and adds it to the two users' active transactions
 * @param {Object} user1Id the first user's id
 * @param {Object} user1Debt how much user1 owes
 * @param {Object} user2Id the second user's id
 * @param {Object} user2Debt how much user2 owes
 * @returns {String} id of the new transaction
 */
 export async function createTransaction(user1Id, user1Debt, user2Id, user2Debt) {
    return new Promise(async (resolve, reject) => {
        const docRef = await addDoc(collection(firestore, TRANSACTION_COLLECTION), {
            credits: [
                {
                    user: user1Id,
                    debt: user1Debt,
                },
                {
                    user: user2Id,
                    debt: user2Debt,
                }
            ],
            active: true,
        })
        console.log("Transaction created with ID: " + docRef.id);
        await addTransactionToUser(user1Id, docRef.id);
        await addTransactionToUser(user2Id, docRef.id);
        resolve(docRef.id);
    })
}

/**
 * Changes active status of a transaction and updates all users' transaction arrays accordingly
 * @param {String} transactionId id of transaction to change status
 * @param {Boolean} newActive whether or not the transaciton should be active
 */
 export async function setTransactionActive(transactionId, newActive) {
    async function deactivateOnUser(u) {
        return new Promise(async function (resolve, reject) {
            const uDoc = doc(firestore, USER_COLLECTION, u);
            const uDocSnap = await getDoc(uDoc);
            if (uDocSnap.exists()) {
                const uData = uDocSnap.data();
                const remainingArr = uData.transactions.active.filter(t => t !== transactionId);
                if (remainingArr.length < uData.transactions.active) {
                    console.log("Removed a transaction from user: " + u);
                    uData.transactions.active = remainingArr;
                    uData.transactions.inactive.push(transactionId);
                }
                await setDoc(uDoc, uData);
            } else {
                console.log("No user with this ID exists on DB");
                reject("No user with this ID exists on DB");
            }
        })
    }
    
    async function activateOnUser(u) {
        return new Promise(async function (resolve, reject) {
            const uDoc = doc(firestore, USER_COLLECTION, u);
            const uDocSnap = await getDoc(uDoc);
            if (uDocSnap.exists()) {
                const uData = uDocSnap.data();
                const remainingArr = uData.transactions.inactive.filter(t => t !== transactionId);
                if (remainingArr.length < uData.transactions.inactive) {
                    console.log("Removed a transaction from user: " + u);
                    uData.transactions.inactive = remainingArr;
                    uData.transactions.active.push(transactionId);
                }
                await setDoc(uDoc, uData);
            } else {
                console.log("No user with this ID exists on DB");
                reject("No user with this ID exists on DB");
            }
        })
    }

    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, TRANSACTION_COLLECTION, transactionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            data.active = newActive;
            const credits = data.credits;
            if (newActive) {
                for (const c of credits) {
                    await activateOnUser(c.user);
                }
            } else {   
                for (const c of credits) {
                    await deactivateOnUser(c.user);
                }
            }
            await setDoc(docRef, data);
            resolve();
        } else {
            console.log("No transaction with this ID exists on DB");
            reject("No transaction with this ID");
        }
    })
}

/**
 * Cannot be reversed! Deletes a transaction from the database entirely and removes it from users
 * @param {String} id transaction ID to delete from DB
 */
 export async function deleteTransaction(id) {
    async function deleteOnUser(u) {
        return new Promise(async function (resolve, reject) {
            const uDoc = doc(firestore, USER_COLLECTION, u);
            const uDocSnap = await getDoc(uDoc);
            if (uDocSnap.exists()) {
                const uData = uDocSnap.data();
                const newActive = uData.transactions.active.filter(t => t !== id);
                const newInactive = uData.transactions.inactive.filter(t => t !== id);
                uData.transactions.active = newActive;
                uData.transactions.inactive = newInactive;
                await setDoc(uDoc, uData);
                resolve();
            } else {
                console.log("No user with this ID exists on DB");
                reject("No user with this ID exists on DB");
            }
        })
    }

    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, TRANSACTION_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const credits = data.credits;
            for (const c of credits) {
                await deleteOnUser(c.user);
            }
            await deleteDoc(docRef);
            resolve();
        } else {
            console.log("No transaction with this ID exists on DB");
            reject("No transaction with this ID");
        }
    })
}

/**
 * Creates a group on the DB with given name
 * @param {String} name name of new group
 * @returns {String} id of the new group
 */
 export async function createGroup(name) {
    return new Promise(async (resolve, reject) => {
        const docRef = await addDoc(collection(firestore, GROUP_COLLECTION), {
            name: name,
            users: [],
            transactions: [],
        })
        console.log("Group created with ID: " + docRef.id);
        resolve(docRef.id);
    })
}

/**
 * Cannot be reversed! Deletes a group from the database entirely and removes it from users
 * @param {String} id group ID to delete from DB
 */
 export async function deleteGroup(id) {
    async function deleteOnUser(u) {
        return new Promise(async function (resolve, reject) {
            const uDoc = doc(firestore, USER_COLLECTION, u);
            const uDocSnap = await getDoc(uDoc);
            if (uDocSnap.exists()) {
                const uData = uDocSnap.data();
                const newGroups = uData.groups.filter(g => g !== id);
                uData.groups = newGroups;
                await setDoc(uDoc, uData);
                resolve();
            } else {
                console.log("No user with this ID exists on DB");
                reject("No user with this ID exists on DB");
            }
        })
    }

    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, GROUP_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const users = data.users;
            for (const u of users) {
                await deleteOnUser(u);
            }
            await deleteDoc(docRef);
            resolve();
        } else {
            console.log("No transaction with this ID exists on DB");
            reject("No transaction with this ID");
        }
    })
}

/**
 * Adds a group to a user and adds user to the group
 * @param {String} userId user's id to get group added
 * @param {String} groupId group id to add to user
 */
 export async function addUserToGroup(userId, groupId) {
    return new Promise(async (resolve, reject) => {
        const groupRef = doc(firestore, GROUP_COLLECTION, groupId);
        const groupSnap = await getDoc(groupRef);
        const userRef = doc(firestore, USER_COLLECTION, userId);
        const userSnap = await getDoc(userRef);
        if (groupSnap.exists() && userSnap.exists()) {
            const groupData = groupSnap.data();
            groupData.users.push(userId);
            const userData = userSnap.data();
            userData.groups.push(groupId);
            await setDoc(groupRef, groupData);
            await setDoc(userRef, userData);
            resolve(true);
        } else {
            console.log("Group or user ID invalid!");
            reject("Group or user ID invalid!");
        }
    })
}

/**
 * Removes a group from a user and removes user from the group
 * @param {String} userId user's id to get group removed
 * @param {String} groupId group id to remove from user
 */
 export async function removeUserFromGroup(userId, groupId) {
    return new Promise(async (resolve, reject) => {
        const groupRef = doc(firestore, GROUP_COLLECTION, groupId);
        const groupSnap = await getDoc(groupRef);
        const userRef = doc(firestore, USER_COLLECTION, userId);
        const userSnap = await getDoc(userRef);
        if (groupSnap.exists() && userSnap.exists()) {
            const groupData = groupSnap.data();
            groupData.users.filter(u => u !== userId);
            const userData = userSnap.data();
            userData.groups.filter(g => g !== groupId);
            await setDoc(groupRef, groupData);
            await setDoc(userRef, userData);
            resolve(true);
        } else {
            console.log("Group or user ID invalid!");
            reject("Group or user ID invalid!");
        }
    })
}

/**
 * Adds a transaction to a group
 * @param {String} transactionId transaction id to add
 * @param {String} groupId group id receive transaction
 */
 export async function addTransactionToGroup(transactionId, groupId) {
    return new Promise(async (resolve, reject) => {
        const groupRef = doc(firestore, GROUP_COLLECTION, groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            const groupData = groupSnap.data();
            groupData.transactions.push(transactionId);
            await setDoc(groupRef, groupData);
            resolve(true);
        } else {
            console.log("Group ID invalid!");
            reject("Group ID invalid!");
        }
    })
}

/**
 * Removes a transaction from a group
 * @param {String} transactionId transaction id to remove
 * @param {String} groupId group id delete transaction on
 */
 export async function removeTransactionFromGroup(transactionId, groupId) {
    return new Promise(async (resolve, reject) => {
        const groupRef = doc(firestore, GROUP_COLLECTION, groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            const groupData = groupSnap.data();
            groupData.transactions.filter(t => t !== transactionId);
            await setDoc(groupRef, groupData);
            resolve(true);
        } else {
            console.log("Group ID invalid!");
            reject("Group ID invalid!");
        }
    })
}