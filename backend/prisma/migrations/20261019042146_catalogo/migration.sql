-- CreateEnum
CREATE TYPE "Level" AS ENUM ('AUXILIAR', 'OPERARIO', 'TECNICO', 'TECNOLOGO', 'PROFUNDIZACION', 'PROFESIONAL');

-- CreateEnum
CREATE TYPE "InstitutionKind" AS ENUM ('UNIVERSIDAD', 'INSTITUCION_UNIVERSITARIA', 'TECNOLOGICA_TECNICA', 'SENA');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('VIGENTE', 'POR_CONFIRMAR', 'NO_VIGENTE');

-- CreateEnum
CREATE TYPE "FinancingType" AS ENUM ('BECA', 'CREDITO', 'GRATUIDAD', 'SUBSIDIO');

-- CreateEnum
CREATE TYPE "FinancingScope" AS ENUM ('TODAS', 'PUBLICA', 'PRIVADA');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('GUIA', 'ENLACE', 'HERRAMIENTA', 'VIDEO');

-- CreateEnum
CREATE TYPE "WellbeingCategory" AS ENUM ('SALUD', 'APOYO_ECONOMICO', 'ACADEMICO', 'DEPORTE_CULTURA', 'INCLUSION');

-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "durationLabel" TEXT,
ADD COLUMN     "level" "Level" NOT NULL DEFAULT 'PROFESIONAL',
ADD COLUMN     "outlook" TEXT;

-- AlterTable
ALTER TABLE "CareerUniversity" ADD COLUMN     "offerStatus" "OfferStatus" NOT NULL DEFAULT 'POR_CONFIRMAR',
ADD COLUMN     "programUrl" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "scope" "FinancingScope" NOT NULL DEFAULT 'TODAS',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" "FinancingType" NOT NULL DEFAULT 'BECA';

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "description" TEXT,
ADD COLUMN     "kind" "InstitutionKind" NOT NULL DEFAULT 'UNIVERSIDAD';

-- CreateTable
CREATE TABLE "AdmissionStep" (
    "id" SERIAL NOT NULL,
    "track" TEXT NOT NULL DEFAULT 'UNIVERSIDAD',
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "AdmissionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportantDate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "whenLabel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ImportantDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "type" "ResourceType" NOT NULL DEFAULT 'ENLACE',
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WellbeingService" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "WellbeingCategory" NOT NULL,
    "url" TEXT,

    CONSTRAINT "WellbeingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Career_area_idx" ON "Career"("area");
