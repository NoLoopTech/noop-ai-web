import { faker } from "@faker-js/faker"
import { Lead } from "./schema"

const generateLeads = () => {
  return Array.from({ length: 30 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const createdAt = faker.date.past()
    return {
      id: faker.string.uuid(),
      userName: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`,
      email: faker.internet.email({ firstName }).toLocaleLowerCase(),
      phoneNumber: faker.phone.number({ style: "international" }),
      preference: faker.helpers.arrayElements(
        [
          "Sneakers",
          "White",
          "Hi-Top",
          "Low-Top",
          "Running",
          "Casual",
          "Sports",
          "Fashion",
          "Comfort",
          "Lifestyle",
          "Limited Edition",
          "Eco-Friendly",
          "Luxury",
          "Vintage",
          "Custom",
          "Collaboration",
          "Performance",
          "Everyday Wear",
          "Outdoor",
          "Travel",
          "Athletic",
          "Streetwear",
          "Classic",
          "Trendy",
          "Bold",
          "Minimalist"
        ],
        { min: 3, max: 6 }
      ),
      score: faker.helpers.arrayElement(["cold", "warm", "hot"]),
      status: faker.helpers.arrayElement(["new", "contacted", "closed"]),
      createdAt
    }
  })
}

// Singleton data
let leads: Lead[] | null = null

export const getLeads = () => {
  if (!leads) {
    leads = generateLeads() // Generate data once
  }
  return leads
}
