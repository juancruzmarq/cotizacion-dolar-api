import { entidades } from "./entidades";

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (const entidad of entidades) {
    const existeEntidad = await prisma.entidad.findFirst({
      where: {
        nombre: entidad.nombre,
      },
    });
    if (!existeEntidad) {
      await prisma.entidad.create({
        data: {
          nombre: entidad.nombre,
          es_banco: entidad.es_banco,
          url: entidad.url,
        },
      });
    }
  }
}

main()
  .catch(() => {
    console.log("Error al crear las entidades");
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
