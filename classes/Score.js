export class Score {
    static instance;

    constructor(){
        if(this.instance){
            return this.instance;
        }
        this.instance = this;
    }

    init(character){
        if(!this.instance[character]){
            this.instance[character] = {
                die: 0,
                shot: 0,
                killed: 0,
                hits: 0
            }
        }
    }

    die(character){
        if(!this.instance[character]){
            this.instance[character] = {
                die: 1,
                shot: 0,
                killed: 0,
                hits: 0
            }
        }else{
            this.instance[character].die++;
        }
    }

    shot(character){
        if(!this.instance[character]){
            this.instance[character] = {
                die: 0,
                shot: 1,
                killed: 0,
                hits: 0
            }
        }else{
            this.instance[character].shot++;
        }
    }

    hit(character){
        if(!this.instance[character]){
            this.instance[character] = {
                die: 0,
                shot: 0,
                killed: 0,
                hits: 1
            }
        }else{
            this.instance[character].hits++;
        }
    }

    kill(character){
        if(!this.instance[character]){
            this.instance[character] = {
                die: 0,
                shot: 0,
                killed: 1,
                hits: 0
            }
        }else{
            this.instance[character].killed++;
        }
    }
    
}