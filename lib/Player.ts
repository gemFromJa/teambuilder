import { IPlayer as IPlayer } from "@/types";

export default class Player implements IPlayer {
    constructor(
        public name: string,
        public size: number,
        public skill: number,
        public attacking: number,
        public defending: number
    ) {}

    getScore() {
        return (
            this.skill +
            this.size +
            this.skill +
            this.defending +
            this.attacking
        );
    }
}
