import React, { Component } from 'react';
import adminPage from '../AdminPage/adminpage.jsx';

class AdminMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
    };
  }

  componentWillMount() {
    this.props.addHistoryToState(this.props.history);
  }

  render() {
    return (
      <h2>Witaj w panelu administracyjnym!</h2>
    );
  }
}

export default adminPage(AdminMainPage);
