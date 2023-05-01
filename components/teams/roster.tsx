import React, { useEffect } from "react";
import { Color, IPlayer, ITeam } from "@/types";
import { ColorPreview } from "./teams";
import Team from "@/lib/Team";

export default function Roseter({
    teams,
    players,
    onRefresh,
}: {
    teams: ITeam[];
    players: Team[];
    onRefresh: () => void;
}) {
    // useEffect(() => {
    //     if (clickCount > 0) {
    //     }
    // }, [clickCount]);

    return (
        <div>
            <h3 className="text-lg bold text-center my-5 color-[#54595d]">
                The resultant teams
                <img
                    onClick={onRefresh}
                    src="/images/refresh.png"
                    alt="refresh"
                    className="inline-block cursor-pointer ml-[4%] h-[24px] w-[24px]"
                />
            </h3>
            {Array(Math.ceil(teams.length / 2))
                .fill(null)
                .map((_, i) => (
                    <div
                        className="min-h-[100%] w-[100%] max-w-[800px] mx-auto px-[20px] py-3 bg-white"
                        key={`field_${i}`}
                    >
                        <section className="mb-4 w-[100%] max-w-[752px] bg-field-color">
                            <main className="h-[880px] p-10">
                                <Half
                                    teamName={teams?.[2 * i]}
                                    players={players?.[2 * i]
                                        ?.getPlayers()
                                        ?.slice(0, 11)}
                                />
                                <Half
                                    teamName={teams?.[2 * i + 1]}
                                    secondHalf={true}
                                    players={players?.[2 * i + 1]
                                        ?.getPlayers()
                                        ?.slice(0, 11)}
                                    // rr={`rotate-[180deg] `}
                                    // jj={`border-bottom-2`}
                                />
                            </main>
                        </section>

                        <div>
                            {players.slice(2 * i, 2 * i + 2).map((team, i) => {
                                return (
                                    <div key={`team_${i}`}>
                                        <b className={"capitalize"}>
                                            {teams[i].name}
                                        </b>
                                        :{" "}
                                        <span>
                                            {team
                                                .getPlayers()
                                                .reduce(
                                                    (sum, player) =>
                                                        `${sum}${
                                                            sum ? ", " : ""
                                                        }${player?.name}`,
                                                    ""
                                                )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
        </div>
    );
}
const TeamLayout = ({
    team,
    reverse = false,
    color,
}: {
    team: IPlayer[];
    reverse?: boolean;
    color: Color;
}) => {
    // sort array most defensive first
    let sortedTeam = [...team].sort((a, b) => a.defending - b.defending);

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

    // clump array into groups
    let renderArray = [];

    // total bank of players ( attack, midfield, defense )
    let totalOutfieldGroups = Math.ceil(totalOutfieldplayers / 4);

    for (let i = 0; i <= totalOutfieldGroups; i++) {
        let res = sortedTeam.splice(0, 4);
        if (res.length) {
            renderArray.push(res);
        }
    }

    if (reverse) {
        renderArray.reverse();
    }

    const KeeperSegment = ({ reverse }: { reverse: boolean }) => {
        return reverse || !keeper ? (
            <></>
        ) : (
            <Segment players={keeper} height={keeperHeight} color={color} />
        );
    };

    if (!team.length) {
        return <></>;
    }

    return (
        <>
            <KeeperSegment reverse={reverse === true} />
            {renderArray.map((playerRow, i) => {
                return (
                    <Segment
                        key={`player_row${i}`}
                        color={color}
                        height={`${rowHeight}%`}
                        players={playerRow}
                    />
                );
            })}
            <KeeperSegment reverse={reverse != true} />
        </>
    );
};

const Segment = ({
    players,
    height,
    color,
}: {
    players: IPlayer[];
    height: string;
    color: Color;
}) => {
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
                            className={`inline-block my-0 mx-auto`}
                        >
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
                            </div>
                            <div className="text-center capitalize mt-1 text-white">
                                {player.name}
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
}: {
    teamName: ITeam;
    players: IPlayer[];
    secondHalf?: boolean;
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
                        />
                    ) : null}
                </span>
            </div>
            {secondHalf && <TeamName />}
        </div>
    );
};
