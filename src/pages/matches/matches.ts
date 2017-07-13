import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player';

import _ from 'lodash';

@Component({
    selector: 'page-matches',
    templateUrl: 'matches.html',
    providers: [PlayerService]
})
export class MatchesPage {
    numberOfCourts: number = 2;
    courts: number[] = [];
    selectedPlayers: Player[] = [];
    shuffledPlayers: Player[] = [];
    playersForBench: Player[] = [];

    constructor(public navCtrl: NavController, public events: Events, private playerService: PlayerService) {
        this.events.subscribe('initMatches', () => {
            this.refreshSelectedPlayers();
        });
    }

    ngOnInit() {
        this.refreshSelectedPlayers();
    }

    refreshSelectedPlayers() {
        this.playerService.getAllSelectedPlayers()
            .then(selectedPlayers => this.selectedPlayers = selectedPlayers);
    }

    shuffle() {
        this.shuffledPlayers = this.shuffleArray(this.selectedPlayers.slice(0));

        // create array with numberOfCourts elements to iterate over it with *ngFor
        this.courts = Array.from({length: this.numberOfCourts}, (v, k) => k);
        console.log('courts', this.courts);

        this.playersForBench = this.getPlayersForTheBench();
    }

    getPlayersPerCourt(court) {
        let playersPerCourt = this.shuffledPlayers.slice(court * 4, court === 0 ? 4 : court * 8);

        if (playersPerCourt.length % 2) {
            playersPerCourt.pop();
        }

        return playersPerCourt;
    }

    getPlayersForTheBench() {
        let numberOfBenchPlayers = Math.max(this.selectedPlayers.length - this.numberOfCourts * 4, 0);

        if (this.selectedPlayers.length < this.numberOfCourts * 4) {
            numberOfBenchPlayers += this.selectedPlayers.length % 2;
        }

        let benchPlayers = this.shuffledPlayers.slice(this.selectedPlayers.length - numberOfBenchPlayers);
        _.forEach(benchPlayers, benchPlayer => {
            this.playerService.markPlayerAsBenched(benchPlayer);
            _.forEach(this.selectedPlayers, player => {
                if (_.isEqual(player, benchPlayer)) {
                    player.benched = true;
                }
            })
        });

        return benchPlayers;
    }

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}