import { doc, collection, addDoc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { Debugger } from "../../debugger";

import { changeTypes, dbObjectTypes } from "../dbManager";

export class ObjectManager {

    constructor(_objectType, _documentId, _data) {
        this.objectType = _objectType;
        this.documentId = _documentId;
        this.data = null;
        this.docRef = doc(firestore, this.getCollection(), _documentId);
        this.children = [];
        this.error = false;
        this.fetched = false;
        this.changes = [];
    }

    addChange(change) {
        this.changed = true;
        this.changes.push(change);
    }

    async applyChanges() {
        return new Promise(async (resolve, reject) => {
            if (!this.fetched) {
                Debugger.log("Fetching data to apply changes...");
                await this.fetchData();
                Debugger.log("Fetch complete!");
            }
            if (this.data) {
                this.data = this.formatData();
                for (const change of this.changes) {
                    switch(change.type) {
                        case changeTypes.ADD:
                            this.data = this.handleAdd(change, this.data);
                            break;
                        case changeTypes.REMOVE:
                            this.data = this.handleRemove(change, this.data);
                            break;
                        case changeTypes.SET:
                            this.data = this.handleSet(change, this.data);
                            break;
                        default:
                            Debugger.log("Invalid change type when trying to apply changes!");
                            break;
                    }
                }
                resolve(true);
            } else {
                Debugger.log("Applying changes failed because data was null!");
                resolve(false);
            }
        })
    }

    /**
     * Get firestore collection for current object type
     * @returns {String} firestore collection for object type
     */
    getCollection() {
        switch(this.objectType) {
            case dbObjectTypes.BOOKMARK:
                return "bookmarks";
            case dbObjectTypes.GROUP:
                return "groups";
            case dbObjectTypes.TRANSACTIONATTEMPT:
                return "transactionAttempts";
            case dbObjectTypes.TRANSACTION:
                return "transactions";
            case dbObjectTypes.INVITATION:
                // Invitations have different collections depending on their type
                return this.data.inviteType.getCollection();
            case dbObjectTypes.USER:
                return "users";
            case dbObjectTypes.BADGE:
                return "badges";
            default:
                return null;
        }
    }

    /**
     * Get this ObjectManager's document id
     * @returns {String} id of this ObjectManager's firestore document
     */
    getDocumentId() {
        return this.documentId;
    }

    /**
     * Get this ObjectManager's type
     * @returns {String} object type
     */
    getObjectType() {
        return this.objectType;
    }

    /**
     * Get a string representation of this ObjectManager
     * @returns {String} string representation of the object
     */
    toString() {
        return 'Object manager of type "' + this.objectType + '" with id "' + this.documentId + '"';
    }
    
    /**
     * Log the objectManager's data
     */
    logData() {
        Debugger.log(this.data);
    }

    logChangeFail(change) {
        Debugger.log(change.toString + ' failed to apply on object "' + this.objectType + '" because field does not accept this kind of change!');
    }

    logInvalidChangeField(change) {
        Debugger.log(change.toString + ' failed to apply on object "' + this.objectType + '" because the field was not recognized!');
    }

    logInvalidGetField(field) {
        Debugger.log('"' + field + '" is not a valid field on object "' + this.objectType + '"!');
    }

    getChildren() {
        return this.children;
    }

    /**
    * Fetch data from database by document reference
    * @returns {Object} data from document snapshot
    */
    async fetchData() {
        Debugger.log("Fetching object data...");
        return new Promise(async (resolve) => {
            const docSnap = await getDoc(this.docRef);
            if (docSnap.exists()) {
                this.data = docSnap.data();
                this.fetched = true;
                resolve(docSnap.data());
            } else {
                Debugger.log("Error: Document snapshot didn't exist!");
                this.data = null;
                resolve(false);
            }
        })
    }

    /**
     * Fetch data several times until either timeout or document exists
     * @param {Number} maxAttempts number of times to try fetching data
     * @param {Number} delay delay in milliseconds between attempts
     */
    async fetchDataAndRetry(maxAttempts, delay) {
        async function fetchRecursive(fetchAttempts) {
            return new Promise(async (resolve) => {
                const docSnap = await getDoc(this.docRef);
                if (docSnap.exists()) {
                    this.data = docSnap.data();
                    this.fetched = true;
                    resolve(docSnap.data());
                } else {
                    Debugger.log("No document with this ID exists on DB.");
                    if (fetchAttempts > maxAttempts) {
                        resolve(null);
                    } else {
                        Debugger.log("Didn't find data on attempt " + (fetchAttempts + 1));
                        setTimeout(() => {
                            resolve(fetchRecursive(fetchAttempts + 1));
                        }, delay);
                    }
                }
            })
        }
        fetchRecursive(0).then((result) => {
            return result;
        });
    }

    /**
     * Get data from ObjectManager.
     * @returns {Object} data
     */
    getData() {
        if (this.data) {
            return this.data;
        } else {
            if (!this.fetched) {
                Debugger.log("We need to fetch data first... Fetching!");
                return this.fetchData();
            } else {
                Debugger.log("getData() returned null AFTER fetching!");
            }
        }
    }

    // Set document data
    setData(newData) {
        this.data = newData;
    }

    // Send only the top (this) to database
    async pushSingle() {
        if (!this.error) {
            // Assuming everything was OK, we push
            return new Promise(async (resolve) => {
                if (this.changed) {
                    if (this.documentId) {
                        // Document has an ID. Set data and return true
                        Debugger.log('Applying changes to: ' + this.toString());
                        await this.applyChanges();                    
                        Debugger.log('Pushing changes to: ' + this.toString());
                        await setDoc(this.docRef, this.data);
                    } else {
                        await this.applyChanges();
                        const newDoc = await addDoc(collection(firestore, this.getCollection), this.data);
                        this.documentId = newDoc.id;
                        this.docRef = newDoc;
                        Debugger.log('Created new object of type"' + this.objectType + '" with id "' + this.documentId + '"');
                    }
                } else {
                    Debugger.log("No changes were made to: " + this.toString());
                }
                resolve(true);
            })
        } else {
            // Don't push if there was an error
            Debugger.log("Error detected in objectManager: " + this.toString());
            Debugger.log("Changes will not be pushed!");
        }
    }

    // Send this, children, and children of children to the database
    async push() {
        return new Promise(async (resolve) => {
            let selfPushed = await this.pushSingle();
            if (selfPushed) {
                for (const childManager of this.children) {
                    await childManager.push();
                }
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }

    // Print no data error and return param;
    logNoDataError(retval) {
        Debugger.log("Error! ObjectManager<" + this.objectType + "> failed to return data to child class.");
        this.error = true;
        return retval;
    }

    equals(objectManager) {
        const matchingTypes = objectManager.getObjectType() === this.getObjectType();
        const matchingIds = objectManager.getObjectId() === this.getObjectId();
        return matchingTypes && matchingIds;
    }

    addChild(objectManager) {
        this.children.push(objectManager);
    }

    removeChild(objectManager) {
        const newChildren = this.children.filter(child => !child.equals(objectManager));
        this.children = newChildren;
    }
}