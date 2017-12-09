import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import settings from './settings.svg'; // eslint-disable-line no-unused-vars
import logout from './logout.svg'; // eslint-disable-line no-unused-vars

export default class Icon extends Component {
  render() {
    let iconElement = null;

    switch (this.props.icon) {
      case 'settings':
        iconElement = { settings };
        break;
      case 'logout':
        iconElement = { logout };
        break;
      default:
        console.log('error');
    }

    return (
      <span>
        {iconElement}
      </span>
    );
  }
}
