import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  // Link,
} from 'react-router-dom';

import LoginPage from '../LoginPage/loginpage.jsx';
import IndexPage from '../IndexPage/indexpage.jsx';
import QuizPage from '../QuizPage/quizpage.jsx';

import styles from './style.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.app}>
          <Route exact path="/" component={LoginPage} history={this.context.history} />
          <Route path="/panel" component={IndexPage} />
          <Route path="/quiz" component={QuizPage} quizTitle='informatyka' />
        </div>
      </Router>

    );
  }
}
