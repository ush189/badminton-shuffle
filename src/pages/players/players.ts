import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player';

@Component({
    selector: 'page-players',
    templateUrl: 'players.html',
    providers: [PlayerService]
})
export class PlayersPage {
    allPlayers: Player[] = [];
    newPlayerName: string = '';
    isLoading: boolean = false;

    constructor(public navCtrl: NavController, private playerService: PlayerService) {
    }

    ngOnInit() {
        this.playerService.getAllPlayers()
            .then(allPlayers => this.allPlayers = allPlayers);
    }

    addPlayer() {
        let newPlayer = {
            name: this.newPlayerName,
            selected: true,
            benched: false,
            isBenchNow: false,
            oneOnOne: false
        };

        this.allPlayers.push(newPlayer);
        this.playerService.addPlayer(newPlayer);
        this.newPlayerName = '';
    }

    removePlayer(index) {
        this.allPlayers.splice(index, 1);
        this.playerService.removePlayer(index);
    }

    updatePlayers() {
        this.playerService.updatePlayers(this.allPlayers);
    }

    loadFromGoogleDocs() {
        this.isLoading = true;
        this.playerService.loadFromGoogleDocs()
            .then(loadedPlayers => {
                this.allPlayers = loadedPlayers;
                this.isLoading = false;
            });
    }
}