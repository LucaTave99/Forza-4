import React from 'react';
import 'peerjs';

class Connection extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            opponentId : null, // the id the user wrote in the text box
            errorMessage : null
        }
        this.connectToOpponent = this.connectToOpponent.bind(this); 
        this.handleChange = this.handleChange.bind(this);
        this.receiveConnection = this.receiveConnection.bind(this); 
    }

    /**
     * Calls the on('connection) and on('error') methods of Peerjs
     */
    componentDidMount() {
        this.props.localPeer.on('connection', (conn) => {
            conn.on('open', () => {              
                this.receiveConnection(conn); // handles the connection from another peer
            });
        });
        this.props.localPeer.on('error', (err) => {
            this.setState({ errorMessage : "Error with PeerJS!" }); 
        }); 
    }

    /**
     * Prevent the user to accept incoming connections
     */
    componentWillUnmount() {
        this.props.localPeer.off('connection');        
    }

    /**
     * Saves the id wrote in the text box in the opponentId variable
     * @param {Event} event if the user wrote something in the text box
     */
    handleChange(event) {
        this.setState({ opponentId: event.target.value});
    }

    /**
     * Tries to connect to the other peer
     */
    connectToOpponent() {
        //the DataConnection beetween the two peers
        var conn = this.props.localPeer.connect(this.state.opponentId);
        // if the player didn't write anything
        if (conn.peer){ 
            // waits for the established connection message from the other peer 
            conn.on('data', (msg) => {                
                if (msg === 'established'){     // if the message arrives
                    this.props.setTurn(true);    // who insert the id starts the game
                    this.props.setConnection(conn);     // sets the opponent in the App component
                }
            });        
        }
        else{
            this.setState({ errorMessage : "Write a peer id!"});
        }    
    }
   
    /**
     * Handles the incoming connection and sends the established message to the other peer, then sets the parameters in App
     * @param {import('peerjs').DataConnection} connection the incoming DataConnnection
     */
    receiveConnection(connection) {  
        connection.send('established');
        this.props.setTurn(false);
        this.props.setConnection(connection); 
    }

    /**
     * The connection page with the text box to insert the id of another player
     * @returns the html for the second page
     */
    render(){ 
        return(
            <div className = 'Connection'>
                <br />
                <p className="error">{this.state.errorMessage}</p>
                <h1>Insert the id of another player:</h1>
                <br />
                <input type="text" value={this.state.opponentId} onChange={this.handleChange} size="35"/>
                <br /> <br /> <br />
                <input className="enter" type="button" onClick = { this.connectToOpponent } value="Enter"/>
                <br /><br />
                <p className="peerId"><b>Your peer id:</b> {this.props.localPeer.id} </p>
            </div>
        )
    }
}

export default Connection