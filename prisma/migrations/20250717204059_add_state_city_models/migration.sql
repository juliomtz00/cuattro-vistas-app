-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "zipCode" INTEGER,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accesibilityFeatures" TEXT,
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
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "PropertyStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Property_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyRangeId_fkey" FOREIGN KEY ("propertyRangeId") REFERENCES "PropertyRange" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_illuminationId_fkey" FOREIGN KEY ("illuminationId") REFERENCES "Illumination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_propertyConditionId_fkey" FOREIGN KEY ("propertyConditionId") REFERENCES "PropertyCondition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_zoneDemandId_fkey" FOREIGN KEY ("zoneDemandId") REFERENCES "ZoneDemand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PropertyStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "State" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PropertyRange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Illumination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PropertyCondition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ZoneDemand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_propertyId_key" ON "Property"("propertyId");
