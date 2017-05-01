import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Player } from '../models/player';

import 'rxjs/add/operator/toPromise';
import _ from 'lodash';

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

    loadFromGoogleDocs(): void {
        // TODO loading animation
        this.http.get('https://fetch-badminton-data.herokuapp.com/badminton')
            .toPromise()
            .then(function(res: Response) {
                let data = res.json();

                let players = parsePlayers(data);
                // TODO process result
            })
            .catch(function(error) {
                console.log(error);
            });

        function parsePlayers(data) {
            let rows = [];

            _.forEach(data.feed.entry, function(entry) {
                if (!_.isArray(rows[entry['gs$cell']['row']])) {
                    rows[entry['gs$cell']['row']] = [];
                }
                rows[entry['gs$cell']['row']].push(entry);
            });

            let prettyRows = _.map(rows, function(row) {
                let result = <any>{};

                _.forEach(row, function(entry) {
                    switch (entry['gs$cell']['col']) {
                        case '2':
                            result.firstName = entry['content']['$t'];
                            break;
                        case '3':
                            result.lastName = entry['content']['$t'];
                            break;
                        case '4':
                            result.isActive = true;
                            break;
                        case '9':
                            result.isPlayer = true;
                            break;
                    }
                });

                return result;
            });

            return _.pickBy(prettyRows, 'isPlayer');
        }
    }
}