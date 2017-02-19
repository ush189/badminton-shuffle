import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable()
export class PlayerService {

    constructor() {
    }

    getAllPlayers(): Promise<Player[]> {
        let allPlayers = localStorage['players'] || '[]';

        return Promise.resolve(JSON.parse(allPlayers));
    }

    getAllSelectedPlayers(): Promise<Player[]> {
        return this.getAllPlayers()
            .then(allPlayers => {
                return allPlayers.filter(player => player.selected);
            })
    }

    addPlayer(player: Player): void {
        this.getAllPlayers().then(allPlayers => {
            allPlayers.push(player);
            localStorage.setItem('players', JSON.stringify(allPlayers));
        })
    }

    updatePlayers(players): void {
        localStorage['players'] = JSON.stringify(players);
    }
}
