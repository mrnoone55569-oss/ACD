const K_FACTOR = 32;

export const calculateExpectedScore = (playerRating: number, opponentRating: number): number => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

export const calculateEloChange = (
  playerRating: number,
  opponentRating: number,
  playerWon: boolean,
  kFactor: number = K_FACTOR
): number => {
  const expectedScore = calculateExpectedScore(playerRating, opponentRating);
  const actualScore = playerWon ? 1 : 0;
  return Math.round(kFactor * (actualScore - expectedScore));
};

export const getEloRank = (elo: number): string => {
  if (elo < 1200) return 'Bronze';
  if (elo < 1400) return 'Silver';
  if (elo < 1600) return 'Gold';
  if (elo < 1800) return 'Platinum';
  if (elo < 2000) return 'Diamond';
  if (elo < 2400) return 'Master';
  return 'Combat Grandmaster';
};

export const getRankColor = (elo: number): string => {
  if (elo < 1200) return '#CD7F32';
  if (elo < 1400) return '#C0C0C0';
  if (elo < 1600) return '#FFD700';
  if (elo < 1800) return '#E5E4E2';
  if (elo < 2000) return '#B9F2FF';
  if (elo < 2400) return '#9D4EDD';
  return '#FF006E';
};

export const calculateMultiPlayerEloChanges = (
  placements: Array<{ playerId: string; elo: number; placement: number }>
): Array<{ playerId: string; eloChange: number }> => {
  const changes: Array<{ playerId: string; eloChange: number }> = [];

  for (let i = 0; i < placements.length; i++) {
    let totalChange = 0;

    for (let j = 0; j < placements.length; j++) {
      if (i !== j) {
        const playerWon = placements[i].placement < placements[j].placement;
        const change = calculateEloChange(
          placements[i].elo,
          placements[j].elo,
          playerWon,
          K_FACTOR / Math.max(1, placements.length - 1)
        );
        totalChange += change;
      }
    }

    changes.push({
      playerId: placements[i].playerId,
      eloChange: totalChange
    });
  }

  return changes;
};
