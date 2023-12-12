let opponent = ''
while(!['h','H','a','A'].includes(opponent)){
    opponent = prompt('H: Human vs Human \nA: Human vs AI')
}

let player1 = prompt('Enter Player 1 Name')
let player2 = 'Computer'
if(opponent=='H' || opponent=='h'){
    player2 = prompt('Enter Player 2 Name')
}

document.querySelector('#player1').innerHTML = player1
document.querySelector('#player2').innerHTML = player2
document.querySelector('#turn').innerHTML = player1

let p1 = 0
let p2 = 0

let turn = player1
let lock = 'off'

let boxes = document.querySelectorAll('.box')
let state = ['','','','','','','','','']

start()

function start(){
    boxes.forEach((box, i)=>{
        box.addEventListener('click', (e)=> {
            if(Actions(state).includes(i) && lock=='off'){
                let symbol = Player(state)
                state = Result(state, i)
                Array.from(boxes)[i].style.backgroundImage = `url(${symbol}.png)`
                Array.from(boxes)[i].classList.remove('variableOpacity')
                Array.from(boxes)[i].classList.remove('whiteBG')
                
                if(Terminal(state)){
                    setLock('on');
                    (Utility(state)==1 || Utility(state)==-1) && updateScore();
                    setTimeout(restart, 1000);
                }
                else{
                    changeTurn();
                }   
            }
        })
    })
}