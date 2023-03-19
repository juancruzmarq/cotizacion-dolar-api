-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" SERIAL NOT NULL,
    "moneda" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMPTZ(6) NOT NULL,
    "compra" DOUBLE PRECISION NOT NULL,
    "venta" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "EntidadId" INTEGER,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entidad" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "es_banco" BOOLEAN NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Entidad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_EntidadId_fkey" FOREIGN KEY ("EntidadId") REFERENCES "Entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
