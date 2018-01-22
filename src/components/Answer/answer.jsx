import React, { Component } from 'react';
import styles from './style.css';

export default class Answer extends Component {
  handleClick(e) {
    e.preventDefault();
    this.props.changeSelection(this.props.order);

    e.target.children[0].checked = true;
  }

  render() {
    let classes = `${styles.answer}`;

    classes += (this.props.selected === true) ? ` ${styles.selected}` : '';
    classes += (this.props.correct === true) ? ` ${styles.correct}` : '';

    return (
      <li className={classes} onClick={this.handleClick.bind(this)}>
        <input type="radio" name={this.props.id} disabled/>
        {this.props.value}
      </li>
    );
  }
}
