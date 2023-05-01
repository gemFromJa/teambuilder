import { IPlayer, UIPlayer } from "@/types";
import weights from "@/utils/weights.json";
import Player from "./Player";

const OptionValues = {
    good: 9,
    average: 6,
    bad: 2,
    big: 3,
    med: 2,
    small: 1,
};
type OptionValuesType = typeof OptionValues;

const OptionValueskeys = Object.keys(OptionValues);
const WeightsKeys = Object.keys(weights);

export function normalizePlayers(players: UIPlayer[]): Player[] {
    return players.map((player) => {
        let res = WeightsKeys.reduce(
            (acc, key) => ({
                ...acc,
                [key as keyof UIPlayer]:
                    OptionValues[
                        player[key as keyof UIPlayer] as keyof OptionValuesType
                    ] * weights[key as keyof typeof weights],
            }),
            { name: player.name } as any
        );
        let _player = new Player(
            res.name,
            res.size,
            res.skill,
            res.attacking,
            res.defending
        );
        return _player;
    });
}

export const normalizeNumericalPlayers = (players: IPlayer[]): Player[] => {
    return players.map((player) => {
        let res = WeightsKeys.reduce(
            (acc, key) => ({
                ...acc,
                [key as keyof IPlayer]:
                    (player[key as keyof IPlayer] as number) *
                    weights[key as keyof typeof weights],
            }),
            { name: player.name } as any
        );
        let _player = new Player(
            res.name,
            res.size,
            res.skill,
            res.attacking,
            res.defending
        );
        return _player;
    });
};
