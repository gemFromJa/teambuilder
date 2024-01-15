import { Color, IPlayer, ITeam, colors } from "@/types";
import { randomInt } from "@/utils/numbers";
import { useState } from "react";

export default function TeamState() {
    const [teams, setTeams] = useState<ITeam[]>([
        { name: "Team 1", color: colors[0], players: [] },
        { name: "Team 2", color: colors[1], players: [] },
    ]);

    const addTeam = (name: string, color: Color) => {
        setTeams((teams) => [...teams, { name, color, players: [] }]);
    };

    const addPlayerToTeam = (i: number, player: IPlayer) => {
        setTeams((teams) => {
            const team = teams[i];
            team.players.push(player);

            return teams;
        });
    };

    const assignTeams = (players: IPlayer[]) => {
        const _players = [...players];
        let teamIndex = 0;
        const resultingTeams: IPlayer[][] = Array(teams.length)
            .fill(null)
            .map(() => []);
        // generate teams
        players.forEach(() => {
            const lastIndex = _players.length - 1;
            const [player] = _players.splice(randomInt(0, lastIndex), 1);
            console.log(_players, lastIndex, player);

            resultingTeams[teamIndex].push(player);
            teamIndex = (teamIndex + 1) % teams.length;
        });

        setTeams(
            resultingTeams.map((team, i) => {
                return {
                    ...teams[i],
                    players: team,
                };
            })
        );
    };

    return {
        teams,
        addTeam,
        assignTeams,
        setTeams,
        addPlayerToTeam,
    };
}
