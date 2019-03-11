
let dpu = [1, 5]; //dig per miner for next indexes of miners
let cost = [10, 100]; //costs for buying new miner

let ps = { //player state
    score: 0, //how much money
    power: 1, //how much do I get on click of buttons
    numberOfMiners: 2, //how many minersfields there are
    miners: [], //miners list
};

//initiating miners
for(let i = 0; i < ps.numberOfMiners; i++){
    ps.miners[i]=new Miner(dpu[i], cost[i]);
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
}

//clock for automining
setInterval(minershandler, 1000);

//adding some amount to score
function upScore(ammount){
    ps.score += ammount;
    $("#score").text(ps.score);
}

//miners buying
$(".miner").click(function(){
    handleBuying($(this).attr("id"))
});

//handling miners buying
function handleBuying(id){
    id = +(id.substring(5)); //getting the id of miner clicked
    if(ps.score >= ps.miners[id].cost){ //chceking if you have enough of money
        upScore(-ps.miners[id].cost);
        ps.miners[id].buyMe();
        $("#miner"+id).find(".ammount").text(ps.miners[id].units); //updating units shown to player
        $("#miner"+id).find(".cost").text(ps.miners[id].cost); //updating cost shown to player
        $("#miner"+id).find(".income").text(ps.miners[id].getIncome()); //updating income shown to player
    }
}
