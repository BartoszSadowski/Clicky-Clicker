class Upgrade{
    constructor(cost){
        this.bought=false;
        this.cost=cost;
        this.id=Upgrade.count;
        Upgrade.count++;
    }

    buyMe(){
        this.bought=true;
    }

    static get COUNT(){
        return Upgrade.count;
    }
}

Upgrade.count=0;

class CharUpgrade extends Upgrade{
    constructor(cost, powerGain){
        super(cost);
        this.powerGain=powerGain;
    }

    buyMe(){
        super.buyMe();
        return this.powerGain;
    }
}

class MinersUpgrade extends Upgrade{
    constructor(cost, targetAmmountPairs){
        super(cost);
        this.targetAmmountPairs=targetAmmountPairs;
    }

    buyMe(){
        super.buyMe();
        return this.targetAmmountPairs;
    }
}
