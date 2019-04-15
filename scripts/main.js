//Declaring classes
class Block {
    constructor(name, cost, hText){
        this.name = name;
        this.cost = cost;
        this.hText = hText;
    }
}

class Miner extends Block {
    constructor(name, cost, hText, units, digperunit, image){
        super(name, cost, hText);
        this.units = units;
        this.dpu = +digperunit;
        this.image = image;
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

class Upgrade extends Block{
    constructor(name, cost, hText, id, targetAmmountPairs, bought){
        super(name, cost, hText);
        this.id = Upgrade.count;
        this.targetAmmountPairs=targetAmmountPairs;
        this.bought = bought;
        Upgrade.count++;
    }

    buyMe(){
        this.bought=true;
        return this.targetAmmountPairs;
    }

    static get COUNT(){
        return Upgrade.count;
    }
}
Upgrade.count=0;
//End of declaring classes

//Initial data
//initial dig and cost for each miner
const initVM = {
    1:["Cookies", 10, "halo", 0, 1, "rescources/cookie.jpg"], 
    2:["Money", 100, "halo", 0, 5, "rescources/money.png"], 
    3:["Hero", 500, "halo", 0, 20, "rescources/sword.png"], 
    4:["Paperclip", 1000, "halo", 0, 50, "rescources/paperclip.png"]
};

//upgrades with structure name:[cost, {target: ammount}]
const upgds = {
    First:[5, "some a little longer text just to see how it works", 0, {0: 1, 1:2}],
    Second:[200, "hover", 0, {2:1}],
    Third:[300, "hover", 0, {3:1}]
}; 
//End of initial data

let ps = { //player state
    score: 0, //how much money
    power: 1, //how much do I get on click of buttons
    numberOfMiners: Object.keys(initVM).length, //how many minersfields there are
    miners: [], //miners list
    gps: 0, //gain per second
    upgradez: [],
};

//Begining of game initialization
if(localStorage.getItem('playerstate')!=null) {  //checking if previous state exists
    ps=JSON.parse(localStorage.getItem('playerstate')); //parsing state into an object
    for(let i = 0; i < ps.numberOfMiners; i++){ //initializing Miners based on previous state
        ps.miners[i]=new Miner(...Object.values(ps.miners[i]));
        updateMiners(i);
        upScore(0);
        setGps(ps.gps);
    }
    for(let i = 0; i < ps.upgradez.length; i++){
        ps.upgradez[i]=new Upgrade(...Object.values(ps.upgradez[i]))
    }
} else { //initialiting fresh miners
    for(let i = 0; i < ps.numberOfMiners; i++){
        ps.miners[i]=new Miner(...Object.values(initVM)[i]);
    }//loading upgrades into array
    for(let i = 0; i < Object.keys(upgds).length; i++){
        ps.upgradez.push(new Upgrade(Object.keys(upgds)[i], ...Object.values(upgds)[i], false));
    }
}
updateClickPower(0);
//End of game initialization

//HTML elements handling
//showing upgrades buttons unbought
function showBUpgrades(){
    for(let i=0; i<ps.upgradez.length; i++){
        if(!ps.upgradez[i].bought){
            $(".upgrade_area__list").append(`
                <button class="upgrade_area__button" id="upgrade${i}" data-popuptext="${ps.upgradez[i].hText}">
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
        $(".miners_area").append(`
            <button class="miners_area__button" id="miner${i}" data-popuptext="${ps.miners[i].hText}">
                <img class="miners_button__image" src=${ps.miners[i].image}>
                <div class="miners_button__text">
                    <p>${ps.miners[i].name}: <span class="ammount">${ps.miners[i].units}</span></p>
                    <p>Total income: <span class="income">${ps.miners[i].getIncome}</span></p>
                    <p>Buy new: <span class="cost">${ps.miners[i].cost}<span></p>
                </d
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
//End of HTML handling

//Listeners
//handling upgrades buying
$(".upgrade_area__button").click((event)=>{
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
$(".miners_area__button").click((event)=>{
    id = +($(event.currentTarget).attr("id").substring(5));
    if(ps.score >= ps.miners[id].cost){ //chceking if you have enough of money
        upScore(-ps.miners[id].cost);
        ps.miners[id].buyMe();
        updateMiners(id);
    }
});

//handling mining by hand
$("#increment").click(()=>{upScore(ps.power)});
//End of listeners


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
