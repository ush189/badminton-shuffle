import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Player } from '../models/player';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlayerService {

    constructor(private http: Http) {
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

    loadFromGoogleDocs() {
        this.http.get('https://fetch-badminton-data.herokuapp.com/badminton')
            .toPromise()
            .then(function(data) {
                console.log(data);
            })
            .catch(function(error) {
                console.log(error);
            })
    }
}