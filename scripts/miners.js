class Miner{
    constructor(units, digperunit, cost){
        this.units = units;
        this.dpu = digperunit;
        this.cost = cost;
    }

    get getIncome(){
        return(this.units*this.dpu)
    }

    buyMe(){
        this.units++;
        this.cost = Math.ceil(Math.pow(this.cost, 1.05));
    }
}
