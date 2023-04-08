/*
  Warnings:

  - You are about to alter the column `historic` on the `User` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - Added the required column `beginDate` to the `Process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course` to the `Process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scholarships` to the `Process` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vacancys` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Process` ADD COLUMN `beginDate` DATETIME(3) NOT NULL,
    ADD COLUMN `course` VARCHAR(191) NOT NULL,
    ADD COLUMN `creatorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `scholarships` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'Aberto',
    ADD COLUMN `vacancys` INTEGER NOT NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `historic` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserProcess` ADD COLUMN `scholarAccept` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `vacancyAccept` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Process` ADD CONSTRAINT `Process_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
