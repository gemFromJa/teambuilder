import Page from "@/components/misc/page";
import Players from "@/components/teams/players";
import Roseter from "@/components/teams/roster";
import Teams, { Button } from "@/components/teams/teams";
import Player from "@/lib/Player";
import Team from "@/lib/Team";
import assignPlayersToTeams, {
    assignPlayersToTeamsRandom,
} from "@/lib/generateTeams";
import { normalizeNumericalPlayers } from "@/lib/normalizePlayers";
import { colors, IPlayer as IPlayer, ITeam as ITeam } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const TEAM = 0,
    ROSTER = 1;

const testData = [
    [
        {
            name: "tom",
            attacking: 4,
            defending: 3,
            skill: 4,
            size: 4,
        },
        {
            name: "tomioka",
            attacking: 4,
            defending: 3,
            skill: 4,
            size: 4,
        },
    ],
    [
        {
            name: "tim",
            attacking: 4,
            defending: 3,
            skill: 4,
            size: 4,
        },
        {
            name: "timbo",
            attacking: 4,
            defending: 3,
            skill: 4,
            size: 4,
        },
    ],
];
export default function Home() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [teams, setTeams] = useState<ITeam[]>([
        { name: "Team 1", color: colors[0] },
        { name: "Team 2", color: colors[1] },
    ]);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [text, setText] = useState<string>("");
    const [randomTeams, setRandomTeams] = useState(true);
    const [clickCount, setClickCount] = useState(0);
    const [screen, setScreen] = useState(0);
    const [resultingTeam, setResultingTeam] = useState<Team[]>([]);

    // const team = testTeam.sort(() => Math.random() - 0.3);
    // console.log("Yasso", team.slice(0, 6));
    // let nTeam = assignPlayersToTeams(
    //     normalizePlayers(team.slice(0, 6) as UIPlayer[]),
    //     2
    // );
    // console.log("Ceated Teams", nTeam);
    // console.log(
    //     "Ceated scores",
    //     nTeam.map((t) => t.teamScore())
    // );
    // console.log(
    //     "Ceated Teams scored",
    //     nTeam.map((team) => team.players.map((p) => p.getScore()).join(", "))
    // );

    const generateTeam = () => {
        const lines = text.split("\n").filter((val) => !!val);
        let _players = normalizeNumericalPlayers(
            lines.map((player) => {
                const [name, skill, attacking, defending, size] =
                    player.split(",");
                return new Player(
                    name,
                    Number(size) || 1,
                    Number(skill) || 1,
                    Number(attacking) || 1,
                    Number(defending) || 1
                );
            })
        );

        // calculate and populate teams based on scored
        let resultantTeams = randomTeams
            ? assignPlayersToTeamsRandom(_players, teams.length)
            : assignPlayersToTeams(_players, teams.length);

        setResultingTeam(resultantTeams);

        sectionRef.current?.scrollIntoView();
    };
    return (
        <Page>
            <Head>
                <title>Create Your Teams</title>
            </Head>
            <div className="max-w-[800px] mx-auto bg-white px-4 py-6">
                <div className="mb-5">
                    <Teams teams={teams} setTeams={setTeams} />
                    <div className="mt-6" />
                    <Players players={text} setPlayers={setText} />

                    <label className="cursor-pointer">
                        <input
                            type={"checkbox"}
                            checked={randomTeams}
                            onChange={() => {
                                setRandomTeams(!randomTeams);
                            }}
                        />
                        <span className="ml-2 mt-3">Random Teams</span>
                    </label>
                </div>
                <div className="flex items-center justify-center">
                    <Button
                        // disabled={players.length < teams.length}
                        className={`bg-[#0c6eb9] text-white border-0`}
                        onClick={generateTeam}
                        text={screen === TEAM ? "Generate" : "Regenerate"}
                    />
                </div>

                <div ref={sectionRef} className="mt-[4rem]">
                    <Roseter
                        teams={teams}
                        players={resultingTeam}
                        onRefresh={() => {
                            if (screen === TEAM) generateTeam();
                        }}
                    />
                </div>
            </div>
        </Page>
    );
}
