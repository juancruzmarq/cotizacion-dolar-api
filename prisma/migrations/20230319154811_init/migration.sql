/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Entidad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Entidad` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cotizacion" ALTER COLUMN "compra" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Entidad" ALTER COLUMN "activo" DROP NOT NULL,
ALTER COLUMN "activo" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Entidad_nombre_key" ON "Entidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Entidad_url_key" ON "Entidad"("url");
