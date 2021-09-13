import React from 'react';

class Square extends React.Component {
  /**
   * Creates the box in which the player can enter his pawn
   * 
   * @returns a clickable button
   */
  render() {
    // the classname helps to identify the right css to assign at the button
    return (
      <button 
      className={this.props.value ? "square-" + this.props.value : "square"} 
      onClick = {() => this.props.onClick()} >
      </button>
    );
  }
}

export default Square