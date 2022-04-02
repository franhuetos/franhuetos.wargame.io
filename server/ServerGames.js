import Game from './ServerGame';

export class ServerGames {
    gameId = 0;
    games = {};
    waitingGames = [];

    constructor(){}

    join(onStartCallback, onDisconnectCallback) {
        let player;
        if(this.waitingGames.length){
            let game = this.waitingGames.shift();
            player = game.addPlayer(onStartCallback, onDisconnectCallback);

            if(game.players.one && game.players.two){
                game[game.id] = game;
                game.players.one.onStart();
                game.players.two.onStart();
            }

        }else{
            let game = new Game(this.gameId++);
            player = game.addPlayerOne(onStartCallback, onDisconnectCallback);
            this.waitingGames.push(game);
        }  
        return player;
    }

    exit(player){
        if(player && player.game && player.game.id){
            if(this.games[player.game.id]){
                if(player.id === 1){
                    this.games[player.game.id].players.one = null;
                    this.games[player.game.id].players.two.disconnect();
                }else if(player.id === 2){
                    this.games[player.game.id].players.two = null;
                    this.games[player.game.id].players.one.disconnect();
                }
                delete  this.games[player.game.id];
            }else{
                let index = this.waitingGames.findIndex(game=> game.id === player.game.id);
                if(index > -1){
                    if(player.id === 1){
                        this.waitingGames[index].players.one = null;
                        this.games[player.game.id].players.one.disconnect();
                    }else if(player.id === 2){
                        this.waitingGames[index].players.two = null;
                        this.games[player.game.id].players.two.disconnect();
                    }
                    this.waitingGames.splice(index, 1);
                }
            }
        }
        
    }

}