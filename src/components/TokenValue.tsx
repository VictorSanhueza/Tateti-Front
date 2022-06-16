import React, { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import DangerLabel from "../common/DangerLabel"
import { useErrorHandler } from "../common/ErrorHandler"
import ErrorLabel from "../common/ErrorLabel"
import FormButton from "../common/FormButton"
import FormInput from "../common/FormInput"
import { Player } from "./player"

export default function TokenValue(props: {onReturn: any, sessionPlayer: Player}) {
    const [tokenOption, setTokenOption] = useState<string>()
    const [newToken, setNewToken] = useState<string>("")
    const [player, setPlayer] = useState<Player>()

    const errorHandler = useErrorHandler()

    useEffect(() => {
        setPlayer(props.sessionPlayer)
    },[])

    const handleClick = (choice: boolean, e:any) => {
        e.preventDefault()
        if (choice) {
            setNewToken(player!.token)
            setTokenOption("1")
        } else {
            setNewToken("")
            setTokenOption("2")
        }
    }

    const handleJoinGame = (e: any) => {
        e.preventDefault()
        errorHandler.cleanRestValidations()
        if (!newToken) {
            errorHandler.addError("tokenValue", "No puede estar vacío")
        }
        if (errorHandler.hasErrors()) {
            return
        }
        props.onReturn(newToken)
    }

    return(
        <div className="container">
            <div>
                <div className="row">
                    <div className="col-md-2"></div>
                    <button
                        onClick={(e) => handleClick(true, e)}
                        className="btn btn-success col-md-3">
                        Nueva Partida
                    </button>
                    <button
                        onClick={(e) => handleClick(false, e)}
                        className="btn btn-success col-md-3 offset-md-2">
                        Partida Existente
                    </button>
                </div>            
            </div>
            <br/>
            {tokenOption === "1" ? (
                <form onSubmit={(e) => handleJoinGame(e)}>
                    <FormInput
                        label="Token para invitar a un jugador"
                        leyenda="Token"
                        errorHandler={errorHandler}  
                        name="tokenValue"
                        value={player!.token}
                        onChange={(e) => setNewToken(e.target.value)}
                    />
                    <DangerLabel message={errorHandler.errorMessage}/>
                    <br/>           
                    <button className="btn btn-success">Ingresar</button>
                </form>
            ) : null }
            {tokenOption === "2" ? (
                <form onSubmit={(e) => handleJoinGame(e)}>
                    <FormInput
                        label="Ingrese el token para unirse a una partida"
                        leyenda="Token"
                        errorHandler={errorHandler}
                        name="tokenValue"
                        value={newToken}
                        onChange={(e) => setNewToken(e.target.value)}
                    />
                    <DangerLabel message={errorHandler.errorMessage}/>
                    <br/>
                    <button className="btn btn-success">Unirse</button>
                </form>            
            ) : null }                      
        </div>
    )
}