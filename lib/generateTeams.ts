import { IPlayer as IPlayer } from "@/types";
import Team from "./Team";
import Player from "./Player";

export default function assignPlayersToTeams(
    players: Player[],
    numTeams: number
): Team[] {
    const teams: Team[] = Array(numTeams)
        .fill(null)
        .map(() => new Team());
    const sortedPlayers = players.sort(
        (a: Player, b: Player) => b.getScore() - a.getScore()
    );

    sortedPlayers.forEach((player) => {
        // get the current score of all teams
        let teamsScores = teams.map((team) => team.teamScore());

        // find the team with the smallest score
        let teamIndex = teamsScores.indexOf(Math.min(...teamsScores));

        // add player to weakest team
        teams[teamIndex].addPlayer(player);
    });

    return teams;

    // const costMatrix: number[][] = players.map((player: Player) => {
    //     return new Array(numTeams).fill(0).map((_, teamIndex) => {
    //         const cost = Object.keys(weights).reduce((sum, curr) => {
    //             return (
    //                 sum +
    //                 weights[curr as keyof typeof weights] *
    //                     (player?.[curr as keyof typeof weights] || 0)
    //             );
    //         }, 0);

    //         return cost * (teamIndex + 1);
    //     });
    // });

    // const assignments = calculateTeamWeights(costMatrix);
    // console.log("Ourr", assignments);

    // const teams: Team[] = new Array(numTeams).fill(null).map(() => new Team());

    // for (let i = 0; i < assignments.length; i++) {
    //     const teamIndex = assignments[i];
    //     teams[teamIndex]?.addPlayer(players[i]);
    // }

    // return teams;
}

export const assignPlayersToTeamsRandom = (
    players: Player[],
    numTeams: number
): Team[] => {
    const teams: Team[] = Array(numTeams)
        .fill(null)
        .map(() => new Team());
    const sortedPlayers = [...players].sort(
        (a: Player, b: Player) => b.getScore() - a.getScore()
    );

    let randPosition = (sortedPlayers: any[]) =>
        Math.floor(Math.random() * sortedPlayers.length);

    while (sortedPlayers.length) {
        teams.forEach((team) => {
            let pos = randPosition(sortedPlayers);
            let res = sortedPlayers.splice(pos, 1)[0];

            if (res) {
                team.addPlayer(res);
            }
        });
    }

    return teams;
};
