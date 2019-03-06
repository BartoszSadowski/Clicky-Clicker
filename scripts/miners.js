class Miner{
    constructor(digperunit, cost){
        this.units = 0;
        this.dpu = digperunit;
        this.cost = cost;
    }

    getIncome(){
        return(this.units*this.dpu)
    }

    buyMe(){
        this.units++;
        this.cost = Math.ceil(Math.pow(this.cost, 1.05));
    }
}
