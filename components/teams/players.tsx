import React from "react";
import { IPlayer } from "@/types";

const labels = "(player name, skill level, attacking , defending, size )";
export default function Players({
    players,
    setPlayers,
}: {
    players: string;
    setPlayers: (e: string) => void;
}) {
    return (
        <div>
            <h3 className="text-lg font-semibold">
                Players
                <small className="ml-1">{players.length ? labels : null}</small>
            </h3>
            <small>
                <p>Ratings are: 1 - below average 2 - average 3 - real good</p>
            </small>
            <textarea
                placeholder={labels}
                className="block border-2 rounded resize-none w-[100%] min-h-[300px] px-2 py-1"
                value={players}
                onChange={(e) => {
                    setPlayers(e.target.value);

                    // let lines = e.target.value.split("\n").filter((val) => !!val);
                    // setPlayers(
                    //     lines.map((player) => {
                    //         const [name, skill, attacking, defending, size] =
                    //             player.split(",");
                    //         return {
                    //             name,
                    //             skill: Number(skill) || 0,
                    //             attacking: Number(attacking),
                    //             defending: Number(defending),
                    //             size: Number(size) || 0,
                    //         };
                    //     })
                    // );
                }}
            />
            <div className="text-sm mt-2 mb-4">
                {players.split("\n").filter((v) => !!v).length} added
            </div>
        </div>
    );
}
