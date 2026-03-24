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

  // 1. Create a School
  const school = await prisma.school.create({
    data: {
      name: 'Lycée d\'Excellence',
      slug: 'lycee-excellence',
      type: SchoolType.LYCEE,
      status: SchoolStatus.ACTIVE,
      plan: 'premium',
      email: 'contact@lycee-excellence.sn',
    },
  });

  // 2. Create Users
  
  // SUPER_ADMIN (no school required)
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

  // SCHOOL_ADMIN
  await prisma.user.create({
    data: {
      email: 'admin@lycee-excellence.sn',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Lycee',
      role: UserRole.SCHOOL_ADMIN,
      isActive: true,
      emailVerified: true,
      schoolId: school.id,
    },
  });

  // TEACHER
  await prisma.user.create({
    data: {
      email: 'teacher@lycee-excellence.sn',
      passwordHash,
      firstName: 'Professeur',
      lastName: 'Math',
      role: UserRole.TEACHER,
      isActive: true,
      emailVerified: true,
      schoolId: school.id,
    },
  });

  // STUDENT
  await prisma.user.create({
    data: {
      email: 'student@lycee-excellence.sn',
      passwordHash,
      firstName: 'Elève',
      lastName: 'Brillant',
      role: UserRole.STUDENT,
      isActive: true,
      emailVerified: true,
      schoolId: school.id,
    },
  });

  // PARENT
  await prisma.user.create({
    data: {
      email: 'parent@lycee-excellence.sn',
      passwordHash,
      firstName: 'Parent',
      lastName: 'Responsable',
      role: UserRole.PARENT,
      isActive: true,
      emailVerified: true,
      schoolId: school.id,
    },
  });

  // ACCOUNTANT
  await prisma.user.create({
    data: {
      email: 'comptable@lycee-excellence.sn',
      passwordHash,
      firstName: 'Comptable',
      lastName: 'Rigoureux',
      role: UserRole.ACCOUNTANT,
      isActive: true,
      emailVerified: true,
      schoolId: school.id,
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
