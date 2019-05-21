export interface IDocData {
  __key__?: string
  __ref__?: FirebaseFirestore.DocumentReference
}

export interface IUser extends IDocData {
  email: string
  fullname: string
  image: string
  roles: {
    admin?: boolean
    superadmin?: boolean
  },
  created: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp
}
