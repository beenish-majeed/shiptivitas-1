import React from 'react';
import Card from './Card';
import './Swimlane.css';

export default class Swimlane extends React.Component {
  render() {
    const cards = this.props.clients.map(client => (
      <Card
        key={client.id}           // stable key: required for React to move nodes
        id={client.id}
        name={client.name}
        description={client.description}
        status={client.status}
      />
    ));

    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{this.props.name}</div>
        {/* ref goes on the element that directly contains the cards */}
        <div className="Swimlane-dragColumn" ref={this.props.dragulaRef}>
          {cards}
        </div>
      </div>
    );
  }
}