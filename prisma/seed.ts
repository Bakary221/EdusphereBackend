import { PrismaClient, UserRole, SchoolType, SchoolStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Clear existing data (optional, but good for fresh seeds)
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // 1. Create a central SUPER_ADMIN
  await prisma.user.create({
    data: {
      email: 'superadmin@edusphere.sn',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });

  // Optional: create a placeholder school entry (without tenant-specific users)
  await prisma.school.create({
    data: {
      name: 'École de démonstration',
      slug: 'demo-ecole',
      type: SchoolType.PRIVATE,
      status: SchoolStatus.PENDING,
      plan: 'free',
      email: 'contact@demo-ecole.local',
      databaseUrl: 'postgresql://localhost/demo-ecole',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
