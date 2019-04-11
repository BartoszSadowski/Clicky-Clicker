class Miner{
    constructor(name, units, digperunit, cost, hText){
        this.name = name;
        this.units = units;
        this.dpu = +digperunit;
        this.cost = cost;
        this.hText = hText;
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

class Upgrade{
    constructor(bought ,name, cost, id, hText){
        this.bought=bought;
        this.name=name;
        this.cost=cost;
        this.id=Upgrade.count;
        this.hText=hText;
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
    constructor(bought, name, cost, id, hText, targetAmmountPairs){
        super(bought, name, cost, id, hText);
        this.targetAmmountPairs=targetAmmountPairs;
    }

    buyMe(){
        super.buyMe();
        return this.targetAmmountPairs;
    }
}

const initVM = {1:["miner1", 0, 1, 10, "halo"], 2:["miner2", 0, 5, 100, "halo"], 3:["miner3", 0, 25, 500,"halo"], 4:["miner4",0, 50, 1000 ,"halo"]}; //initial dig and cost for each miner
const upgds = {First:[5, 0, "some a little longer text just to see how it works", {0: 1, 1:2}], Second:[200, 0, "hover", {2:1}], Third:[300, 0, "hover", {3:1}]}; //upgrades with structure name:[cost, {target: ammount}]

let ps = { //player state
    score: 0, //how much money
    power: 1, //how much do I get on click of buttons
    numberOfMiners: Object.keys(initVM).length, //how many minersfields there are
    miners: [], //miners list
    gps: 0, //gain per second
    upgradez: [],
};

//initializing game
if(localStorage.getItem('playerstate')!=null) {  //checking if previous state exists
    ps=JSON.parse(localStorage.getItem('playerstate')); //parsing state into an object
    for(let i = 0; i < ps.numberOfMiners; i++){ //initializing Miners based on previous state
        ps.miners[i]=new Miner(...Object.values(ps.miners[i]));
        updateMiners(i);
        upScore(0);
        setGps(ps.gps);
    }
    for(let i = 0; i < ps.upgradez.length; i++){
        ps.upgradez[i]=new MinersUpgrade(...Object.values(ps.upgradez[i]))
    }
} else { //initialiting fresh miners
    for(let i = 0; i < ps.numberOfMiners; i++){
        ps.miners[i]=new Miner(...Object.values(initVM)[i]);
    }//loading upgrades into array
    for(let i = 0; i < Object.keys(upgds).length; i++){
        ps.upgradez.push(new MinersUpgrade(false ,Object.keys(upgds)[i], ...Object.values(upgds)[i]));
    }
}
updateClickPower(0);


//showing upgrades buttons unbought
function showBUpgrades(){
    $(".upgrades > header").text("Upgrades to buy");
    for(let i=0; i<ps.upgradez.length; i++){
        if(!ps.upgradez[i].bought){
            $(".upgradesList").append(`
                <button class="upgrade popup" id="upgrade${i}" data-popuptext="${ps.upgradez[i].hText}">
                ${ps.upgradez[i].cost}
                </button>
            `);
        }
    }
}
showBUpgrades();


//creating miners buttons
function showMiners(){
    for(let i=0; i<ps.miners.length; i++){
        $(".mines").append(`
            <button class="miner popup" id="miner${i}">
            <p>${ps.miners[i].name} : <span class="ammount">${ps.miners[i].units}</span></p>
            <p>Total income: <span class="income">${ps.miners[i].getIncome}</span></p>
            <p>Buy new: <span class="cost">${ps.miners[i].cost}<span></p>
            </button>
        `);
    }
}
showMiners();

//showing updated values on buttons
function updateMiners(id) {
    $("#miner"+id).find(".ammount").text(ps.miners[id].units); //updating units shown to player
    $("#miner"+id).find(".cost").text(ps.miners[id].cost); //updating cost shown to player
    $("#miner"+id).find(".income").text(ps.miners[id].getIncome); //updating income shown to player
}

//power update
function updateClickPower(ammount){
    ps.power=ps.power+ammount;
    $("#gpc").text(ps.power);
}

//setting gain per second on screen
function setGps(value){
    ps.gps = value;
    $("#gps").text(ps.gps);
}

//adding some amount to score
function upScore(ammount){
    ps.score += ammount;
    $("#score").text(ps.score);
}

//handling upgrades buying
$(".upgrade").click((event)=>{
    id = +($(event.currentTarget).attr("id").substring(7));
    if(ps.score >= ps.upgradez[id].cost){
        upScore(-ps.upgradez[id].cost);
        pairs=Object.entries(ps.upgradez[id].buyMe());
        for(pair of pairs){
            if(pair[0]==0){
                updateClickPower(pair[1]);
            }else{
                id=pair[0]-1;
                ps.miners[id].newDpu(pair[1]);
                updateMiners(id);
            }
        }
        $("#upgrade"+id).remove();
    }
});

//handling miners buying
$(".miner").click((event)=>{
    id = +($(event.currentTarget).attr("id").substring(5));
    if(ps.score >= ps.miners[id].cost){ //chceking if you have enough of money
        upScore(-ps.miners[id].cost);
        ps.miners[id].buyMe();
        updateMiners(id);
    }
});

//handling mining by hand
$("#increment").click(()=>{upScore(ps.power)});

//handling mining by miners
setInterval(() => {
        let income = 0;
        for(let i = 0; i < ps.numberOfMiners; i++){
            income += ps.miners[i].getIncome;
        }
        upScore(income);
        setGps(income);
    }, 1000);

//saving game
setInterval(() => {
        localStorage.setItem('playerstate', JSON.stringify(ps));
        console.log("saved");
    }, 30000);
