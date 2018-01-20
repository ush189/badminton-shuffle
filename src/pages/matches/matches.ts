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
    playersPerCourt: Player[][];

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
        this.setPlayersPerCourt();
    }

    setPlayersPerCourt() {
        this.playersPerCourt = [];
        let playersForCourts = this.shuffledPlayers
            .filter(player => !player.isBenchNow);

        if (playersForCourts.length % 4) {
            // rearrange array to move players for one-on-one to the end
            let playersNotOneOnOnedYet = playersForCourts.filter(player => !player.oneOnOne);
            let oneOnOnePlayers = playersNotOneOnOnedYet.splice(playersNotOneOnOnedYet.length - 2);

            if (oneOnOnePlayers.length < 2) {
                let playersOneOnOnedYet = playersForCourts.filter(player => player.oneOnOne);
                oneOnOnePlayers = oneOnOnePlayers.concat(playersOneOnOnedYet.slice(playersOneOnOnedYet.length - (2 - oneOnOnePlayers.length)));

                // reset oneOnOned players
                //this.playerService.resetOneOnOnedPlayers();
                _.forEach(this.selectedPlayers, player => {
                    player.oneOnOne = false;
                });
            }

            playersForCourts = _.difference(playersForCourts, oneOnOnePlayers).concat(oneOnOnePlayers);
        }

        _.forEach(this.courts, court => {
            let playersPerCourt = playersForCourts
                .slice(court * 4, court === 0 ? 4 : court * 8);

            if (playersPerCourt.length === 2) {
                _.forEach(playersPerCourt, oneOnOnePlayer => {
                    this.playerService.markPlayerAsOneOnOned(oneOnOnePlayer);

                    _.forEach(this.selectedPlayers, player => {
                        if (_.isEqual(player, oneOnOnePlayer)) {
                            player.oneOnOne = true;
                        }
                    })
                })
            }

            this.playersPerCourt.push(playersPerCourt);
        });
    }

    getPlayersForTheBench() {
        let numberOfBenchPlayers = Math.max(this.selectedPlayers.length - this.numberOfCourts * 4, 0);

        if (this.selectedPlayers.length < this.numberOfCourts * 4) {
            numberOfBenchPlayers += this.selectedPlayers.length % 2;
        }

        let playersNotOnBenchYet = this.shuffledPlayers.filter(player => !player.benched);
        let benchPlayers = playersNotOnBenchYet.slice(playersNotOnBenchYet.length - numberOfBenchPlayers);

        if (benchPlayers.length < numberOfBenchPlayers) {
            let playersOnBenchYet = this.shuffledPlayers.filter(player => player.benched);
            benchPlayers = benchPlayers.concat(playersOnBenchYet.slice(playersOnBenchYet.length - (numberOfBenchPlayers - benchPlayers.length)));

            // reset benched players
            this.playerService.resetBenchedPlayers();
            _.forEach(this.selectedPlayers, player => {
                player.benched = false;
            });
        }

        _.forEach(benchPlayers, benchPlayer => {
            this.playerService.markPlayerAsBenched(benchPlayer);

            _.forEach(this.selectedPlayers, player => {
                if (_.isEqual(player, benchPlayer)) {
                    player.benched = true;
                    player.isBenchNow = true;
                } else {
                    player.isBenchNow = false;
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