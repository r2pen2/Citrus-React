import { firestore } from "./firebase";
import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { sortByDate } from "./sorting";


const USER_COLLECTION = "users";
const GROUP_COLLECTION = "groups";
const TRANSACTION_COLLECTION = "transactions";
const BADGES_COLLECTION = "badges";
const DEFAULT_PROFILE_PICTURES = "defaultProfilePictures"

/**
 * Generates a random id string of a given length
 * @param {Number} length length of id to be created 
 * @returns {String} generated id
 */
function generateId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

/**
 * 
 * Syncronizes database with the current user.
 * If user does not exist in the database, create a document with default data.
 * If the user already exists in the database, update their metadata.
 * @param {Object} user the current user
 * @returns {Boolean} true if user already existed, false if it had to be created
 */
export async function syncUserDoc(user) {
    return new Promise(async function(resolve, reject) {
        const docRef = doc(firestore, USER_COLLECTION, user.uid);
        const docSnap = await getDoc(docRef);
        var data = null;
        if (docSnap.exists()) {
            // This document already exists, so we update it
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
                }).then(resolve(false));
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
                    bookmarks: [

                    ]
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
            await setDoc(docRef, data).then(resolve(true));
        }
    })
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
    async function fetchName(id, count) {
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
                if (count > 6) {
                    resolve("?")
                } else {
                    console.log("Didn't find user on query " + (count + 1))
                    setTimeout(() => {
                        return fetchName(id, count + 1);
                    }, 500);
                }
            }
        })
    }
    return fetchName(id, 0);
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
    async function fetchPhoto(id, count) {
        return new Promise(async (resolve, reject) => {
            const docRef = doc(firestore, USER_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                if (docSnap.data().personalData.profilePictureUrl) {
                    resolve(docSnap.data().personalData.profilePictureUrl);
                } else {
                    resolve("https://robohash.org/" + id);
                }
            } else {
                console.log("No user with this ID exists on DB");
                if (count > 6) {
                    resolve("?")
                } else {
                    console.log("Didn't find user on query " + (count + 1))
                    setTimeout(() => {
                        return fetchPhoto(id, count + 1);
                    }, 500);
                }
            }
        })
    }

    return fetchPhoto(id, 0);
}

/**
 * Adds a transaction to a user's active transaction array
 * @param {String} userId user's id to get transaction added
 * @param {String} transactionId id of transaction to add
 * @returns {Boolean} true if transaction is added, false if transaction was already there
 */
export async function addTransactionToUser(userId, transactionId) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (!data.transactions.active.includes(transactionId)) {
                // Only add transaction if it's not already on the user
                data.transactions.active.push(transactionId);
            } else {
                resolve(false);
            }
            await setDoc(docRef, data);
            resolve(true);
        } else {
            console.log("No user with this ID exists on DB");
            reject("No user with this ID");
        }
    })
}

/**
 * Adds a transaction to the DB and adds it to the two users' active
 * @returns {String} id of the new transaction
 */
 export async function createTransactionOnDB(newTransaction) {
    return new Promise(async (resolve, reject) => {
        const docRef = await addDoc(collection(firestore, TRANSACTION_COLLECTION), newTransaction);
        console.log("Transaction created with ID: " + docRef.id);
        // Add transaction to each payer
        for (const payer of newTransaction.payers) {
            addTransactionToUser(payer.userId, docRef.id);
        }
        // Add transaction to each fronter
        for (const fronter of newTransaction.fronters) {
            addTransactionToUser(fronter.userId, docRef.id);
        }
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
 * Get transaction detail by transaction id
 * @param {String} id transactionId
 * @returns {Object} transaction as object
 */
 export async function getTransactionById(id) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, TRANSACTION_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data())
        } else {
            console.log("No transaction with this ID exists on DB");
            resolve("?")
        }
    })
}

