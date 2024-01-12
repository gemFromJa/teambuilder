import { Color, IPlayer, ITeam, colors } from "@/types";
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

    return {
        teams,
        addTeam,
        setTeams,
        addPlayerToTeam,
    };
}
