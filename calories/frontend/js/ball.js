function ball_anim(balls){
    balls.forEach(element => {
        let top = Math.random(2)*300+50
        element.style.top = `${top}px`
        let left = Math.random(2)*window.innerWidth
        element.style.left = `${left}px`
    });
    setTimeout(
        ()=>{ball_anim(balls)} , 5000
    )
}

let balls = document.querySelectorAll('.ball')
ball_anim(balls)
