import React from 'react';
import Peer from 'peerjs'; 

class Create extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            errorMessage : null
        }
        this.createPeer = this.createPeer.bind(this);
    }

    /**
     * Create own peer object and sets it in the App component
     */
    createPeer() {
        try{
            var peer = new Peer(); 
            peer.on('open', () => {
                this.props.setLocal(peer); 
            });
        }
        catch(error){
            this.setState({ errorMessage : "Impossible to create a new peer"})
        }
    }

    /**
     * The welcome page with the button that creates the peer
     * @returns the html for the first page that the user sees
     */
    render() {
        return (
            <div className="Create">
                <br />
                <p className="error">{this.state.errorMessage}</p>
                <h1 className='welcome'>WELCOME TO CONNECT 4</h1>
                <p>Drop your discs into the columns of the game grid and make a line <br />of at least four chips either vertically, diagonally, or horizontally before your opponent!</p>
                <br />
                <input className="play" type="button" onClick={ this.createPeer } value="Play" />
                <br />
            </div>
        )
    }
}

export default Create