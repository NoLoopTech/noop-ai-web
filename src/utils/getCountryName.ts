import countryData from "@/lib/countryData.json"

export const getCountryName = (code: string) => {
  const country = countryData.find(c => c.code === code)
  return country ? country.name : code
}

export const getCountryCode = (name: string): string | null => {
  const normalizedName = name.replace(/\s+/g, "").toLowerCase()

  const country = countryData.find(c => {
    const normalizedCountryName = c.name.replace(/\s+/g, "").toLowerCase()
    return normalizedCountryName === normalizedName
  })

  return country ? country.code : null
}
