import React, { useContext, useEffect, useState } from "react";
import { Color, IPlayer, ITeam } from "@/types";
import { ColorPreview } from "./teams";
import { AppContext } from "@/store";
import Image from "next/image";
import clsx from "clsx";

export default function Roster({ onBack }: { onBack: () => void }) {
    const {
        team: { teams, assignTeams },
        playersState: { players },
    } = useContext(AppContext);
    const [selectedTeam, setSelectedTeam] = useState(0);

    const team1 = teams[selectedTeam];
    const team2 = teams[(selectedTeam + 1) % teams.length];

    useEffect(() => {
        assignTeams(players);
    }, []);

    return (
        <div className="h-full flex-col flex">
            <div className="flex justify-between mb-2">
                <button onClick={onBack} className="text-dark-gray flex">
                    <Image
                        src={"/images/left.png"}
                        width={24}
                        height={24}
                        alt="back"
                    />
                    <span className="ml-1 self-center">Back</span>
                </button>
                {/* <Dropdown /> */}
                <TeamDropdown
                    teams={teams}
                    selectedTeam={selectedTeam}
                    onSelect={setSelectedTeam}
                />
                <button
                    onClick={() => {}}
                    disabled
                    className="text-button-gray"
                >
                    Done
                </button>
            </div>

            <div className="flex-grow w-[100%] max-w-[800px] my-3 bg-white">
                <section className="mb-4 h-[100vh] w-[100%] bg-field-color">
                    <main className="h-[100%] py-6 px-4">
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
                            <div key={`team_${i}`} className="text-base">
                                <b className={"capitalize mr-1"}>
                                    {team.name}:
                                </b>

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
        .sort((a, b) => a.defending - b.defending);

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

    const deselectPlayer = () => {
        setSelectedPlayer([]);
    };

    const generateTeamsWithSwap = (
        fromPlayer: number,
        fromTeam: number,
        toPlayer: number,
        toTeam: number
    ): ITeam[] => {
        const _teams = [...teams];

        let player1 = _teams[fromTeam].players[fromPlayer];

        _teams[fromTeam].players[fromPlayer] = _teams[toTeam].players[toPlayer];

        _teams[toTeam].players[toPlayer] = player1;

        return _teams;
    };

    const onSelectPlayer = (row: number, playerIndex: number) => {
        const [selectedTeamIndex, selectedPlayerIndex] = selectedPlayer;

        if (
            teamIndex === selectedTeamIndex &&
            playerIndex === selectedPlayerIndex
        ) {
            // reset swap
            deselectPlayer();
        } else if (selectedPlayer.length === 2) {
            setTeams(
                generateTeamsWithSwap(
                    selectedPlayerIndex,
                    selectedTeamIndex,
                    playerIndex,
                    teamIndex
                )
            );
            deselectPlayer();
        } else {
            setSelectedPlayer([teamIndex, playerIndex]);
        }
    };

    if (!team.length) {
        return <></>;
    }

    const KeeperRow = () => {
        return !keeper ? (
            <></>
        ) : (
            <PlayersRow
                players={keeper}
                height={keeperHeight}
                color={color}
                teamIndex={teamIndex}
                onSelectPlayer={() => onSelectPlayer(0, keeper[0].index)}
            />
        );
    };
    const showKeeperTop = reverse === false;
    const showKeeperBottom = !showKeeperTop;

    return (
        <>
            {showKeeperTop ? <KeeperRow /> : null}
            {teamFormation.map((playerRow, i) => {
                return (
                    <PlayersRow
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
            {showKeeperBottom ? <KeeperRow /> : null}
        </>
    );
};

const PlayersRow = ({
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
                            key={`p_half__${idx}`}
                            style={{
                                width: `${Math.floor(
                                    100 / (players.length || 1)
                                )}%`,
                            }}
                            className="inline-flex items-center justify-center my-0 mx-auto"
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
                                    src={`/plain_shirt_${color}.svg`}
                                    alt="shirt"
                                    width={32}
                                    height={24}
                                    className="mx-auto my-0 cursor-pointer h-[24px] w-[28px] sm:h-[48px] sm:w-[22px]"
                                />
                                <div className="text-center capitalize mt-1 text-white text-xs sm:text-base">
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

const TeamDropdown = ({
    teams,
    selectedTeam,
    onSelect,
}: {
    teams: ITeam[];
    onSelect: (team: number) => void;
    selectedTeam: number;
}) => {
    console.log(selectedTeam);
    const [open, setOpen] = useState(false);
    return (
        <div
            className={clsx(
                `cursor-pointer flex items-center gap-3 relative`
                // open ? styles.open : styles.closed
            )}
            onClick={() => setOpen(!open)}
        >
            <div className="h-full flex gap-3 items-center border-b-2 px-3 py-2 cursor-pointer">
                <label className={`cursor-pointer block text-sm leading-none`}>
                    {teams[selectedTeam].name ?? "Team"}
                </label>
                <Image
                    src={"/images/down.png"}
                    alt="down arrow"
                    width={12}
                    height={12}
                />
            </div>
            <div
                className={`absolute top-[100%] w-full left-0 mt-1 bg-white shadow-lg z-20 ${
                    open ? "block" : "hidden"
                }`}
            >
                {teams.map(({ name }, key) => (
                    <div
                        key={`color_${key}`}
                        onClick={() => onSelect(key)}
                        className={`w-full px-3 py-2 hover:bg-button-gray`}
                    >
                        <span className="t">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
