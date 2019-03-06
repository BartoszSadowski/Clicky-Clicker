let score = +($("#score").text());
let power = 1;

$("#increment").click(()=>dig());



function dig(){
    score=score+power;
    $("#score").text(score);
}
