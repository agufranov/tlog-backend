-- CreateTable
CREATE TABLE "rounds" (
    "id" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "winnerId" INTEGER,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round_players" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "taps" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "round_players_pkey" PRIMARY KEY ("roundId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "round_players_id_key" ON "round_players"("id");

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "round_players" ADD CONSTRAINT "round_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
