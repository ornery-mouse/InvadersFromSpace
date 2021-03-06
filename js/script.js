//make canvas accessible
const game = document.getElementById('canvas')
//context variable
const ctx = game.getContext('2d')
let counter = 0
//define player object
function Player(x, y, color, width, height, life) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.life = life
    this.alive = true
    this.points = 0
    this.win = false
    //how to draw player
    this.render = function () {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    //player moves
    this.move = function (key) {
        switch (key) {
            case (' '):
            //shoot
                shootMissile(player)
                break
            case ('a'):
                // move left
                if (player.x > 80) { player.x -= 3 }
                break
            // case ('s'):
            //     move down
            //     useSpecial()
            //     break
            case ('d'):
                // move right
                if (player.x < 215){ player.x += 3 } 
                break
        }
    }
}
//create player
let player = new Player(150, 140, 'cyan', 10, 5, 3)
//define alien object
function Alien(x, y, color, width, height, life, points) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.life = life
    this.alive = true
    this.points = points
    this.dx = .15
    this.direction = {
        left: false,
        right: true
    }
    //alien appearance
    this.render = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4  , 0, 2 * Math.PI);
        ctx.fillStyle = color
        ctx.fill()
    }
    //check and set direction
    this.setDirection = function (low, high) {
        if (high > 225) {
            this.direction.right = false
            this.direction.left = true
            console.log('should speed up')
            for (i = 0; i < alienFleet.length; i++) {
                alienFleet[i].y += 4
                alienFleet[i].dx += .05
            }
        }
        if (low < 80) {
            console.log('should speed up')
            this.direction.right = true
            this.direction.left = false
            for (i = 0; i < alienFleet.length; i++) {
                alienFleet[i].y += 4
                alienFleet[i].dx += .05
            }
        }
    }
    //move alien fleet
    this.move = function () {
        alien.setDirection(getLowestX(), getHighest())
        if (this.direction.right) {
            for (i = 0; i < alienFleet.length; i++) {
                alienFleet[i].x += this.dx
            }
        } else if (this.direction.left) {
            for (i = 0; i < alienFleet.length; i++) {
                alienFleet[i].x -= this.dx
            }
        }
    }
    //fire a missile
    this.shoot = function () {
        let randomAlien = Math.floor(Math.random() * alienFleet.length)
        if (counter % 250 === 0) {
            console.log(counter)
            shootMissile(alienFleet[randomAlien])
        }
        if (counter % 302 === 0) {
            console.log(counter)
            shootMissile(alienFleet[randomAlien])
        }
    }
}

let alien
let alienFleet = []
//make alien counter accesible
const aliensRemaining = document.getElementById('aliensRemaining')
//function for creating a row of aliens
const createAlienSquad = (y, color, life, points) => {
    for (i = 1; i < 11; i++) {
        let x = (i * 10) + 70
        alien = new Alien(x, y, color, 9, 7, life, points)
        alienFleet.push(alien)
    }
}
//create 40 aliens
const createFleet = () => {
    createAlienSquad(35, 'purple', 1, 10)
    createAlienSquad(25, 'purple', 1, 10)
    createAlienSquad(15, 'yellow', 2, 25)
    createAlienSquad(5, 'magenta', 3, 50)
}

//define missile object
function Missile(x, y, width, height, dy, from) {
    this.x = x
    this.y = y
    this.color = 'white'
    this.width = width
    this.height = height
    this.dy = dy
    this.from = ''
    this.render = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
        ctx.fillStyle = this.color
        ctx.fill()
    }

    this.update = function () {
        this.y = this.y + this.dy
    }
}
//make individual missiles and every one on screen accessible globally
let missile
let missiles = []
//create a missile and push it to the array
const shootMissile = (from) => {
    if (from === player) {
        missile = new Missile(from.x + 4.5, from.y, 2, 5, -3, from)
        missiles.push(missile)
    } else {
        missile = new Missile(from.x, from.y, 2, 5, .75, from)
        missiles.push(missile)
    }
}
//missile hit and edge detection logic
const detectMissileHit = () => {
    //identify which alien is hit
    missiles.forEach((missile, index) => {
        if (missile.dy < 0) {
            alienFleet.forEach((alien, fleetIndex) => {
                //missile hits
                if (
                    missile.x < alien.x + alien.width &&
                    missile.x + missile.width > alien.x &&
                    missile.y < alien.y + alien.height &&
                    missile.y + missile.height > alien.y
                ) {
                    missiles.splice(index, 1)
                    alien.life = alien.life - 1
                    //check for kill and points
                    if (alien.life === 0) {
                        alienFleet.splice(fleetIndex, 1)
                        player.points = player.points + alien.points
                        pointTotal.innerText = String(player.points).padStart(4, '0')
                    }
                    //missile edge detection
                } else if (missile.y <= 0) {
                    missiles.splice(index, 1)
                }
            })
            barriers.forEach((barrier, barrierIndex) => {
                //missile hits
                if (
                    missile.x < barrier.x + barrier.width &&
                    missile.x + missile.width > barrier.x &&
                    missile.y < barrier.y + barrier.height &&
                    missile.y + missile.height > barrier.y
                ) {
                    missiles.splice(index, 1)
                    barrier.life = barrier.life - 1
                    barrier.x += 1
                    barrier.width -= 2
                    console.log(barrier.life)
                    //check for kill and points
                    if (barrier.life === 0) {
                        barriers.splice(barrierIndex, 1)
                    }
                    
                }
            })
        } else if (missile.dy > 0) {
            barriers.forEach((barrier, barrierIndex) => {
                //missile hits
                if (
                    missile.x < barrier.x + barrier.width &&
                    missile.x + missile.width > barrier.x &&
                    missile.y < barrier.y + barrier.height &&
                    missile.y + missile.height > barrier.y
                ) {
                    missiles.splice(index, 1)
                    barrier.life = barrier.life - 1
                    barrier.x += 1
                    barrier.width -= 2
                    console.log(barrier.life)
                    //check for kill and points
                    if (barrier.life === 0) {
                        barriers.splice(barrierIndex, 1)
                    }    
                }
            })
            if (
                missile.x < player.x + player.width &&
                missile.x + missile.width > player.x &&
                missile.y < player.y + player.height &&
                missile.y + missile.height > player.y
            ) {
                missiles.splice(index, 1)
                player.life -= 1
            }
        }
    })
}

