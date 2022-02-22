import { bufferSize, JPEG_ENDED, JPEG_HEADER, JPEG_NOT_ENDED, PNG_ENDED, PNG_HEADER } from './const'

type ImageIndicator = {
  index: number
  indicatorLen: number
  imgType: 'png' | 'jpg'
}
export const detectImgStart = (hex: string): ImageIndicator | null => {
  let index
  let result: ImageIndicator | null = null

  index = hex.indexOf(PNG_HEADER)
  if (index !== -1) {
    result = { index, indicatorLen: PNG_HEADER.length, imgType: 'png' }
  }

  const match = hex.match(JPEG_HEADER)
  if (match && (match.index as number) % 2 === 0) {
    result = {
      index: match.index as number,
      indicatorLen: 8,
      imgType: 'jpg',
    }
  }

  if (result && result.index + result.indicatorLen < bufferSize * 2) {
    result = null
  }

  return result
}

export const detectImgStop = (hex: string): ImageIndicator | null => {
  let index
  let result: ImageIndicator | null = null

  index = hex.indexOf(PNG_ENDED)
  if (index !== -1) {
    result = { index, indicatorLen: PNG_ENDED.length, imgType: 'png' }
  }

  const match = hex.match(JPEG_ENDED)
  if (match && (match.index as number) % 2 === 0) {
    const str = match[0]
    if (JPEG_NOT_ENDED.some((e) => str.endsWith(e))) {
      result = null
    } else {
      result = {
        index: match.index as number,
        indicatorLen: 8,
        imgType: 'jpg',
      }
    }
  }

  if (result && result.index + result.indicatorLen < bufferSize * 2) {
    result = null
  }

  return result
}
