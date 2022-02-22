import fs, { WriteStream } from 'fs'
import path from 'path'

import { bufferSize } from './const'
import { detectImgStart, detectImgStop } from './libs'

const filepath = process.argv[2]
const savepath = path.resolve('./output')

fs.mkdirSync(savepath, { recursive: true })

const bufPrev = Buffer.alloc(bufferSize)
let index = 0
let fileIndex = 0
let writeStream: WriteStream | null = null
let imageType: 'png' | 'jpg' | null = null

const fileStream = fs.createReadStream(filepath, {
  highWaterMark: bufferSize,
})
fileStream.on('data', (chunk: Buffer) => {
  index += 1
  if (index === 1) {
    chunk.copy(bufPrev)
    return
  }
  const hex = Buffer.concat([bufPrev, chunk]).toString('hex')

  const imgEndIndicator = detectImgStop(hex)
  if (imgEndIndicator && imgEndIndicator.imgType === imageType) {
    console.log(`${imgEndIndicator.imgType} ended at ${bufferSize * index}`)
    // console.log(imgEndIndicator)
    imageType = null
    const ended = Buffer.from(
      Buffer.from(chunk)
        .toString('hex')
        .substring(
          0,
          imgEndIndicator.index - bufferSize * 2 + imgEndIndicator.indicatorLen,
        ),
      'hex',
    )
    if (writeStream) {
      writeStream.end(ended)
    }
    writeStream = null
  }

  const imgStartIndicator = detectImgStart(hex)

  if (imgStartIndicator && !imageType) {
    imageType = imgStartIndicator.imgType
    fileIndex += 1
    console.log(
      `found a ${imageType} file at ${bufferSize * index}, total:`,
      fileIndex,
    )
    // console.log(imgStartIndicator)
    writeStream = fs.createWriteStream(
      path.resolve(savepath, `img_${fileIndex}.${imgStartIndicator.imgType}`),
      { flags: 'w' },
    )
    writeStream.write(
      Buffer.from(hex.substring(imgStartIndicator.index), 'hex'),
    )
  }

  if (
    imageType &&
    imgEndIndicator?.imgType !== imageType &&
    !imgStartIndicator
  ) {
    // console.log(`write ${imageType} data`)
    if (writeStream) {
      writeStream.write(chunk)
    }
  }
  chunk.copy(bufPrev)
})
