import { bufferSize, JPEG_ENDED, JPEG_HEADER, PNG_ENDED, PNG_HEADER } from './const'

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

  index = hex.indexOf(JPEG_HEADER)
  if (index !== -1) {
    result = { index, indicatorLen: JPEG_HEADER.length, imgType: 'jpg' }
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

  index = hex.indexOf(JPEG_ENDED)
  if (index !== -1) {
    result = { index, indicatorLen: JPEG_ENDED.length, imgType: 'jpg' }
  }

  if (result && result.index + result.indicatorLen < bufferSize * 2) {
    result = null
  }

  return result
}
