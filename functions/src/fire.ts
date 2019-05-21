import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
const config = functions.config()

admin.initializeApp()

export { config, admin, functions }

export const db = admin.firestore()
export const auth = admin.auth()
export const authFn = functions.auth
export const firestoreFn = functions.firestore
export const httpsFn = functions.https

export const FieldValue = admin.firestore.FieldValue
/* Use deleteField() when you want to remove a field from a document */
export const deleteField = FieldValue.delete
/* Create a server-generated timestamp in the written data */
export const newTimestamp = FieldValue.serverTimestamp
/* Useful in api functions. `throw new HttpsError('code', 'message')` */
export const HttpsError = functions.https.HttpsError
