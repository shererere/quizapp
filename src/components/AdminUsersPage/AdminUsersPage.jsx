import React, { Component } from 'react';
// import axios from 'axios';
import Button from '../Button/button.jsx';
import UsersList from '../UsersList/userslist.jsx';

export default class AdminUsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      divisions: [],
      quizid: '',
      division: '',
    };

    // this.filter = this.filter.bind(this);
    // this.handleQuizSelect = this.handleQuizSelect.bind(this);
    // this.handleDivisionSelect = this.handleDivisionSelect.bind(this);
  }

  // async getQuizList() {
  //   const quizzes = await axios.get('http://localhost:3000/api/v1/quiz/');
  //   this.setState({
  //     quizzes: quizzes.data,
  //   });
  // }

  // async getDivisionList() {
  //   const divisions = await axios.get('http://localhost:3000/api/v1/user/division/all/');
  //   this.setState({
  //     divisions: divisions.data,
  //   });
  // }

  // filter(e) {
  //   e.preventDefault();
  //   console.log(this.quizSelect);
  //   this.setState({ quizid: this.quizSelect.value });
  //   this.setState({ division: this.divisionSelect.value });
  // }

  // handleQuizSelect() {
  //   this.setState({ quizid: this.quizSelect.value });
  // }

  // handleDivisionSelect() {
  //   this.setState({ division: this.divisionSelect.value });
  // }

  // componentWillMount() {
  //   this.getQuizList();
  //   this.getDivisionList();
  // }

  render() {
    // let quizzesComponent = null;
    // let divisionsComponent = null;

    // if (this.state.quizzes.length > 0) {
    //   quizzesComponent = this.state.quizzes.map(q =>
    //     <option key={q.id} value={q.id}> {q.name} </option>);
    // }

    // if (this.state.divisions.length > 0) {
    //   divisionsComponent = this.state.divisions.map((d, i) =>
    //     <option key={i} value={d}> {d} </option>);
    // }

    return (
      <div>
        {/* TODO: FILTER FORM */}
        {/* <form onSubmit={this.filter}>
          Quiz:
          <select
            onChange={this.handleQuizSelect}
            value={this.state.quizid}
            ref={(quiz) => { this.quizSelect = quiz; }}
          >
            <option value=""> Wszystkie </option>
            {quizzesComponent}
          </select>
          Klasa:
          <select
            onChange={this.handleDivisionSelect}
            value={this.state.division}
            ref={(division) => { this.divisionSelect = division; }}
          >
            <option value=""> Wszystkie </option>
            {divisionsComponent}
          </select>
          <Button text="Filtruj" />
        </form> */}
        <Button
          text="Pokaż filtry"
        />
        <UsersList quizid={this.state.quizid} division={this.state.division} />
      </div>
    );
  }
}

