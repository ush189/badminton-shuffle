import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player';

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

    constructor(public navCtrl: NavController, private playerService: PlayerService) {
    }

    ngOnInit() {
        this.refreshSelectedPlayers();
    }

    init() {
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
    }

    getPlayersPerCourt(court) {
        return this.shuffledPlayers.slice(court * 4, court === 0 ? 4 : court * 8);
    }

    getPlayersForTheBench() {
        let numberOfBenchPlayers = this.selectedPlayers.length - this.numberOfCourts * 4;

        return this.shuffledPlayers.slice(this.selectedPlayers.length - numberOfBenchPlayers);
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
