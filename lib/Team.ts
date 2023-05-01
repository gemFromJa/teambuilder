import Player from "./Player";

export default class Team {
    constructor(public players: Player[] = []) {}

    addPlayer(player: Player) {
        this.players.push(player);
    }

    teamScore() {
        return this.players.reduce(
            (sum, player) => sum + player.getScore(),
            // player.attacking +
            // player.defending +
            // player.size +
            // player.skill,
            0
        );
    }

    getPlayers() {
        return this.players;
    }
}
