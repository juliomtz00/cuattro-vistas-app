/*
  Warnings:

  - You are about to drop the column `acceptsCreditBank` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `acceptsCreditSocial` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `balcon` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `bathrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `cityId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `connectivity` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `constructionM2` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `downtown` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `furnished` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `greenAreas` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `halfBathrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `levels` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `parking` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `pool` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `terrainM2` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `urlGoogleMaps` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Property` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PropertyFeature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "halfBathrooms" INTEGER,
    "balcon" BOOLEAN DEFAULT false,
    "pool" BOOLEAN DEFAULT false,
    "terrainM2" REAL,
    "constructionM2" REAL,
    "levels" INTEGER,
    "downtown" BOOLEAN DEFAULT false,
    "parking" INTEGER,
    "acceptsCreditBank" BOOLEAN DEFAULT false,
    "acceptsCreditSocial" BOOLEAN DEFAULT false,
    "age" INTEGER,
    "connectivity" TEXT,
    "furnished" BOOLEAN DEFAULT false,
    "greenAreas" TEXT,
    "propertyId" INTEGER NOT NULL,
    CONSTRAINT "PropertyFeature_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "address" TEXT,
    "zipCode" INTEGER,
    "urlGoogleMaps" TEXT,
    "cityId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    CONSTRAINT "PropertyLocation_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PropertyLocation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyTypeId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "providerId" TEXT,
    "propertyRangeId" INTEGER,
    "illuminationId" INTEGER,
    "propertyConditionId" INTEGER,
    "zoneDemandId" INTEGER,
    "accesibilityId" INTEGER,
    "description" TEXT,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "videoUrl" TEXT,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PropertyStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyRangeId_fkey" FOREIGN KEY ("propertyRangeId") REFERENCES "PropertyRange" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_illuminationId_fkey" FOREIGN KEY ("illuminationId") REFERENCES "Illumination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyConditionId_fkey" FOREIGN KEY ("propertyConditionId") REFERENCES "PropertyCondition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_zoneDemandId_fkey" FOREIGN KEY ("zoneDemandId") REFERENCES "ZoneDemand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_accesibilityId_fkey" FOREIGN KEY ("accesibilityId") REFERENCES "Accesibility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("accesibilityId", "availability", "createdAt", "description", "id", "illuminationId", "price", "propertyConditionId", "propertyId", "propertyRangeId", "propertyTypeId", "providerId", "statusId", "title", "userId", "videoUrl", "zoneDemandId") SELECT "accesibilityId", "availability", "createdAt", "description", "id", "illuminationId", "price", "propertyConditionId", "propertyId", "propertyRangeId", "propertyTypeId", "providerId", "statusId", "title", "userId", "videoUrl", "zoneDemandId" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_propertyId_key" ON "Property"("propertyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PropertyFeature_propertyId_key" ON "PropertyFeature"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyLocation_propertyId_key" ON "PropertyLocation"("propertyId");
