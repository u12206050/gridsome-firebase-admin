import {db, authFn, firestoreFn, newTimestamp } from '../fire'
import { notUndefined } from '../utils'

import { IUser } from './types'
import UpdateUserRoles from '../utils/UpdateUserRoles'

/**
 *
 *
 * AUTH
 *
 * TRIGGERS
 *
 *
 */

export const onUserSignup = authFn.user().onCreate((authUser) => {
  const uid = authUser.uid
  const userRef = db.collection('users').doc(uid)
  const userData: IUser = {
    email: String(authUser.email),
    fullname: String(authUser.displayName),
    image: authUser.photoURL || '',
    roles: {},
    created: newTimestamp()
  }

  return userRef.set(userData)
})

export const onUserLeave = authFn.user().onDelete((authUser) => {
  return db.doc(`/users/${authUser.uid}`).delete()
})

/**
 *
 *
 * USER
 *
 * TRIGGERS
 *
 *
 */

/**
 * When user is created
 */

export const onUserUpdate = firestoreFn.document('users/{userId}').onUpdate((change, context) => {
  const { userId } = context.params
  const before = change.before.data()
  const after = change.after.data()

  if (!before || !after) return

  const queue: Promise<any>[] = []
  const changes: {
    [key:string]: any
  } = {}

  queue.push(UpdateUserRoles(userId, change))

  /* Check normal fields */
  Array('fullname', 'image', 'email').forEach(field => {
    if (notUndefined(before[field]) && before[field] !== after[field]) changes[field] = before[field]
  })

  if (Object.keys(changes).length > 0) {
    queue.push(change.after.ref.collection('logs').add({
      changes,
      updated: context.timestamp
    }))
  }

  return Promise.all(queue)
})
