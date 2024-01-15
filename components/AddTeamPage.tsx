import { AppContext } from "@/store";
import React, { useContext } from "react";
import Teams, { Button } from "./teams/teams";
import Players from "./teams/players";

export default function AddTeamPage({ onClick }: { onClick: () => void }) {
    const {
        team: { teams, setTeams },
    } = useContext(AppContext);

    return (
        <div>
            <div className="mb-5">
                <Teams teams={teams} setTeams={setTeams} />
            </div>
            <Players />
            <div className="mt-4 flex items-center justify-center">
                <Button
                    // disabled={players.length < teams.length}
                    className={`bg-[#0c6eb9] text-white border-0`}
                    onClick={onClick}
                    text={"Create Roster"}
                />
            </div>
        </div>
    );
}
