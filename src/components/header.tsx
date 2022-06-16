import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

export default function header() {
    return(
        <header>
            <div className="navbar navbar-dark bg-dark box-shadow">
                <div className="container d-flex justify-content-between">
                    <a href="none" className="navbar-brand d-flex align-items-center">
                        <strong>Bienvenido a TaTeTi</strong>
                    </a>    
                </div>
            </div>
        </header>
    );
}