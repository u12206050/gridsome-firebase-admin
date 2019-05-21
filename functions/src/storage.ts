import { admin, db, functions, newTimestamp } from './fire'
import * as sharp from 'sharp'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

export const onFileChange = functions.storage.object().onFinalize(async (object) => {
  const {
    bucket: fileBucket,
    name: filePath,
    contentType,
    metadata } = object

  // Exit if this is triggered on a file that is not an image.
  if (!filePath || !contentType || !contentType.startsWith('image/')) {
    console.log('This is not an image.')
    return null
  }

  const { u, p, uuid } = metadata as { [k:string]: string }
  if (!uuid) return

  const fileName = path.basename(filePath)

  if (!fileName.startsWith('new-')) {
    console.log('We already processed this file!')
    return null
  }

  const bucket = admin.storage().bucket(fileBucket)

  const newFileName = fileName.replace(/^new-/, '')
  const tmp1FilePath = path.join(os.tmpdir(), fileName)
  const tmp2FilePath = path.join(os.tmpdir(), newFileName)

  const newMetadata = {
    contentType: contentType,
    metadata: {
      firebaseStorageDownloadTokens: uuid
    }
  }

  // Download the image ot a tmp directory
  await bucket.file(filePath).download({destination: tmp1FilePath})
  console.log('Image downloaded locally to', tmp1FilePath)

  // Resize image using Sharp & ImageMagick.
  const fileInfo = await sharp(tmp1FilePath)
    .resize(2048, 2048, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    }).toFile(tmp2FilePath);

  console.log('Resized created at', tmp2FilePath)

  const newFilePath = path.join(path.dirname(filePath), newFileName)

  const file = await bucket.upload(tmp2FilePath, {
    destination: newFilePath,
    metadata: newMetadata
  }).then(data => data[0])

  await bucket.file(filePath).delete()

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`
  await db.collection('media').doc(uuid).set({
    uid: u,
    url,
    newFilePath,
    size: {
      w: fileInfo.width,
      h: fileInfo.height
    },
    uploaded: newTimestamp(),
    private: p === '1' ? true : false
  })

  // Once the file has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(tmp1FilePath)
  fs.unlinkSync(tmp2FilePath)

  console.log('File resize completed without errors')

  return true
})