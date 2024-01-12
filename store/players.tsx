import { IPlayer } from "@/types";
import { useState } from "react";

export default function PlayersState() {
    const [players, setPlayers] = useState<IPlayer[]>([]);

    const addPlayer = (player: IPlayer) => {
        setPlayers((teams) => [...teams, player]);
    };

    const getPlayerByIndex = (index: number) => players[index];

    return {
        players,
        addPlayer,
        setPlayers,
        getPlayerByIndex,
    };
}
