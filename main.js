let score = +($("#score").text()); //how much money
let power = 1; //how much do I get on click of buttons
let numberOfMiners = 2; //how many minersfields there are
let miners = []; //miners list
let dpu = [1, 10]; //dig per miner for next indexes of miners

//initiating miners
for(let i = 0; i < numberOfMiners; i++){
    miners[i]=new Miner(dpu[i]);
}

//handling mining by hand
$("#increment").click(()=>{upScore(power)});

//handling mining by miners
function minershandler(){
    let income = 0;
    for(let i = 0; i < numberOfMiners; i++){
        income += miners[i].getIncome();
    }
    upScore(income);
}

//clock for automining
setInterval(minershandler, 1000);

//adding some amount to score
function upScore(ammount){
    score += ammount;
    $("#score").text(score);
}

//miners buying
$(".miner").click(function(){
    handleBuying($(this).attr("id"))
});

//handling buying
function handleBuying(id){
    id = +(id.substring(5));
    miners[id].buyMe();
    $("#miner"+id).find(".ammount").text(miners[id].units);
}
