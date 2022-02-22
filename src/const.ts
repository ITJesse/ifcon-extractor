export const PNG_HEADER = '89504E470D0A1A0A'.toLowerCase()
export const PNG_ENDED = '49454E44AE426082'.toLowerCase()
export const JPEG_HEADER = /FFD8FFE[0,1]{1}/i
export const JPEG_ENDED = /FFD9[0-9A-F]{4}/i
export const JPEG_NOT_ENDED = ['FFED', '3842', '0038'].map((e) =>
  e.toLowerCase(),
)
export const bufferSize = 256
