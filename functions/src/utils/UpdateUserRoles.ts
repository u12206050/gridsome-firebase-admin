import { auth } from '../fire'
import { isEqual } from 'lodash'
import { Change } from 'firebase-functions';

export default function (uid: string, change: Change<FirebaseFirestore.DocumentSnapshot>) {
  const before = change.before.get('roles')
  const after = change.after.get('roles')

  // Check if roles have chenged and update claims
  if (!isEqual(before, after)) {
    const roles: {
      [role: string]: boolean
    } = {}
    after && Object.keys(after).forEach(r => {
      if (after[r] === true) roles[r] = true
    })
    return auth.setCustomUserClaims(uid, roles).then(() => {
      return auth.revokeRefreshTokens(uid)
    })
  }

  return Promise.resolve(false)
}