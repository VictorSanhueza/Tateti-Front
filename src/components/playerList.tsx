import axios from "axios"
import React, {useState, useEffect} from "react"
import { Dropdown } from "react-bootstrap"
import DropdownItem from "react-bootstrap/esm/DropdownItem"
import DropdownMenu from "react-bootstrap/esm/DropdownMenu"
import DropdownToggle from "react-bootstrap/esm/DropdownToggle"
import { useErrorHandler } from "../common/ErrorHandler"
import {Player} from "./player"
import TokenValue from "./TokenValue"

export default function PlayerList(props: any) {
    const[playerList, setPlayerList] = useState<Player[]>([])
    const[player, setPlayer] = useState<Player>()

    const errorHandler = useErrorHandler()

    const loadPlayersList = async () => {
        try {
            const playerList = await getPlayerList()
            if (playerList.length > 0) {
                setPlayerList(playerList)
            }
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    async function getPlayerList() : Promise<Player[]> {
        const res =  (await axios.get("http://localhost:3000/players/"
        )).data as Player[]
        return res
    }

    useEffect(() => {
        void loadPlayersList()
    }, [])

    const selectPlayer = (p: Player) => {
        setPlayer(p)
    }

    const tokenOption = (newToken: string) => {
        props.getGame(newToken, player)
    }

    return(
        <div className="container">
            <Dropdown>
                <DropdownToggle>
                    Seleccione su perfil
                </DropdownToggle>
                <DropdownMenu>
                    {playerList.length > 0 ? playerList.map((p) => {
                        return(
                        <DropdownItem 
                            key={p.id}
                            value={p.id}
                            onClick={() => selectPlayer(p)} >
                                {p.id + " - " + p.name + " " + p.last_name}
                        </DropdownItem>
                        );
                    }): 
                        <DropdownItem>
                                Sin resultados
                        </DropdownItem>}
                </DropdownMenu>
            </Dropdown>
            <br/>
            {player ? (
                <TokenValue 
                    onReturn={tokenOption} sessionPlayer={player}
                />
            ) : null}
        </div>
    )
}