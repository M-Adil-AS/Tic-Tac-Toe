function Player(state){
    let emptyBoxes = 0
    let ticks = 0
    let crosses = 0

    state.forEach((box)=>{
        if(box==''){emptyBoxes++}
        else if(box=='tick'){ticks++}
        else if(box=='cross'){crosses++}
    })

    if(emptyBoxes==9){return 'tick'}
    else if(ticks>crosses){return 'cross'}
    else if(ticks==crosses){return 'tick'}
}

function Actions(state){
    let emptyBoxNos = []
    state.forEach((box,i)=>{
        if(box==''){emptyBoxNos.push(i)}
    })
    return emptyBoxNos
}

function Result(state,action){
    let symbol = Player(state)
    let newState = state.map((box,i)=>{
        if(symbol=='tick' && action==i){return 'tick'}
        else if(symbol=='cross' && action==i){return 'cross'}
        else {return box}
    })   
    return newState
}

function Terminal(state){
    let pairs = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    let formationOfTicks = false
    let formationOfCrosses = false

    pairs.forEach((pair)=>{
        let tickCount = 0
        let crossCount = 0

        pair.forEach((no)=>{
            if(state[no]=='tick'){
                tickCount++
            }
            else if(state[no]=='cross'){
                crossCount++
            }
        })
        
        if(tickCount==3){formationOfTicks = true}
        if(crossCount==3){formationOfCrosses = true}
    })

    let isDraw = state.filter(elem => elem).length==9

    if(formationOfTicks || formationOfCrosses || isDraw){
        return true
    }

    return false
}

function Utility(state){
    let pairs = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    let formationOfTicks = false
    let formationOfCrosses = false

    pairs.forEach((pair)=>{
        let tickCount = 0
        let crossCount = 0

        pair.forEach((no)=>{
            if(state[no]=='tick'){
                tickCount++
            }
            else if(state[no]=='cross'){
                crossCount++
            }
        })
        
        if(tickCount==3){formationOfTicks = true}
        if(crossCount==3){formationOfCrosses = true}
    })

    let isDraw = state.filter(elem => elem).length==9

    if(formationOfTicks) return 1
    else if(formationOfCrosses) return -1
    else if(isDraw) return 0
}

function MaxValue(state, initial_call){
    if(Terminal(state)){
        return Utility(state)
    }

    let v = -Infinity
    let associatedAction

    Actions(state).forEach((action)=>{
        let prev_val = v    // to check whether value is updated in current iteration
        v = Math.max(v,MinValue(Result(state,action)))
        if(prev_val!=v && initial_call){associatedAction = action}
    })

    return initial_call ? {maxValue: v, associatedAction} : v
}

function MinValue(state, initial_call){
    if(Terminal(state)){
        return Utility(state)
    }

    let v = Infinity
    let associatedAction

    Actions(state).forEach((action)=>{
        let prev_val = v    // to check whether value is updated in current iteration
        v = Math.min(v,MaxValue(Result(state,action)))
        if(prev_val!=v && initial_call){associatedAction = action}
    })

    return initial_call ? {minValue: v, associatedAction} : v
}

function MinMax(){
    let symbol = Player(state)
    setLock('off')

    if(symbol=='tick'){
        let {maxValue, associatedAction} = MaxValue(state, true)
        boxes[associatedAction].click()
    }
    else if(symbol=='cross'){
        let {minValue, associatedAction} = MinValue(state, true)
        boxes[associatedAction].click()
    }
}

function updateScore(){
    if(turn==player1){
        p1++
        document.querySelector('#p1').innerHTML = p1
    }
    else if(turn==player2){
        p2++
        document.querySelector('#p2').innerHTML = p2
    }
}

function changeTurn(){
    turn = (turn==player1) ? player2 : player1
    document.querySelector('#turn').innerHTML = turn
    
    if(turn=='Computer'){
        setLock('on')
        setTimeout(MinMax, 1000)
    }
}

function restart(){
    state = ['','','','','','','','','']

    Array.from(boxes).forEach(box => {
        box.style.backgroundImage = ''
        box.classList.add('variableOpacity')
        box.classList.add('whiteBG')
    })

    setLock('off')
    changeTurn()
}

function setLock(val){
    lock = val

    if(lock=='on'){
        boxes.forEach((box, i)=>{
            boxes[i].classList.remove('variableOpacity')
        })
    }
    else if(lock=='off'){
        state.forEach((box, i)=>{
            if(state[i]==''){
                boxes[i].classList.add('variableOpacity')
            }
        })
    }
}