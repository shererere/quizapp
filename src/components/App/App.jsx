import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  // Link,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import LoginPage from '../LoginPage/loginpage.jsx';
import IndexPage from '../IndexPage/indexpage.jsx';
import QuizPage from '../QuizPage/quizpage.jsx';

import styles from './style.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: null,
    };
    this.isUserLogged = this.isUserLogged.bind(this);
  }

  isUserLogged() {
    if (localStorage.getItem('token') !== null) {
      this.setState({
        isLogged: true,
      });
    } else {
      this.setState({
        isLogged: false,
      });
    }
  }

  render() {
    return (
      <Router>
        <div className={styles.app}>
          <Route exact path="/" component={IndexPage} history={this.context.history} onEnter={this.isUserLogged} />
          <Route path="/login" component={LoginPage} history={this.context.history} />
          <Route path="/quiz/:id" component={QuizPage} history={this.context.history} />
          <ToastContainer autoClose={false} />
        </div>
      </Router>
    );
  }
}
