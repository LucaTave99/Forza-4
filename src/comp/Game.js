import React from 'react';
import 'peerjs'; 
import Board from './Board.js';
import PopUp from "./PopUp";

class Game extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      turn : this.props.turnPeer,   // says whose turn it is
      local : this.props.localPeer,   // the Peer object
      dataConnection : this.props.connection,   //the DataConnection object
      turnString : null,  //text that let the player know whose turn it is
      board: Array(6).fill(null).map( x => Array(7).fill(null)),  // game board
      localColor : null,  //color of the peer
      opponentColor : null,   //color of the opponent
      isVictory : null,   // indicates the end of the game
      victoryWindow: false,   // helps to control the popup window
      errorMessage : null, 
      peerDisconnectMessage : null  // message if the other user disconnect
    }
    this.sendMove = this.sendMove.bind(this); 
    this.handleClick = this.handleClick.bind(this); 
    this.cellsUpdate = this.cellsUpdate.bind(this); 
    this.controlVictory = this.controlVictory.bind(this); 
    this.togglePop = this.togglePop.bind(this);
    this.playNewGame = this.playNewGame.bind(this);
  }

  /**
   * Sets the local and opponent colors and handle some events
   */
  componentDidMount() {
    if(this.state.turn){
      this.setState({ localColor : 'red'});
      this.setState({ opponentColor : 'yellow'}); 
      this.setState({ turnString : 'Your turn'});
    }
    else{
      this.setState({ localColor : 'yellow'});
      this.setState({ opponentColor : 'red'}); 
      this.setState({ turnString : 'Opponent turn'});
    }
    // waits for the opponent move message
    this.state.dataConnection.on('data', (data) => { this.cellsUpdate(data[0], data[1]); }) 
    // waits for the disconnection of the other player
    this.state.dataConnection.on('close', () => {
    this.setState({ peerDisconnectMessage : "The other peer disconnected!"});
    if(!this.state.victoryWindow){
        this.togglePop();   // shows the popup window
      }
    })
    // waits for peerjs errors
    this.props.localPeer.on('error', (err) => {this.setState({ errorMessage : "Error with PeerJS!" });}); 
    // waits for the tab closing
    window.addEventListener("beforeunload", (ev) => 
    {  
        this.handleWindowClose(ev);
    });
  }

  /**
   * Closes the connection between the two peers
   */
  componentWillUnmount(){
    window.removeEventListener('beforeunload', this.handleWindowClose);
    this.state.dataConnection.close();
  }

  /**
   * Handles the closing of the tab 
   * @param {Event} ev the closing event
   */
  handleWindowClose(ev){
    ev.preventDefault();
    this.state.dataConnection.close();  // closes the connection
  }

  /**
   * Sets the correct turn and turnString
   * @param {Number} row the row of the clicked box
   * @param {Number} column the column of the clicked box
   */
  setTurnPlayer(row, column){
    if (this.state.turn){ 
      this.setState({ turn : false}); 
      this.setState({ turnString : 'Opponent turn'});
      this.sendMove(row, column);   // if it is the local player turn sends the move to the opponent
    }
    else{ 
      this.setState({ turn : true });  //imposta turno di gioco
      this.setState({ turnString : 'Your turn'});
    }
  }

  /**
   * Calls the DataConnection.send method with the move the player made
   * @param {Number} row the row of the clicked box
   * @param {Number} column the column of the clicked box
   */
  sendMove(row, column) {
    this.state.dataConnection.send([row, column]); 
  }

  /**
   * Handles the move of the player 
   * @param {Number} row the row of the clicked box
   * @param {Number} column the column of the clicked box
   */
  handleClick(row, column) {
    if(this.state.turn && this.state.isVictory === null){
      if(!this.state.board[0][column]){ //controllo se la colonna non è piena 
        this.cellsUpdate(row, column);
      }
    }
  }

  /**
   * Updates the game board with the moves
   * @param {Number} r the row of the box (not used)
   * @param {Number} c the column of the box
   */
  cellsUpdate(r, c) {
    var cells = this.state.board.slice(); 
    if(this.state.turn){
      var index = 0; 
      //controls what is the last empty row on the clicked column
      for(var i = 5; i >= 0; i-- ){ 
        if(cells[i][c] == null){
          cells[i][c] = this.state.localColor;
          index = i; 
          break;
        }
      }
    }
    else{
      for(i = 5; i >= 0; i-- ){
        if(cells[i][c] == null){
          cells[i][c] = this.state.opponentColor;
          index = i; 
          break; 
        }
      }
    }
    this.setState({ board : cells }); // updates the game board
    this.controlVictory(index, c) // calls the method to control if the game should end
  }

  /**
   * Controls if the game should end (victory or defeat and if the board is full)
   * @param {Number} row the row of the last box clicked
   * @param {Number} column the column of the last box clicked
   */
  controlVictory(row, column){
    var color = null;  // the color that needs to be controlled
    if (this.state.turn){
      color = this.state.localColor;
    }
    else {
      color = this.state.opponentColor
    }
    var victory = false; // support variable to control if someone won

    // checks every row and column
    for (var r = 5; r >= 0 && !victory; r--){
      for (var c = 0; c <= 6 && !victory; c++){

        if (this.state.board[r][c] === color){
          
          if (r >= 3 && !victory){
            //controls if there are four pawns in vertical
            if (this.state.board[r - 1][c] === color && this.state.board[r - 2][c] === color && this.state.board[r - 3][c] === color){
              victory = true; 
            }
          }
          if (c <= 4 && !victory){
            //controls if there are four pawns in horizontal
            if (this.state.board[r][c + 1] === color && this.state.board[r][c + 2] === color && this.state.board[r][c + 3] === color){
              victory = true; 
            }
          }
          if (c <= 3 && r >= 3 && !victory){
            //controls if there are four pawns in diagonal to the right
            if (this.state.board[r - 1][c + 1] === color && this.state.board[r - 2][c + 2] === color && this.state.board[r - 3][c + 3] === color){
              victory = true; 
            }
          }
          if (c >= 3 && r >= 3 && !victory){
            //controls if there are four pawns in diagonal to the left
            if (this.state.board[r - 1][c - 1] === color && this.state.board[r - 2][c - 2] === color && this.state.board[r - 3][c - 3] === color){
              victory = true; 
            }
          }
        }
      }
    }
    if(victory){
      if (this.state.turn){ 
        this.setState({ isVictory : 'VICTORY'});
        this.setTurnPlayer(row, column);  // sends the last move to the opponent to let him know that the player won
        
      }
      else{ 
        this.setState({ isVictory : 'DEFEAT'});
      }
      this.setState({ turnString : null});
      this.togglePop(); // shows the popup window
    }
    // if no one won
    else { 
      var boardFull = null;  // support variable to control if the board is full
      // checks the last row
      if (this.state.board[0][0] && this.state.board[0][1] && this.state.board[0][2] && this.state.board[0][3] && this.state.board[0][4] && this.state.board[0][5] && this.state.board[0][6]){ 
        boardFull = true;
      }
      if (boardFull){ 
        if (this.state.turn){ 
          this.setState({ isVictory : "Game Finished, it's a tie game."});
          this.setTurnPlayer(row, column);  // sends the last move to the opponent to let him know that the game ended
          
        }
        else{ 
          this.setState({ isVictory : "Game Finished, it's a tie game."});
        }
        this.setState({ turnString : null});
        this.togglePop(); // shows the popup window
      }
      else{ 
        this.setTurnPlayer(row, column); // if nobody won and the board is not full sends the move to the opponent
      }
    }      
  }

  /**
   * If the user decide to find another opponent brings back to the connection page
   */
  playNewGame(){
    this.props.gameEnd();
  }

  /**
   * Changes the visibility of the popup window
   */
  togglePop(){
    this.setState({victoryWindow: !this.state.victoryWindow});
   };

   /**
    * Shows the game board 
    * @returns the game board and all the needed informations
    */
  render() {   
    return (
      <div className="game">
        <p className="error">{this.state.errorMessage}</p>
        <p className={this.state.turnString === 'Your turn' ? "yourTurn" : "opponentTurn"}> {this.state.turnString} </p>
        <div className="game-board">
          <Board gameBoard = {this.state.board} handleMove = {this.handleClick} />
        </div>
        <p className='colorText'>Your color is: </p>
        <span className={'circle-' + this.state.localColor}></span>
        <br />
        <br />
        <br />
        {this.state.victoryWindow ? <PopUp newGame={this.playNewGame} peerDisconnect={this.state.peerDisconnectMessage} endGame={this.state.isVictory} toggle={this.togglePop}/> : null}
      </div>
    );
  }
}

export default Game
  