import { AppContext } from "@/store";
import React, { useContext } from "react";
import Teams, { Button } from "./teams/teams";
import Players from "./teams/players";

export default function AddTeamPage({ onClick }: { onClick: () => void }) {
    const {
      team: { teams, setTeams },
      playersState: { players },
    } = useContext(AppContext);

    return (
      <div>
        <Teams teams={teams} setTeams={setTeams} />
        <div className="my-8 w-full border-b border-gray-100"></div>
        <Players />
        <div className="mt-8 flex items-center justify-between flex-wrap">
          <div className="text-sm mt-2 mb-4">{players.length} added</div>
          <Button
            // disabled={players.length < teams.length}
            className={`bg-field-color text-white border-0 w-full md:w-40 text-sm`}
            onClick={onClick}
            text={"Create Roster"}
          />
        </div>
      </div>
    );
}
