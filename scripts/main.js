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
        this.cost = Math.ceil(Math.pow(this.cost, 1.1));
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
    1:["Cookies", 10, "Mayby selling cookies will get us some clicks?", 0, 1, "rescources/cookie.jpg"], 
    2:["Money", 100, "Ok, money will get us more clicks. I hope...", 0, 5, "rescources/money.png"], 
    3:["Hero", 500, "Let's hire a hero. It'll get us on better foot.", 0, 20, "rescources/sword.png"], 
    4:["Paperclip", 1000, "I heard a paperclips gets a lot of clicks.", 0, 50, "rescources/paperclip.png"]
};

//upgrades with structure name:[cost, {target: ammount}]
const upgds = {
    1:[100, "Valuable cookies: \n This will get us 1 more clicks per cookie", 0, {1:1}],
    2:[100, "I must click harder: \n This will power your click by 1", 0, {0:1}],
    3:[200, "Money is everything: \n Money gives 5 more clicks per second", 0, {2:5}],
    4:[500, "Click Power: \n Every click now is more powerful by 2", 0, {0:2}],
    5:[1000, "You have my sword: \n Every hero clicks harder by 10 per second", 0, {3:10}],
    6:[2000, "The paperclip: \n It holds paper even better and gives next 20 clicks per second", 0, {4:20}],
    7:[3000, "Cookies of gold: \n This golden cookies gets us 3 more clicks per second", 0, {1:3}],
    8:[4000, "Faster: \n This will power your click by 3", 0, {0:3}],
    9:[5000, "Money can't buy you money: \n Money gives 10 more clicks per second", 0, {2:10}],
    10:[6000, "And my bow: \n Every hero clicks harder by 15", 0, {3:15}],
    11:[7000, "AI: \n AI loves paperclips and clicks 30 times for every single one of them", 0, {4:30}],
    12:[8000, "Grandma: \n Lovely grandma bakes cookies with us. 10 clicks per cookie more", 0, {1:10}],
    13:[9001, "It's over 9000: \n Everything gets 5/s click boost", 0, {0:5, 1:5, 2:5, 3:5, 4:5}],
    14:[10000, "Must not click: \n Every idle miner gets 3/s click boost", 0, {1:3, 2:3, 3:3, 4:3}],
    15:[10000, "What the hell: \n Your power grows by 3", 0, {0:3}],
    16:[20000, "Are you still playing?: \n This upgrade gives you 1 power", 0, {0:1}],
    17:[50000, "Really?: \n Cookies and paper clips gives 2 clicks more", 0, {1:2, 4:2}],
    18:[90000, "Final goal: \n Are you happy now?", 0, {0:1000, 1:1000, 2:1000, 3:1000, 4:1000}],
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
            <button class="miners_area__button" id="miner${i}" data-popuptext="${ps.miners[i].hText} \n \n It will get us ${ps.miners[i].dpu} click per second.">
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
    let popup = ps.miners[id].hText + "\n \n It will get us " + ps.miners[id].dpu + " click per second.";
    $("#miner"+id).attr("data-popuptext", popup) //updating popup attribute
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
                ids=pair[0]-1;
                ps.miners[ids].newDpu(pair[1]);
                updateMiners(ids);
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
