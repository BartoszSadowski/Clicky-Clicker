class Upgrade{
    constructor(bought ,name, cost, id){
        this.bought=bought;
        this.name=name;
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

class MinersUpgrade extends Upgrade{
    constructor(bought, name, cost, id, targetAmmountPairs){
        super(bought, name, cost, id);
        this.targetAmmountPairs=targetAmmountPairs;
    }

    buyMe(){
        super.buyMe();
        return this.targetAmmountPairs;
    }
}
