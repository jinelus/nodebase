import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { db } from './connection'
import { users } from './schemas'

await db.delete(users)

console.log(chalk.green('Seeding database...'))

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  },
])
console.log(chalk.green('Database seeded successfully.'))

process.exit()
