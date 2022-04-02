export class SoldierStates {
  
    ACTION = {
        "STOP": "STOP",
        "WALK": "WALK",
        "SHOT": "SHOT",
        "JUMP": "JUMP",
        "DIE": "DIE",
        "EXPLODE": "EXPLODE"
    }

}

class StopState {

    /*
     * @param {SoldierStates.ACTION} state 
     * @returns IdleState
     */
    handleState(state){

        if(state === SoldierStates.ACTION.JUMP){
            //TODO: Do jump staff
            return new JumpState();
        }

        if(state === SoldierStates.ACTION.SHOT){
            //TODO: Do shot staff
            return new ShotState();
        }

        if(state === SoldierStates.ACTION.WALK){
            //TODO: Do walk staff
            return new WalkState();
        }

        if(state === SoldierStates.ACTION.EXPLODE){
            //TODO: Do explode staff
            return new ExplodeState();
        }

        if(state === SoldierStates.ACTION.DIE){
            //TODO: Do die staff
            return new DieState();
        }

        return this;
    }
}

class ShotState {
    /*
     * @param {SoldierStates.ACTION} state 
     * @returns IdleState
     */
    handleState(state){

        if(state === SoldierStates.ACTION.JUMP){
            //TODO: Do jump staff
            return new JumpState();
        }

        if(state === SoldierStates.ACTION.STOP){
            //TODO: Do stop staff
            return new StopState();
        }

        if(state === SoldierStates.ACTION.WALK){
            //TODO: Do walk staff
            return new WalkState();
        }

        if(state === SoldierStates.ACTION.EXPLODE){
            //TODO: Do explode staff
            return new ExplodeState();
        }

        if(state === SoldierStates.ACTION.DIE){
            //TODO: Do die staff
            return new DieState();
        }

        return this;
    }
}

class WalkState {
    /*
     * @param {SoldierStates.ACTION} state 
     * @returns IdleState
     */
    handleState(state){

        if(state === SoldierStates.ACTION.JUMP){
            //TODO: Do jump staff
            return new JumpState();
        }

        if(state === SoldierStates.ACTION.STOP){
            //TODO: Do stop staff
            return new StopState();
        }

        if(state === SoldierStates.ACTION.SHOT){
            //TODO: Do shot staff
            return new ShotState();
        }

        if(state === SoldierStates.ACTION.EXPLODE){
            //TODO: Do explode staff
            return new ExplodeState();
        }

        if(state === SoldierStates.ACTION.DIE){
            //TODO: Do die staff
            return new DieState();
        }

        return this;
    }
}

class ExplodeState {
    handleInput(){
        return this;
    }
}

class DieState {
    handleInput(){
        return this;
    }
}

class JumpState {
    handleInput(){
        return this;
    }
}