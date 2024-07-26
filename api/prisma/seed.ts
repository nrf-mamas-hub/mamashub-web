import { PrismaClient } from "@prisma/client";
import bycrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash('password', salt);

  await prisma.user.create({
    data: {
      id: '1',
      email: "admin@mamashub.com",
      password: hashedPassword,
      names: 'Admin',
      role: 'ADMINISTRATOR',
      phone: '+254796789225',
      salt: salt,
      verified: true,
      data: { newUser: false }
      
    },
  });

    console.log('Database seeded successfully');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});