-- CreateTable
CREATE TABLE "WaitTimeReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WaitTime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emergencyDepartment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waitTimeMinutes" INTEGER NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "WaitTime_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "WaitTimeReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
