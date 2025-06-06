import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10); // Cambia la contraseña si lo deseas
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@fhernaes.com',
        password: hashed,
        role: 'admin',
      },
    });
    console.log('Usuario admin creado');
  } else {
    console.log('Ya existe un usuario admin');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