/**
 * Get transaction title by transaction id
 * @param {String} id transactionId
 * @returns {Object} transaction title
 */
 export async function getTransactionTitleById(id) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, TRANSACTION_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data().title)
        } else {
            console.log("No transaction with this ID exists on DB");
            resolve("?")
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
 * Fetch an object containing user's active and inactive transactions
 * @param {String} userId user's id to get transactions for
 * @returns {Object} all of a user's transactions
 */
 export async function getActiveTransactionsByUserId(userId) {
    
    /**
     * Fetch the date of a transaction
     * @param {String} transactionId id of transaction to get date for
     * @returns {Date} date of transaction 
     */
    async function getTransactionDate(transactionId) {
        return new Promise(async (resolve, reject) => {
            const transactionRef = doc(firestore, TRANSACTION_COLLECTION, transactionId);
            const transactionSnap = await getDoc(transactionRef);
            if (transactionSnap.exists()) {
                resolve(transactionSnap.data().createdAt);
            } else {
                resolve(null);
            }
        })
    }
    
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            var transactionList = [];
            for (const t of data.transactions.active) {
                let transactionDate = await getTransactionDate(t);
                transactionList.push({transactionId: t, date: transactionDate});
            }

            resolve(sortByDate(transactionList));
        } else {
            console.log("No user with this ID exists on DB");
            reject("No user with this ID");
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
                uData.groups = uData.groups.filter(g => g !== id);
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
            groupData.users = groupData.users.filter(u => u !== userId);
            const userData = userSnap.data();
            userData.groups = userData.groups.filter(g => g !== groupId);
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
 * Gets a list of all groups a user is in
 * @param {String} userId ID of user to get groups list from
 */
 export async function getGroupsByUserId(userId) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().groups) {
                resolve(docSnap.data().groups);
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
 * Returns the name of a group
 * @param {String} groupId group id to get name from
 */
 export async function getGroupNameById(groupId) {
    return new Promise(async (resolve, reject) => {
        const groupRef = doc(firestore, GROUP_COLLECTION, groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            resolve(groupSnap.data().name);
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
            groupData.transactions = groupData.transactions.filter(t => t !== transactionId);
            await setDoc(groupRef, groupData);
            resolve(true);
        } else {
            console.log("Group ID invalid!");
            reject("Group ID invalid!");
        }
    })
}

/**
 * Get a user's bookmarks by ID
 * @param {String} id user ID
 * @returns {Array} user's bookmarks
 */
 export async function getBookmarksById(id) {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().bookmarks.length <= 0) {
                resolve("none");
            } else {
                resolve(docSnap.data().bookmarks);
            }
        } else {
            console.log("No user with this ID exists on DB");
            resolve("?")
        }
    })
}

/**
 * Adds a bookmark to a user
 * @param {String} id user ID
 * @param {Object} bookmark bookmark to add
 * @returns {String} id of new bookmark
 */
 export async function createBookmarkOnUser(id, bookmark) {

    function formatBookmarkString(s) {
        if (!s) {
            return null;
        }
        if (s === "") {
            return null;
        }
        return s;
    }

    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const newId = generateId(32)
            const indexedBookmark = {
                id: newId,
                title: formatBookmarkString(bookmark.title),
                who: formatBookmarkString(bookmark.who),
                amount: bookmark.amount,
                note: formatBookmarkString(bookmark.note),
                receiptUrl: formatBookmarkString(bookmark.receiptUrl),
                createdAt: new Date(),
            }
            userData.bookmarks.push(indexedBookmark);
            setDoc(docRef, userData);
            resolve(newId)
        } else {
            console.log("No user with this ID exists on DB");
            resolve("?")
        }
    })
}

/**
 * Removes a bookmark from a user
 * @param {String} id user ID
 * @param {Object} bookmarkId id of bookmark to remove
 */
 export async function removeBookmarkFromUser(id, bookmarkId) {

    return new Promise(async (resolve, reject) => {
        const docRef = doc(firestore, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        console.log("Deleting: " + bookmarkId);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log(userData.bookmarks)
            userData.bookmarks = userData.bookmarks.filter(b => b.id !== bookmarkId);
            setDoc(docRef, userData);
            resolve();
        } else {
            console.log("No user with this ID exists on DB");
            resolve("?")
        }
    })
}