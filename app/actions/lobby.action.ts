"use server";

import { prisma } from '../../lib/prisma';

export async function getLobbyList() {
  return prisma.lobby.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function getLobbyById(lobbyId: string) {
  return prisma.lobby.findUnique({
    where: { id: lobbyId },
  });
} 