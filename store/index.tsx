import React, { createContext } from "react";
import TeamState from "./teams";
import stateTypes from "@/types/context";
import PlayersState from "./players";
import EditorState from "./editor";

export const AppContext = createContext<{
    team: stateTypes.TeamState;
    playersState: stateTypes.PlayerState;
    editorState: stateTypes.EditorState;
}>({} as any);

export default function AppState({ children }: { children: React.ReactNode }) {
    const teamState = TeamState();
    const playersState = PlayersState();
    const editorState = EditorState();

    return (
        <AppContext.Provider
            value={{ team: teamState, playersState, editorState }}
        >
            {children}
        </AppContext.Provider>
    );
}
