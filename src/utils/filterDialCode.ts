export const filterDialCode = (
  input: string,
  option: { dialCode: string; name: string; code: string }
) => {
  const searchTerm = input.toLowerCase()
  return (
    option.dialCode.toLowerCase().includes(searchTerm) ||
    option.name.toLowerCase().includes(searchTerm) ||
    option.code.toLowerCase().includes(searchTerm)
  )
}
