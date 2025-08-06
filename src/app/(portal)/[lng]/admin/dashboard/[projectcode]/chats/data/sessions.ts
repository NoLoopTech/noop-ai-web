// import { faker } from "@faker-js/faker"
// import { Session } from "./schema"
// import { formatDate } from "date-fns"

// const generateSessions = () => {
//   return Array.from({ length: 30 }, () => {
//     // const firstName = faker.person.firstName()
//     // const lastName = faker.person.lastName()
//     const dateTime = faker.date.past()
//     return {
//       id: faker.string.uuid(),
//       country: faker.location.country(),
//       aiScore: faker.number.int({ min: 0, max: 100 }).toString(),
//       duration: `${faker.number.int({ min: 1, max: 120 })} mins`,
//       chatSummary: faker.lorem.sentence(),
//       dateTime: formatDate(dateTime, "yyyy-MM-dd HH:mm:ss")
//     }
//   })
// }

// // Singleton data
// let sessions: Session[] | null = null

// export const getSessions = () => {
//   if (!sessions) {
//     sessions = generateSessions() // Generate data once
//   }
//   return sessions
// }
