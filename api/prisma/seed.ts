import db from '../src/lib/prisma';

import bycrypt from 'bcrypt';

const main = async () => {
  
  const salt = await bycrypt.genSalt(10);

  const hashedPassword = await bycrypt.hash('password', salt);

  await db.user.create({
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
    await db.$disconnect();
});