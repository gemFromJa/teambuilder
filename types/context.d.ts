import EditorStateData from "@/store/editor";
import { IPlayer, ITeam } from ".";
import TeamStateData from "@/store/teams";
import PlayersStateData from "@/store/players";

export type TeamState = ReturnType<typeof TeamStateData>;

export type PlayerState = ReturnType<typeof PlayersStateData>;

export type EditorState = ReturnType<typeof EditorStateData>;
