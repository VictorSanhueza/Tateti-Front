import React, { useEffect, useState } from "react";
import { Player } from "./player";
import "./board.css"
import Square from "./square";
import { Game } from "./game";
import FormButton from "../common/FormButton";
import axios from "axios";

export default function Board(props: {game: Game | undefined, backToHome : any}) {
    const [player1, setPlayer1] = useState<Player>()
    const [player2, setPlayer2] = useState<Player>()
    const [token, setToken] = useState(props.game?.token)
    const [game_id, setGameId] = useState(props.game?.id)
    const [square, setSquare] = useState()
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [gameCanStart, setGameCanStart] = useState(false)
    const [game, setGame] = useState<Game>(props.game!)
    const [plays, setPlays] = useState(0)
    const [turn, setTurn] = useState<number>(props.game?.turn!)

    const boardSquares = [0,1,2,3,4,5,6,7,8]

    let check:NodeJS.Timer
    let checkTurn:NodeJS.Timer

    function calculateWinner(squares: any[]) {
        const lines = [
          //Left to right
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          //Up to down
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          //Diagonals
          [0, 4, 8],
          [2, 4, 6]
        ];
        //Game is won if all three squares on a line are the same
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }

    useEffect(() =>{
        if (props.game?.player_1_id && props.game?.player_2_id && player1! === undefined && player2! === undefined) {
            getPlayer(1)
            getPlayer(2)
        }else if(props.game?.player_1_id && props.game?.player_2_id === null && player1 === undefined) {
            getPlayer(1)
            setTimer()
        }
    })

    useEffect(() => {
        if(game.player_2_id !== null && turn === null){
            getPlayer(2);
            setTurn(1)
        }

        },[game.player_2_id !== null && window.location.port === "3001"])

    useEffect(() =>{
        if(turn === 1 ) setTimerTurn()
    },[turn !== null  && window.location.port === "3001"])


    const setTimer = () => {
        check = setInterval(
            () => {
                checkGame(check)},
            1000
        );  
    }
    
    const setTimerTurn = () => {
        checkTurn = setInterval(
            () => {
                checkPlayerTurn(checkTurn)},
            1000
        );  
    }
    
    const handleClick = (i: any) => {

        const squaress = squares!.slice()
        if (squaress[i]) {
            return
        }

        let play = plays + 1
        setPlays(play)
        squaress[i] = turn === 1 ? "X" : "O"
        setSquares(squaress)
        // setTurn(turn! === 2 ? 1 : 2)
        let winner = calculateWinner(squaress)
        setGamePlay(i, winner)

        if(winner === "O"){
            alert("ganador jugador 2")
            clearInterval(check)
            clearInterval(checkTurn)
            return
        }else if(winner === "X"){
            alert("ganador jugador 1")
            clearInterval(check)
            clearInterval(checkTurn)
            return
        }
    }

    const setGamePlay = (i: any, winner:string) => {
        axios.put("http://localhost:3000/games/" + props.game?.id + "/",
         {token: token, game_play: i, play: plays, winner: winner}
        ).then((response) => {
            setGame(response.data.game)
            setTimerTurn()
        })
    }
    
    const checkPlayerTurn = (check: NodeJS.Timer) => {
        axios.get("http://localhost:3000/games/" + game_id + "/checkGame/" + turn)
        .then((response) => {
            if (response.data.turn === turn) {
                // setTurn(response.data.game.turn)
                let board_plays = response.data.board_plays.split("")
                setSquares(board_plays.map((s: any) =>s === "U" ? null : s))
                clearInterval(checkTurn)
                if (response.data.winner) {
                    alert("El jugador:" + response.data.winner + " ha ganado.")
                }
                alert("Es su turno.")
            } 
            // if (response.data.game.turn) {
                
            // }                     
        })      
    }

    const checkGame = (check: NodeJS.Timer) => {
        axios.get("http://localhost:3000/games/" + game_id).then((response) => {
            if (response.data.player_1_id && response.data.player_2_id) {
                setGame(response.data)
                clearInterval(check)
                alert("Se ha unido un jugador a la partida")
            }
        })      
    }

    const getPlayer = (player:number) => {
        const id = player === 1 ? game?.player_1_id! : game?.player_2_id!
        axios.get("http://localhost:3000/players/" + id)
            .then((response) => {
                if (response.data.id) {
                    let port: number = player
                    let playerModel: Player = {
                        id :response.data.id,
                        name : response.data.name,
                        last_name : response.data.last_name,
                        token : response.data.token,
                        port : port
                    }
                    if (player === 1) {                        
                        setPlayer1(playerModel)
                        // setTurn(port)
                    }else{
                        setPlayer2(playerModel)
                        // setTurn(port)
                        setGameCanStart(true)
                    }
                }
            })
    }

    const renderSquare = (s: number) => {
        return(
            <Square 
                value={squares[s]}
                playerMove = {() => handleClick(s)}
            />
        )
    }

    function Square(props: any){
        
        return(
            <button className="square" onClick={props.playerMove} data-testid="board-square">
                {props.value}
            </button>
        )
    }

    const goHome = () => {
        finishGame();
        props.backToHome(true)
    }

    const finishGame = () => {
        axios.put("http://localhost:3000/games/" + props.game?.id + "/", {token: token, game_state: false}).then(() =>{
            clearInterval(check)
            clearInterval(checkTurn)
        })
    }

    return(
        <div className="container">
            <div className="container">
                <p>Jugador 1: {player1?.name! + " "+ player1?.last_name!}</p>
                { (player2! === undefined) ?
                    <p>Jugador 2: Esperando jugador</p>
                :   <p>Jugador 2: {player2!.name + " " + player2!.last_name}</p>
                }
                {/* {game.turn === 1 ? 
                    (<p>Turno del jugador: {player1!.name + " "+ player1!.last_name!}</p>)
                : null}
                {game.turn === 2 ? 
                    (<p>Turno del jugador: {player2!.name + " "+ player2!.last_name!}</p>)
                : null} */}
            </div>
            <div className="board">
            {boardSquares.map((s) => {
                return(renderSquare(s))
            })}           
            </div>
            <FormButton label="Volver al inicio" onClick={goHome}></FormButton>
        </div>
        
    )
}
