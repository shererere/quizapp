import React, { Component } from 'react';
import Icon from '../Icon/icon.jsx';
import styles from './style.css';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: this.props.icon,
      message: this.props.message,
    };

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal(event) {
    console.log(this.state);

    // NOTE: xdxdxdxdx XD
    // NOTE nie zawsze klikam w to co trzeba i albo znika cały modal, albo tylko jego zawartośc
    event.target.parentNode.parentNode.parentNode.style.display = 'none'; // eslint-disable-line no-param-reassign
    // TODO: unmount this component
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.modal}>
          <div className={styles.close_button} onClick={this.closeModal}>
            <Icon width="16" height="16" icon="close" />
          </div>
          <div className={styles.icon_wrapper}>
            <Icon width="64" height="64" icon={this.state.icon} />
          </div>
          <div className={styles.message_wrapper}>
            <h2 className={styles.message_title}>{this.props.title}</h2>
            <p className={styles.message_content}>{this.state.message}</p>
          </div>
        </div>
      </div>
    );
  }
}