function Barrier(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = 'lime'
    this.life = 8
    this.render = function () {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let barrier
let barriers = []

const displayLoss = () => {
    cancelAnimationFrame(animationId)
    gameEnd.classList.remove('hidden')
    gameStatus.innerText = 'Defeat!'
    message.innerText = 'The Omicronians have conquered Earth!'
    totalPoints.innerText = player.points
}

//function for displaying and ending the game upon player win
const displayWin = () => {
    cancelAnimationFrame(animationId)
    gameEnd.classList.remove('hidden')
    gameStatus.innerText = 'Victory!'
    message.innerText = 'You have saved the planet!'
    totalPoints.innerText = player.points
}

const init = () => {
    container.classList.remove('hidden')
    startDisplay.classList.add('hidden')
    alienFleet = []
    missiles = []
    barriers = []
    player.points = 0
    player.win = false
    player.life = 3
    player.x = 150
    counter = 0
}

const gameLoop = () => {
    for (i = 1; i < 5; i++){
        let x = (i * 40) + 40
        barrier = new Barrier(x, 125, 16, 5)
        barriers.push(barrier)
    }
    if (alienFleet.length == 0 && player.points <= 0) {
        createFleet()
    }
    animate()
}

const checkWin = () => {
    console.log('check win')
     if (player.life === 0) {
        cancelAnimationFrame(animationId)
        player.win = true
        displayLoss()
    } else if (alienFleet.length == 0 && player.points > 1) {
        cancelAnimationFrame(animationId)
        player.win = true
        displayWin()
    } else if (alienFleet[0].y >= 125) {
        cancelAnimationFrame(animationId)
        player.win = true
        displayLoss()
    }
}

//filter for lowest x on existing aliens
const getLowestX = () => {
    let currentLowest = alienFleet[0].x
    for (i = 0; i < alienFleet.length; i++){
        if (alienFleet[i].x < currentLowest) {
            currentLowest = alienFleet[i].x
        }
    }
    return currentLowest
}

const getHighest = () => {
    let currentHighest = 0   
    for (i = 0; i < alienFleet.length; i++){
        if (alienFleet[i].x > currentHighest) {
            currentHighest = alienFleet[i].x
        }
    }
    return currentHighest
}

let animationId
const animate = () => {
    animationId = requestAnimationFrame(animate)
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.clearRect(0, 0, game.width, game.height)
    // render our player
    checkWin()
    detectMissileHit()
    if (!player.win) {
        player.render()
        for (i = 0; i < barriers.length; i++){
        barriers[i].render()
        }
        for (i = 0; i < alienFleet.length; i++){ 
        alienFleet[i].render()
        }
        alien.move()
        missiles.forEach((missile) => {
            missile.render()
            missile.update()   
        })
        alien.shoot()   
    }
    aliensRemaining.innerText = alienFleet.length
    counter++
}
// add event listener for player movement
document.addEventListener('keydown', (event) => {
    event.preventDefault()
    player.move(event.key)
})
// document.addEventListener('keyup', (event) => shootMissile(event.key, player))
document.addEventListener('click', (event) => {
    if (event.target === document.getElementById('restartButton')) {
        gameEnd.classList.add('hidden')
        init()
        gameLoop()
    } else if (event.target === document.getElementById('startButton')) {
        init()
        gameLoop()
    }   
})