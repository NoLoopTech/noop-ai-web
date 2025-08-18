import countryData from "@/lib/countryData.json"

export const getCountryName = (code: string) => {
  const country = countryData.find(c => c.code === code)
  return country ? country.name : code
}
