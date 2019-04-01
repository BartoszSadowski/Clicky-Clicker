class Miner{
    constructor(units, digperunit, cost){
        this.units = units;
        this.dpu = +digperunit;
        this.cost = cost;
    }

    newDpu(dpuN){
        this.dpu = this.dpu + dpuN;
        return this.dpu;
    }

    get getIncome(){
        return(this.units * this.dpu)
    }

    buyMe(){
        this.units++;
        this.cost = Math.ceil(Math.pow(this.cost, 1.05));
    }
}
