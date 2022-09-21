"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.state = void 0;
var state = {
    //// DATOS INICIALES ////
    data: {
        currentGame: {
            computerPlay: "",
            myPlay: ""
        },
        history: {
            computer: 0,
            me: 0
        }
    },
    //// INICIAR CON EL ESTADO GUARDADO ////
    initState: function () {
        var localData = localStorage.getItem("saved-data");
        if (localData !== null) {
            this.setState(JSON.parse(localData));
        }
    },
    //// GETTER ////
    getState: function () {
        return this.data;
    },
    //// SETER ////
    setState: function (newState) {
        this.data = newState;
    },
    //// SETEA MOVIMIENTOS DE LAS MANOS ////
    setMove: function (move) {
        var options = ["piedra", "papel", "tijera"];
        var currentState = this.getState();
        currentState.currentGame.myPlay = move;
        var randomMove = options[Math.floor(Math.random() * 3)];
        var pcMove = (currentState.currentGame.computerPlay = randomMove);
        this.pushToHistory();
    },
    //// DECIDE SI GANA, PIERDE O EMPATA ////
    whoWins: function () {
        var currentState = this.getState();
        var myPlay = currentState.currentGame.myPlay;
        var computerPlay = currentState.currentGame.computerPlay;
        var ganeConTijeras = myPlay == "tijera" && computerPlay == "papel";
        var ganeConPiedra = myPlay == "piedra" && computerPlay == "tijera";
        var ganeConPapel = myPlay == "papel" && computerPlay == "piedra";
        var pcGanaTijeras = myPlay == "papel" && computerPlay == "tijera";
        var pcGanaPiedra = myPlay == "tijera" && computerPlay == "piedra";
        var pcGanaPapel = myPlay == "piedra" && computerPlay == "papel";
        var win = [ganeConTijeras || ganeConPiedra || ganeConPapel].includes(true);
        var lose = [pcGanaPapel || pcGanaPiedra || pcGanaTijeras].includes(true);
        var result;
        if (win == true) {
            result = "win";
        }
        else if (lose == true) {
            result = "lose";
        }
        else {
            result = "tie";
        }
        return result;
    },
    //// GUARDA LOS PUNTOS SEGUN EL RESULTADO DE WHO WINS ////
    pushToHistory: function () {
        var result = this.whoWins();
        var currentState = this.getState();
        var computerScore = currentState.history.computer;
        var myScore = currentState.history.me;
        if (result == "win") {
            this.setState(__assign(__assign({}, currentState), { history: {
                    computer: computerScore,
                    me: myScore + 1
                } }));
        }
        if (result == "lose") {
            this.setState(__assign(__assign({}, currentState), { history: {
                    computer: computerScore + 1,
                    me: myScore
                } }));
        }
        if (result == "tie") {
            this.setState(__assign(__assign({}, currentState), { history: {
                    computer: computerScore,
                    me: myScore
                } }));
        }
        //// SETEA ESTE NUEVO ESTADO EN EL LOCALSTORAGE ////
        localStorage.setItem("saved-data", JSON.stringify(state.data));
    }
};
exports.state = state;
