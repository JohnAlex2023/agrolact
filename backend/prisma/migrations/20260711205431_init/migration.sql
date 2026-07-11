-- CreateEnum
CREATE TYPE "rol" AS ENUM ('ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA', 'ENCARGADO_TIENDA');

-- CreateEnum
CREATE TYPE "jornada" AS ENUM ('MANANA', 'TARDE');

-- CreateEnum
CREATE TYPE "estado_quincena" AS ENUM ('ABIERTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "tipo_venta" AS ENUM ('CONTADO', 'FIADO');

-- CreateEnum
CREATE TYPE "accion_auditoria" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" UUID NOT NULL,
    "nombres" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quincenas" (
    "id" UUID NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "precio_litro" DECIMAL(10,2),
    "estado" "estado_quincena" NOT NULL DEFAULT 'ABIERTA',
    "creado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quincenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_leche" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "quincena_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "jornada" "jornada" NOT NULL,
    "litros" DECIMAL(8,2) NOT NULL,
    "registrado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_leche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correcciones_leche" (
    "id" UUID NOT NULL,
    "registro_id" UUID NOT NULL,
    "valor_anterior" DECIMAL(8,2) NOT NULL,
    "valor_nuevo" DECIMAL(8,2) NOT NULL,
    "observacion" TEXT NOT NULL,
    "corregido_por" UUID NOT NULL,
    "corregido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correcciones_leche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liquidaciones" (
    "id" UUID NOT NULL,
    "quincena_id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "total_litros" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valor_bruto" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento_adelantos" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "descuento_fiados" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "saldo_deuda_anterior" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "neto_pagar" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "saldo_nuevo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liquidaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adelantos" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "abono_acordado" DECIMAL(12,2),
    "observacion" TEXT,
    "registrado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adelantos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonos_adelanto" (
    "id" UUID NOT NULL,
    "adelanto_id" UUID NOT NULL,
    "liquidacion_id" UUID NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abonos_adelanto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad_medida" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas_tienda" (
    "id" UUID NOT NULL,
    "socio_id" UUID NOT NULL,
    "quincena_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "tipo" "tipo_venta" NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "descontado" BOOLEAN NOT NULL DEFAULT false,
    "registrado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_tienda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_operativos" (
    "id" UUID NOT NULL,
    "quincena_id" UUID NOT NULL,
    "concepto" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "registrado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gastos_operativos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "entidad" TEXT NOT NULL,
    "registro_id" UUID,
    "accion" "accion_auditoria" NOT NULL,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socios_cedula_key" ON "socios"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "registros_leche_socio_id_fecha_jornada_key" ON "registros_leche"("socio_id", "fecha", "jornada");

-- CreateIndex
CREATE UNIQUE INDEX "liquidaciones_quincena_id_socio_id_key" ON "liquidaciones"("quincena_id", "socio_id");

-- AddForeignKey
ALTER TABLE "quincenas" ADD CONSTRAINT "quincenas_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_leche" ADD CONSTRAINT "registros_leche_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_leche" ADD CONSTRAINT "registros_leche_quincena_id_fkey" FOREIGN KEY ("quincena_id") REFERENCES "quincenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_leche" ADD CONSTRAINT "registros_leche_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_leche" ADD CONSTRAINT "correcciones_leche_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "registros_leche"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "correcciones_leche" ADD CONSTRAINT "correcciones_leche_corregido_por_fkey" FOREIGN KEY ("corregido_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_quincena_id_fkey" FOREIGN KEY ("quincena_id") REFERENCES "quincenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adelantos" ADD CONSTRAINT "adelantos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adelantos" ADD CONSTRAINT "adelantos_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos_adelanto" ADD CONSTRAINT "abonos_adelanto_adelanto_id_fkey" FOREIGN KEY ("adelanto_id") REFERENCES "adelantos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos_adelanto" ADD CONSTRAINT "abonos_adelanto_liquidacion_id_fkey" FOREIGN KEY ("liquidacion_id") REFERENCES "liquidaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_tienda" ADD CONSTRAINT "ventas_tienda_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_tienda" ADD CONSTRAINT "ventas_tienda_quincena_id_fkey" FOREIGN KEY ("quincena_id") REFERENCES "quincenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_tienda" ADD CONSTRAINT "ventas_tienda_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_tienda" ADD CONSTRAINT "ventas_tienda_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_operativos" ADD CONSTRAINT "gastos_operativos_quincena_id_fkey" FOREIGN KEY ("quincena_id") REFERENCES "quincenas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_operativos" ADD CONSTRAINT "gastos_operativos_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
