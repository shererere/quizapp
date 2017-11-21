import React, { Component } from 'react';
import styles from './style.css';

export default class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <p>Made by Mateusz Żochowski & Rafał Spiżewski</p>
      </footer>
    );
  }
}
