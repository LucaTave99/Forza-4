import React from 'react'; 
import 'peerjs';
import Game from './comp/Game.js'; 
import Connection from './comp/Connection.js';
import Create from './comp/Create.js';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            local : null, // peer
            dataConnection : null, // connection with the other player
            turn : null // if the player is first to play or not
        }
        this.setPeer = this.setPeer.bind(this);
        this.setDataConnection = this.setDataConnection.bind(this);
        this.setTurnPlayer = this.setTurnPlayer.bind(this);
        this.deleteConnection = this.deleteConnection.bind(this);
    }
    
    /**
     * Sets the peer object created in the Create component
     * @param {Peer} localPeer the Peer object
     */
    setPeer(localPeer){ 
        this.setState({ local: localPeer });
    }

    /**
     * Sets the DataConnection object created in the Connection component
     * @param {import('peerjs').DataConnection} conn the new DataConnection object
     */
    setDataConnection(conn){
        this.setState({ dataConnection : conn });
    }

    /**
     * Sets the turn specifying if the player is the first to play
     * @param {Boolean} isTurn if the player is first
     */
    setTurnPlayer(isTurn){
        this.setState({ turn : isTurn });
    }

    /**
     * Sets as null the DataConnection object and the turn so that the player can return to the Connection page
     */
    deleteConnection(){
        this.setState({ dataConnection : null});
        this.setState({ turn : null});
    }

    /**
     * Returns the correct component based on which properties the user has already set
     * 
     * @returns the correct component
     */
    render() {
        if(!this.state.local){  // if the peer hasn't already been created
            return ( <Create setLocal={this.setPeer}/> );
        }
        else if (!this.state.dataConnection){   // if the connection hasn't been established
            return ( <Connection localPeer={this.state.local} setConnection = {this.setDataConnection} setTurn = {this.setTurnPlayer} /> ); 
        }
        else {  // returns the game if the peer and the connection are set
            return ( <Game gameEnd={this.deleteConnection} connection ={this.state.dataConnection} localPeer={this.state.local} turnPeer={ this.state.turn}/> ); 
        }
    }
}

export default App