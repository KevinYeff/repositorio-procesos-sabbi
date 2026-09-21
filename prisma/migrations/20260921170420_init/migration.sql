-- CreateEnum
CREATE TYPE "EstadoProceso" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "area_id" TEXT,
    "es_aprobador" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procesos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "notas" TEXT,
    "area_id" TEXT NOT NULL,
    "proyecto_id" TEXT,
    "autor_id" TEXT NOT NULL,
    "aprobador_id" TEXT NOT NULL,
    "estado" "EstadoProceso" NOT NULL DEFAULT 'PENDIENTE',
    "contenido_xml" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aprobaciones" (
    "id" TEXT NOT NULL,
    "proceso_id" TEXT NOT NULL,
    "aprobador_id" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aprobaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "areas_nombre_key" ON "areas"("nombre");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesos" ADD CONSTRAINT "procesos_aprobador_id_fkey" FOREIGN KEY ("aprobador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprobaciones" ADD CONSTRAINT "aprobaciones_proceso_id_fkey" FOREIGN KEY ("proceso_id") REFERENCES "procesos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprobaciones" ADD CONSTRAINT "aprobaciones_aprobador_id_fkey" FOREIGN KEY ("aprobador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
