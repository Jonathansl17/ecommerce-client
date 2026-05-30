// Marca a un ClientUser existente como administrador (US-REV-005).
// Uso:  node prisma/make-admin.js [email]
// Sin argumento usa el email por defecto.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_EMAIL = 'yarield252@gmail.com';

async function main() {
  const email = process.argv[2] ?? DEFAULT_EMAIL;

  const usuario = await prisma.clientUser.findUnique({ where: { email } });
  if (!usuario) {
    throw new Error(`No existe un ClientUser con email ${email}`);
  }

  const registro = await prisma.admin.upsert({
    where: { clientUserId: usuario.id },
    update: { admin: true },
    create: { clientUserId: usuario.id, admin: true },
  });

  console.log(
    `Usuario ${email} (id ${usuario.id}) marcado como admin (fila ${registro.id}).`,
  );
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
