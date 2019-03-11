let dpu = [1, 5]; //initial dig per miner for next indexes of miners
let cost = [10, 100]; //initial costs for buying new miner

let ps = { //player state
    score: 0, //how much money
    power: 1, //how much do I get on click of buttons
    numberOfMiners: 2, //how many minersfields there are
    miners: [], //miners list
    gps: 0, //gain per second
};

//initializing game
if(localStorage.getItem('playerstate')!=null) {  //checking if previous state exists
    ps=JSON.parse(localStorage.getItem('playerstate')); //parsing state into an object
    for(let i = 0; i < ps.numberOfMiners; i++){ //initializing Miners based on previous state
        ps.miners[i]=new Miner(ps.miners[i].units, ps.miners[i].dpu, ps.miners[i].cost);
        updateMiners(i);
        upScore(0);
        setGps(ps.gps);
    }
} else { //initialiting fresh miners
    for(let i = 0; i < ps.numberOfMiners; i++){
        ps.miners[i]=new Miner(0, dpu[i], cost[i]);
    }
}

//showing updated values on buttons
function updateMiners(id) {
    $("#miner"+id).find(".ammount").text(ps.miners[id].units); //updating units shown to player
    $("#miner"+id).find(".cost").text(ps.miners[id].cost); //updating cost shown to player
    $("#miner"+id).find(".income").text(ps.miners[id].getIncome()); //updating income shown to player
}

//handling mining by hand
$("#increment").click(()=>{upScore(ps.power)});

//handling mining by miners
function minershandler(){
    let income = 0;
    for(let i = 0; i < ps.numberOfMiners; i++){
        income += ps.miners[i].getIncome();
    }
    upScore(income);
    setGps(income);
}

//setting gain per second on screen
function setGps(value){
    ps.gps = value;
    $("#gps").text(ps.gps);
}

//clock for automining
setInterval(minershandler, 1000);

//adding some amount to score
function upScore(ammount){
    ps.score += ammount;
    $("#score").text(ps.score);
}

//listening to miners buying
$(".miner").click(function(){
    handleBuying($(this).attr("id"))
});

//handling miners buying
function handleBuying(id){
    id = +(id.substring(5)); //getting the id of miner clicked
    if(ps.score >= ps.miners[id].cost){ //chceking if you have enough of money
        upScore(-ps.miners[id].cost);
        ps.miners[id].buyMe();
        updateMiners(id);
    }
}

//saving game
setInterval(() => {
        localStorage.setItem('playerstate', JSON.stringify(ps));
        console.log("saved");
    }, 30000);
