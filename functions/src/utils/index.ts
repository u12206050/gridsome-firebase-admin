import { IDocData } from '../collections/types'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

export function notUndefined(val: any) {
  return typeof val !== 'undefined'
}

export function docData(doc: DocumentSnapshot) {
  const data = doc.data() || {} as IDocData
  data.__key__ = doc.id
  data.__ref__ = doc.ref
  return data
}

export function emailId(email: string) {
  return String(email).replace(/@/gm, '-at-').replace(/\./gm, '-dot-')
}