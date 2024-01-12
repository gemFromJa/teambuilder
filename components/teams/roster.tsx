import React, { useContext, useEffect, useState } from "react";
import { Color, IPlayer, ITeam } from "@/types";
import { ColorPreview } from "./teams";
import { AppContext } from "@/store";
import Image from "next/image";

export default function Roster({ onBack }: { onBack: () => void }) {
    const {
        team: { teams, setTeams },
        playersState: { players },
    } = useContext(AppContext);
    const [selectedTeam, setSelectedTeam] = useState(0);

    const team1 = teams[selectedTeam];
    const team2 = teams[selectedTeam + 1];

    useEffect(() => {
        let team = 0;
        const pTeams: IPlayer[][] = Array(teams.length)
            .fill(null)
            .map(() => []);
        // generate teams
        players.forEach((_, id) => {
            pTeams[team].push(players[id]);
            team = (team + 1) % teams.length;
        });

        setTeams(
            pTeams.map((team, i) => {
                return {
                    ...teams[i],
                    players: team,
                };
            })
        );
    }, []);

    return (
        <div className="h-full flex-col flex">
            <div className="flex justify-between">
                <button onClick={onBack} className="">
                    Back
                </button>
                {/* <Dropdown /> */}
                <select>
                    {teams.map((team, i) => (
                        <option key={i} onClick={() => setSelectedTeam(i)}>
                            {team.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => {}} disabled>
                    done
                </button>
            </div>

            <div className="flex-grow min-h-[60%] w-[100%] max-w-[800px] my-3 bg-white">
                <section className="mb-4 h-[100%] w-[100%] max-w-[752px] bg-field-color">
                    <main className="h-[100%] py-10 px-4">
                        <Half
                            teamName={team1}
                            players={team1.players}
                            teamIndex={selectedTeam}
                        />
                        <Half
                            teamName={team2}
                            secondHalf={true}
                            players={team2?.players || []}
                            teamIndex={selectedTeam + 1}
                        />
                    </main>
                </section>

                <div>
                    {teams.map((team, i) => {
                        return (
                            <div key={`team_${i}`}>
                                <b className={"capitalize"}>{team.name}</b>:
                                <span>
                                    {team.players.reduce(
                                        (sum, player) =>
                                            `${sum}${sum ? ", " : ""}${
                                                player?.name
                                            }`,
                                        ""
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
const TeamLayout = ({
    team,
    reverse = false,
    color,
    teamIndex,
}: {
    team: IPlayer[];
    reverse?: boolean;
    color: Color;
    teamIndex: number;
}) => {
    const {
        editorState: { setSelectedPlayer, selectedPlayer },
        team: { teams, setTeams },
    } = useContext(AppContext);
    // sort array most defensive first
    let sortedTeam = team
        .map((player, i) => ({ ...player, index: i }))
        ./* [...team]. */ sort((a, b) => a.defending - b.defending);

    if (reverse) {
        sortedTeam.reverse();
    }

    // goalkeeper
    let keeper = sortedTeam.splice(0, 1);
    // center of field if only player on team
    const keeperHeight = !!sortedTeam.length ? "25%" : "100%";

    const totalOutfieldplayers = sortedTeam.length;

    // outfield players config
    // depends on how many banks of 4 we need
    const rowHeight = Math.floor(
        (100 - 25) / Math.max(1, Math.ceil(totalOutfieldplayers / 4))
    );

    // clump array into groups where each group is a visual row
    let teamFormation: (IPlayer & { index: number })[][] = [];

    // total bank of players ( attack, midfield, defense )
    const PERSON_PER_ROW = 4;
    let totalOutfieldGroups = Math.ceil(totalOutfieldplayers / PERSON_PER_ROW);

    for (let i = 0; i <= totalOutfieldGroups; i++) {
        let playerLine = sortedTeam.splice(0, PERSON_PER_ROW);
        if (playerLine.length) {
            teamFormation.push(playerLine);
        }
    }

    if (reverse) {
        teamFormation.reverse();
    }

    const onSelectPlayer = (row: number, player: number) => {
        const _teams = [...teams];

        const [selectedTeamIndex, selectedPlayerIndex] = selectedPlayer;
        const playerIndex = PERSON_PER_ROW * row + player;

        if (
            teamIndex === selectedTeamIndex &&
            playerIndex === selectedPlayerIndex
        ) {
            setSelectedPlayer([]);
        } else if (selectedPlayer.length === 2) {
            // switch player
            let temp = _teams[selectedTeamIndex].players[selectedPlayerIndex];

            _teams[selectedTeamIndex].players[selectedPlayerIndex] =
                _teams[teamIndex].players[playerIndex];
            _teams[teamIndex].players[playerIndex] = temp;

            setTeams(_teams);
            setSelectedPlayer([]);
        } else {
            setSelectedPlayer([teamIndex, playerIndex]);
        }
    };

    if (!team.length) {
        return <></>;
    }

    const KeeperSegment = ({ hidden }: { hidden: boolean }) => {
        return hidden || !keeper ? (
            <></>
        ) : (
            <Segment
                players={keeper}
                height={keeperHeight}
                color={color}
                teamIndex={teamIndex}
                onSelectPlayer={() => onSelectPlayer(0, keeper[0].index)}
            />
        );
    };

    return (
        <>
            <KeeperSegment hidden={reverse === true} />
            {teamFormation.map((playerRow, i) => {
                return (
                    <Segment
                        key={`player_row_${i}`}
                        color={color}
                        height={`${rowHeight}%`}
                        players={playerRow}
                        onSelectPlayer={(index: number) =>
                            onSelectPlayer(i, index)
                        }
                        teamIndex={teamIndex}
                    />
                );
            })}
            <KeeperSegment hidden={reverse != true} />
        </>
    );
};

const Segment = ({
    players,
    height,
    color,
    teamIndex,
    onSelectPlayer,
}: {
    players: (IPlayer & { index: number })[];
    height: string;
    color: Color;
    teamIndex: number;
    onSelectPlayer: (i: number) => void;
}) => {
    const {
        editorState: { selectedPlayer },
    } = useContext(AppContext);
    const isSelecting = selectedPlayer.length === 2;
    const isCurrentSelectedPlayer = (playerIndex: number) =>
        selectedPlayer.length === 2 &&
        teamIndex === selectedPlayer[0] &&
        playerIndex === selectedPlayer[1];

    return (
        <div style={{ height: height }} className={`w-[100%]  relative`}>
            <div className="absolute top-[50%] translate-y-[-50%] w-[100%]">
                {players?.map((player, idx) => {
                    return (
                        <div
                            key={`half__${idx}`}
                            style={{
                                width: `${Math.floor(
                                    100 / (players.length || 1)
                                )}%`,
                            }}
                            className="flex items-center justify-center"
                        >
                            <div
                                className={`inline-block flex-grow-0 my-0 mx-auto ${
                                    isSelecting &&
                                    isCurrentSelectedPlayer(player.index) ===
                                        false
                                        ? "opacity-50"
                                        : "opacity-100"
                                }`}
                                onClick={() => onSelectPlayer(player.index)}
                            >
                                <Image
                                    src={"/plain_shirt.svg"}
                                    alt="shirt"
                                    width={42}
                                    height={32}
                                    className="mx-auto my-0 cursor-pointer"
                                />
                                {/* ) ||
                            <div
                                style={{
                                    background: color,
                                }}
                                className={`rounded-full flex items-center justify-center h-[32px] w-[32px] border-2 border-white mx-auto my-0`}
                            >
                                <div
                                    className={`font-bold ${
                                        color === "white"
                                            ? "text-black"
                                            : "text-white"
                                    }`}
                                >
                                    {idx + 1}
                                </div>
                            </div> */}
                                <div className="text-center capitalize mt-1 text-white">
                                    {player.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const bord = "border border-[rgba(255,255,255,0.3)] border-t-0";
const bordB = "border border-[rgba(255,255,255,0.3)] border-b-0";

const Half = ({
    teamName,
    players,
    secondHalf,
    teamIndex,
}: {
    teamName: ITeam;
    players: IPlayer[];
    secondHalf?: boolean;
    teamIndex: number;
}) => {
    const TeamName = () => (
        <div className="bg-[#0b8449] text-white h-[12%] text-sm p-10px relative">
            <div className="flex gap-3 items-center h-[100%] px-3">
                {!teamName?.color ? (
                    <div />
                ) : (
                    <ColorPreview color={teamName?.color as Color} />
                )}
                <label>{teamName?.name}</label>
            </div>
        </div>
    );

    return (
        <div className={`h-[50%] ${secondHalf ? "" : ""}`}>
            {!secondHalf && <TeamName />}
            <div
                className={`relative h-[88%] border border-[rgba(255,255,255,0.3)] overflow-hidden ${
                    !secondHalf ? "border-b-0 " : "border-b-2"
                }`}
            >
                <div
                    className={`${
                        secondHalf ? bordB : bord
                    } absolute ml-[25%] w-[50%] h-[25%] bg-field-color z-[1] ${
                        secondHalf ? "bottom-0" : ""
                    }`}
                ></div>
                <div
                    className={`${
                        secondHalf ? bordB : bord
                    } absolute w-[20%] h-[10.3%] ml-[40%] z-[2] ${
                        secondHalf ? "bottom-0" : ""
                    }`}
                ></div>
                <div
                    className={`border border-[rgba(255,255,255,0.3)] absolute rounded-[48%] h-[16%] ml-[40%] w-[20%] ${
                        secondHalf ? "bottom-[13.6%]" : "top-[13.6%]"
                    }`}
                ></div>
                <div
                    className={`${
                        secondHalf
                            ? "top-0 border-t-transparent border-r-transparent translate-y-[-50%]"
                            : "bottom-0 border-b-transparent border-l-transparent translate-y-[50%]"
                    } rotate-[-45deg] absolute ml-[40%] w-[20%] h-0 pt-[20%] rounded-[50%] border border-[rgba(255,255,255,0.3)]`}
                ></div>
                <span className="absolute h-[100%] w-[100%] top-0 z-10">
                    {teamName && players?.length ? (
                        <TeamLayout
                            team={players}
                            color={teamName.color as Color}
                            reverse={secondHalf === true}
                            teamIndex={teamIndex}
                        />
                    ) : null}
                </span>
            </div>
            {secondHalf && <TeamName />}
        </div>
    );
};
