import React, { Component } from 'react';

// import LoginPage from '../LoginPage/loginpage.jsx';
// import IndexPage from '../IndexPage/indexpage.jsx';
import QuizPage from '../QuizPage/quizpage.jsx';

import styles from './style.css';

export default class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        {/* <LoginPage /> */}
        {/* <IndexPage /> */}
        <QuizPage quizTitle='informatyka' />

      </div>
    );
  }
}
