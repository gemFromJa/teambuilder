import React, { useCallback, useContext, useRef, useState } from "react";
import { IPlayer } from "@/types";
import { AppContext } from "@/store";

type Timer = ReturnType<typeof setTimeout>;

function calculatePlayers(text: string): IPlayer[] {
    let textPlayers = text.split("\n").filter((val) => val);
    return textPlayers.map((player, i) => {
        const [name, skill, attacking, defending, size] = player.split(",");
        return {
            name,
            skill: Number(skill) || 0,
            attacking: Number(attacking) || 0,
            defending: Number(defending) || 0,
            size: Number(size) || 0,
        };
    });
}

function playersTostring(players: IPlayer[]): string {
    const playerToString = (player: IPlayer) =>
        `${player.name},${player.skill},${player.attacking},${player.defending},${player.size}`;
    return players.reduce(
        (result, curr) => `${result}${playerToString(curr)}\n`,
        ""
    );
}

const labels = "(player name, skill level, attacking , defending, size )";

export default function Players() {
    const ref = useRef<Timer>();
    const {
        playersState: { players, setPlayers },
    } = useContext(AppContext);
    const [text, setText] = useState(() => playersTostring(players || []));
    const delayedSetPlayers = useCallback((text: string) => {
        if (ref.current) clearTimeout(ref.current);

        ref.current = setTimeout(() => {
            setPlayers(calculatePlayers(text));
        }, 1000);
    }, []);

    return (
        <div>
            <h3 className="text-xl mb-1 font-semibold">
                Players
                <small className="ml-1"></small>
            </h3>
            <p className="mb-4 text-xs">
                Ratings are: 1 - below average 2 - average 3 - real good
            </p>
            <textarea
                placeholder={labels}
                className="block border-2 rounded resize-none w-[100%] min-h-[300px] px-2 py-1 placeholder:text-sm"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);

                    delayedSetPlayers(e.target.value);
                }}
            />
            <div className="text-sm mt-2 mb-4">
                {text.split("\n").filter((v) => !!v).length} added
            </div>
        </div>
    );
}
