import React from 'react';
import './Card.css';

export default class Card extends React.Component {
  render() {
    const { id, name, description, status } = this.props;
    return (
      // data-id is how Board reads the order back from the DOM
      <div className={`Card Card-${status}`} data-id={id}>
        <div className="Card-title">{name}</div>
        <div className="Card-description">{description}</div>
      </div>
    );
  }
}