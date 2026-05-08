-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photo" TEXT,
    "biography" TEXT,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSpeaker" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,

    CONSTRAINT "SessionSpeaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeakerLink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "speakerId" TEXT NOT NULL,

    CONSTRAINT "SpeakerLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSpeaker_sessionId_speakerId_key" ON "SessionSpeaker"("sessionId", "speakerId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSpeaker" ADD CONSTRAINT "SessionSpeaker_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSpeaker" ADD CONSTRAINT "SessionSpeaker_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakerLink" ADD CONSTRAINT "SpeakerLink_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Speaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
