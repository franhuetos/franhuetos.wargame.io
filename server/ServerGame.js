
export class ServerGame{
    id = null;
    players = {
        one: null,
        two: null
    };

    constructor(gameId){
        this.id = gameID;
    }

    addPlayer(onStartCallback, onDisconnectCallback){
        let player = null;
        if(!this.players.one){
            this.players.one = {
                game: this,
                id: 1,
                onStart: onStartCallback,
                disconnect: onDisconnectCallback
            };
            player = this.players.one;
        }else if(!this.players.two){
            this.players.two = {
                game: this,
                id: 2,
                onStart: onStartCallback,
                disconnect: onDisconnectCallback
            };
            player = this.players.two;
        }

        return player;
    }

    removePlayer(player){
        let removed = false;
        if(player && player.game.id === this.id){
            if(player.id === 1){
                this.players.one = null;
                removed = true;
            }else if(player.id === 2){
                this.players.two = null;
                removed = true;
            }
        }
        return removed;
    }

}