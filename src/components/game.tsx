import React from "react";
import { Player } from "./player";

export interface Game {
    id: string,
    player_1_id: number,
    player_2_id: number,
    token: string,
    game_state: boolean,
    turn: number,
    board_plays: number
} 
