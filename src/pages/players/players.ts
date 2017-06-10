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

    constructor(public navCtrl: NavController, private playerService: PlayerService) {
    }

    ngOnInit() {
        this.playerService.getAllPlayers()
            .then(allPlayers => this.allPlayers = allPlayers);
    }

    addPlayer() {
        let newPlayer = {
            name: this.newPlayerName,
            selected: true
        };

        this.allPlayers.push(newPlayer);
        this.playerService.addPlayer(newPlayer);
        this.newPlayerName = '';
    }

    updatePlayers() {
        this.playerService.updatePlayers(this.allPlayers);
    }

    loadFromGoogleDocs() {
        this.playerService.loadFromGoogleDocs()
            .then(loadedPlayers => this.allPlayers = loadedPlayers);
    }
}