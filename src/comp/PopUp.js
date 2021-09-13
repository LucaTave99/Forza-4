import React, { Component } from "react";

export default class PopUp extends Component {
    /**
     * Creates a popup that let the user decide if he wants to return to the connection page
     * @returns the popup with victory or defeat and/or if the other peer disconnected
     */
    render() {
        return (
            <div className="modal">
                <div className="modal_content">
                    <span className="close" onClick={this.props.toggle}>&times;</span>
                    <p className='disconnection'>{this.props.peerDisconnect}</p>
                    <h1 className={this.props.endGame==='VICTORY' ? "victory" : "defeat"}>{this.props.endGame}</h1>
                    <input className='newGame' type="button" onClick={this.props.newGame} value='Find another player'/>
                    <br />
                </div>
            </div>
        );
    }
}