function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max, min) + min)
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            logMessages: [],
            winner: null,
            currentRound: 0,
        }
    },
    watch: {
        playerHealth(value) {
            if(value <= 0 && this.monsterHealth <= 0) {
                // a draw
                this.winner  = 'Draw'
            } else if (value <= 0) {
                // monster winner
                this.winner  = 'Monster'
            }
        },
        monsterHealth(value) {
            if(value <= 0 && this.playerHealth <= 0) {
                // a draw
                this.winner  = 'Draw'
            } else if (value <= 0) {
                // player winner
                this.winner  = 'Player'
            }
        }
    },
    methods: {
        monsterAttack() {
            const attackValue = getRandomNumber(9, 16)
            this.playerHealth -= attackValue
            this.addLogBattles('Monster', 'attack and deals', attackValue)
        },
        playerAttack() {
            this.currentRound++
            const attackValue = getRandomNumber(7, 12)
            this.monsterHealth -= attackValue
            this.addLogBattles('Player', 'attack and deals', attackValue)
            this.monsterAttack()
            
        },
        specialAttack() {
            this.currentRound++
            const attackValue = getRandomNumber(15, 20)
            this.monsterHealth -= attackValue
            this.addLogBattles('Player', 'special-attack', attackValue)
            this.monsterAttack() 
        },
        addLogBattles(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        },
        healPlayer() {
            this.currentRound++
            const healValue = getRandomNumber(9, 18)
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100
            } else {
                this.playerHealth += healValue
            } 
            this.addLogBattles('Player', 'heals himself for', healValue)
            this.monsterAttack()
        },
        newGame() {
            this.playerHealth = 100
            this.monsterHealth = 100
            this.logMessages = []
            this.winner = null
            this.currentRound = 1
        },
        styleAction(action) {
            if (action === 'Player') {
                return { color: 'blueviolet' }
            } else {
                return { color: 'goldenrod' }
            }
        },
        styleValue(type) {
            if (type.includes("heals")) {
                return { color: 'forestgreen' }
            } else {
                return { color: 'brown' }
            }
        },
        surrender() {
            this.winner = 'Monster'
            this.playerHealth = 0
        }
    },
    computed: {
        updateMonsterBar() {
            if (this.monsterHealth < 0) {
                return  { width: '0%' }
            }

            return { width: this.monsterHealth + '%' }
        },
        updatePlayerBar() {
            if (this.playerHealth < 0) {
                return  { width: '0%' }
            }

            return { width: this.playerHealth + '%' }
        },
        availableSpecial() {
            return this.currentRound % 3 !== 0 
        },
        battleResult() {
            if (this.winner === 'Player') {
                return 'You won!'
            } else if (this.winner === 'Monster') {
                return 'You lost!'
            } else {
                return "It's a draw!"
            }
        },
    }
})
app.mount('#game')