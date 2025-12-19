-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarId" VARCHAR(80) DEFAULT 'default-avatarId',
ADD COLUMN     "avatarUrl" TEXT DEFAULT 'default-avatar.png';
