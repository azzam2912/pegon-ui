-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "collector" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "documentType" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "locationWritten" TEXT,
    "yearWritten" INTEGER,
    "ink" TEXT,
    "illumination" TEXT,
    "description" TEXT,
    "fileUrl" TEXT,
    "thumbnailUrl" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Documents" ("author", "collector", "createdAt", "description", "documentType", "fileUrl", "id", "illumination", "ink", "language", "locationWritten", "thumbnailUrl", "title", "updatedAt", "userId", "yearWritten") SELECT "author", "collector", "createdAt", "description", "documentType", "fileUrl", "id", "illumination", "ink", "language", "locationWritten", "thumbnailUrl", "title", "updatedAt", "userId", "yearWritten" FROM "Documents";
DROP TABLE "Documents";
ALTER TABLE "new_Documents" RENAME TO "Documents";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
