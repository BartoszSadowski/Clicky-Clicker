class Miner{
    constructor(digperunit){
        this.units = 0;
        this.dpu = digperunit;
    }

    getIncome(){
        return(this.units*this.dpu)
    }

    buyMe(){
        this.units++;
    }
}
