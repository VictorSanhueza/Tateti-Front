import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import Header from './components/header';
import Body from './components/body';

const header = document.getElementById('header')!;
const body = document.getElementById('body')!;


ReactDOM.createRoot(header).render(<Header/>);
ReactDOM.createRoot(body).render(<Body/>);