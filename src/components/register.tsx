import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import Form from "../common/Form"
import FormInput from "../common/FormInput"
import {useErrorHandler} from "../common/ErrorHandler"
import DangerLabel from "../common/DangerLabel"
import ErrorLabel from "../common/ErrorLabel"
import { Player } from "./player"
import axios from "axios"
import TokenValue from "./TokenValue"

export default function Register(props: any) {
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [player, setPlayer] = useState<Player>()

    const errorHandler = useErrorHandler()

    const registerClick = () => {
        if (!name) {
            errorHandler.addError("name", "No puede estar vacío")
        }
        if (!lastName) {
            errorHandler.addError("lastName", "No puede estar vacío")            
        }

        if (errorHandler.hasErrors()) {
            return
        }

        try {
            newPlayer(name, lastName)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }
    
    async function newPlayer(name: string, lastName: string) : Promise<Player> {
        const res =  (await axios.post("http://localhost:3000/players", {
            name: name, last_name: lastName
        })).data as Player
        setPlayer(res)
        return res
    }    

    const tokenOption = (token: string) => {
        props.getGame(token, player);
    }

    return(
        <div className="container">
            {player ? (
                <div className="container">
                    <TokenValue onReturn={tokenOption} sessionPlayer={player}/>
                </div>
            ) : <Form>
                    <FormInput 
                        label="Nombre"
                        name="name"
                        value={name}
                        errorHandler={errorHandler} 
                        leyenda="Ingrese su nombre"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <FormInput
                        label="Apellido" 
                        name="lastName"
                        value={lastName}
                        errorHandler={errorHandler}
                        onChange={(e) => setLastName(e.target.value)}
                        leyenda="Ingrese su apellido"
                    />
                    <DangerLabel message={errorHandler.errorMessage}/>
                    <br/>
                    <button className="btn btn-success" onClick={registerClick}>
                        Registrarse
                    </button>
                </Form>
            }           
        </div>
    )
}