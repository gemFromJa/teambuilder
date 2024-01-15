import AddTeamPage from "@/components/AddTeamPage";
import Roster from "@/components/teams/roster";
import Head from "next/head";
import { useState } from "react";

const SCREEN_TEAM = 0,
    SCREEN_PLAYERS = 1;

export default function Game() {
    const [screen, setScreen] = useState(0);

    return (
        <>
            <Head>
                <title>SMnr - Create Teamsheet</title>
            </Head>
            <div className={`max-w-[800px]  mx-auto bg-white px-4 py-6`}>
                {screen === SCREEN_TEAM ? (
                    <AddTeamPage
                        onClick={() => {
                            setScreen(SCREEN_PLAYERS);
                        }}
                    />
                ) : (
                    <Roster onBack={() => setScreen(SCREEN_TEAM)} />
                )}
            </div>
        </>
    );
}
