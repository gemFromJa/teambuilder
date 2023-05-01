import { IPlayer } from "@/types";
import weights from "@/utils/weights.json";

const weightNames = Object.keys(weights);

export function updateCaptains(
    players: IPlayer[],
    assignments: number[],
    numTeams: number
) {
    const newCaptains = [];

    for (let i = 0; i < numTeams; i++) {
        const teamPlayers = players.filter(
            (_, index) => assignments[index] === i
        );
        const teamSize = teamPlayers.length;

        if (teamSize > 0) {
            // most average player on the team
            const centroid = teamPlayers
                .reduce(
                    (sum, player) =>
                        sum.map(
                            (val: number, idx: number) =>
                                val +
                                (player?.[
                                    weightNames[idx] as keyof typeof weights
                                ] || 0)
                        ),

                    Array(weightNames.length).fill(0)
                )
                .map((val) => val / teamSize);

            newCaptains.push({
                name: "",
                ...centroid.reduce(
                    (res, curr, idx) => ({ ...res, [weightNames[idx]]: curr }),
                    {}
                ),
            } as IPlayer);
        } else {
            newCaptains.push(
                players[Math.floor(Math.random() * players.length)]
            );
            // add a random captain
        }
    }

    return newCaptains;
}
