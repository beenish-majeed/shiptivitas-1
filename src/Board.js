import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

const LANE_STATUS = {
  backlog: 'backlog',
  inProgress: 'in-progress',
  complete: 'complete',
};

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: {
        backlog: this.getClients(),
        inProgress: [],
        complete: [],
      },
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };

    this.drake = null;
  }

  componentDidMount() {
    this.drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);

    this.drake.on('drop', this.handleDrop);
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
      this.drake = null;
    }
  }

  getLaneIds = ref => {
    if (!ref.current) return [];
    return Array.from(ref.current.children)
      .map(child => child.dataset.id)
      .filter(Boolean);
  };

  handleDrop = (element, target) => {
    if (!target) return;

    // 1. Read the new order from the DOM Dragula just changed
    const ids = {
      backlog: this.getLaneIds(this.swimlanes.backlog),
      inProgress: this.getLaneIds(this.swimlanes.inProgress),
      complete: this.getLaneIds(this.swimlanes.complete),
    };

    // 2. Revert Dragula's DOM change so React owns the DOM again.
    //    cancel(true) = revert + emit 'cancel' (NOT 'drop'), so no recursion.
    this.drake.cancel(true);

    // 3. Let React do the real move
    this.setState(prev => {
      const clientMap = {};
      [
        ...prev.clients.backlog,
        ...prev.clients.inProgress,
        ...prev.clients.complete,
      ].forEach(c => {
        clientMap[c.id] = c;
      });

      const buildLane = (laneIds, status) =>
        laneIds
          .map(id => clientMap[id])
          .filter(Boolean)
          .map(c => ({ ...c, status }));

      return {
        clients: {
          backlog: buildLane(ids.backlog, LANE_STATUS.backlog),
          inProgress: buildLane(ids.inProgress, LANE_STATUS.inProgress),
          complete: buildLane(ids.complete, LANE_STATUS.complete),
        },
      };
    });
  };

  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access'],
    ].map(d => ({
      id: d[0],
      name: d[1],
      description: d[2],
      status: 'backlog',
    }));
  }

  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    const { backlog, inProgress, complete } = this.state.clients;
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}