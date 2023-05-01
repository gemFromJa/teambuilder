export type Options = "good" | "bad" | "average";
export type SizeOptions = "big" | "med" | "small";
export interface UIPlayer {
    name: string;
    size: SizeOptions;
    skill: Options;
    attacking: Options;
    defending: Options;
}
export interface IPlayer {
    name: string;
    size: number;
    skill: number;
    attacking: number;
    defending: number;
}

export const colors = [
    "black",
    "white",
    "red",
    "blue",
    "yellow",
    "green",
] as const;

export type Color = (typeof colors)[number];

export interface ITeam {
    name: string;
    color?: Color;
}
