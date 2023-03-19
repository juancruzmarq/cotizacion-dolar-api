-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "mensaje" VARCHAR(255) NOT NULL,
    "moneda" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(255) NOT NULL,
    "EntidadId" INTEGER,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_EntidadId_fkey" FOREIGN KEY ("EntidadId") REFERENCES "Entidad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
