/*
  Warnings:

  - You are about to drop the column `accesibilityFeatures` on the `Property` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Accesibility" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "zipCode" INTEGER,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "videoUrl" TEXT,
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
    "urlGoogleMaps" TEXT,
    "userId" TEXT NOT NULL,
    "propertyTypeId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "providerId" TEXT,
    "propertyRangeId" INTEGER,
    "illuminationId" INTEGER,
    "propertyConditionId" INTEGER,
    "zoneDemandId" INTEGER,
    "accesibilityId" INTEGER,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PropertyStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyRangeId_fkey" FOREIGN KEY ("propertyRangeId") REFERENCES "PropertyRange" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_illuminationId_fkey" FOREIGN KEY ("illuminationId") REFERENCES "Illumination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyConditionId_fkey" FOREIGN KEY ("propertyConditionId") REFERENCES "PropertyCondition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_zoneDemandId_fkey" FOREIGN KEY ("zoneDemandId") REFERENCES "ZoneDemand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_accesibilityId_fkey" FOREIGN KEY ("accesibilityId") REFERENCES "Accesibility" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("acceptsCreditBank", "acceptsCreditSocial", "address", "age", "balcon", "bathrooms", "bedrooms", "cityId", "connectivity", "constructionM2", "createdAt", "description", "downtown", "furnished", "greenAreas", "halfBathrooms", "id", "illuminationId", "levels", "parking", "pool", "price", "propertyConditionId", "propertyId", "propertyRangeId", "propertyTypeId", "providerId", "statusId", "terrainM2", "title", "urlGoogleMaps", "userId", "zipCode", "zoneDemandId") SELECT "acceptsCreditBank", "acceptsCreditSocial", "address", "age", "balcon", "bathrooms", "bedrooms", "cityId", "connectivity", "constructionM2", "createdAt", "description", "downtown", "furnished", "greenAreas", "halfBathrooms", "id", "illuminationId", "levels", "parking", "pool", "price", "propertyConditionId", "propertyId", "propertyRangeId", "propertyTypeId", "providerId", "statusId", "terrainM2", "title", "urlGoogleMaps", "userId", "zipCode", "zoneDemandId" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE UNIQUE INDEX "Property_propertyId_key" ON "Property"("propertyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
