import chalk from 'chalk'

if (process.env.NODE_ENV === 'production') {
  console.error(chalk.red('Error: Seed script cannot be run in production.'))
  process.exit(1)
}

// try {
//   await db.delete(users)
//   console.log(chalk.green('Seeding database...'))
//   await db.insert(users).values([
//     {
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       phone: faker.phone.number(),
//     },
//     {
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       phone: faker.phone.number(),
//     },
//   ])
//   console.log(chalk.green('Database seeded successfully.'))
//   process.exit(0)
// } catch (error) {
//   console.error(chalk.red('Error seeding database:'), error)
//   process.exit(1)
// }
