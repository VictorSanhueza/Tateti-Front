import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.css";
import Register from "./register"
import PlayerList from "./playerList"
import axios from "axios";
import Board from "./board";
import { useErrorHandler } from "../common/ErrorHandler";
import { Game } from "./game";
import { Player } from "./player";
import "./board.css"

export default function Body() {    
    const [showHome, setShowHome] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showPlayerList, setShowPlayerList] = useState(false);
    const [showBoard, setShowBoard] = useState(false)
    const [token, setToken] = useState("")
    const [game, setGame] = useState<Game>()


    const errorHandler = useErrorHandler()


    const register = () => {
        setShowRegister(true);
        setShowPlayerList(false);
    }

    const login = () => {
        setShowPlayerList(true);
        setShowRegister(false);
    }
        
    const hideHome = () => {
        setShowHome(false);
    }

    const startGameWith = (newToken: string, player: Player) => {

        try {
            gameRequest(newToken, player)           
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const joinGame = (player: number) => {
        if (game) {
            game.player_2_id = player
        }
        hideHome()
        setBoard()
    }

    const startGame = (player: number) => {
        if (game) {
            game.player_1_id = player   
        }
        setBoard()
    }

    const setBoard = () => {
        setShowBoard(true)
    }

    const hideGame= (value : boolean) => {
        
        setShowHome(true)
        setShowPlayerList(false)    
        setShowRegister(false)
        setShowBoard(false)
    }

    function gameRequest(token: string, player: Player){
        axios.post("http://localhost:3000/games", {token: token, player_token: player.token}).then((response: any) => {
            if (response) {
                let newGame : Game = 
                {   token: response.data.game.token,
                    id: response.data.game.id, 
                    player_1_id: response.data.game.player_1_id , 
                    player_2_id: response.data.game.player_2_id,
                    game_state: response.data.game.game_state,
                    board_plays: response.data.game.board_plays,
                    turn: response.data.game.turn
                }   


                setShowPlayerList(false)
                setShowRegister(false)
                setGame(newGame)

                if (game && newGame.player_1_id) {
                    startGame(newGame.player_1_id)
                } else {
                    joinGame(newGame.player_2_id)
                }
            }
        }).catch((response) => {
            alert(response.response.data.message);
        })
    }

    return (
        <div className="container" id="bienvenido">
            <h1 className="jumbotron-heading">Bienvenido a Ta-Te-Ti</h1>
            {showHome ? (
                <div>
                    <div className="row">
                            <div className="col-md-2"></div>
                            <button
                                onClick={register}
                                className="btn btn-success col-md-3">
                                Registrarse
                            </button>
                            <button
                                onClick={login}
                                className="btn btn-success col-md-3 offset-md-2">
                                Ingresar
                            </button>
                    </div>            
                </div>
            ) : null}
            <br/>
            <br/>
            <br/>
            {showRegister ? (
                <Register getGame={startGameWith}/>
            ) : null}
            {showPlayerList ? (
                <PlayerList getGame={startGameWith}/>
            ) : null}
            {showBoard ? (
                <Board game={game} backToHome={hideGame}/>                  
            ) : null}
        </div>

    );      

}

