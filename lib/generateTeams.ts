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
