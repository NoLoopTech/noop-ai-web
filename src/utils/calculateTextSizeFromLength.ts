export default function calculateTextSizeFromLength(text: string) {
  const bytes = new Blob([text]).size
  const kb = bytes / 1024
  const mb = kb / 1024

  return {
    bytes,
    kb,
    mb,
    formatted: {
      bytes: `${bytes} bytes`,
      kb: `${kb.toFixed(2)} KB`,
      mb: `${mb.toFixed(2)} MB`
    }
  }
}
