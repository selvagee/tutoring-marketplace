import { seedAll } from '../server/seedDatabase';

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedAll();
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();