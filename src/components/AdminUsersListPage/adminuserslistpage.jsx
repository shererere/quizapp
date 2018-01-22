import React, { Component } from 'react';
import axios from 'axios';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';

class AdminUsersListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.openSingleUserPage = this.openSingleUserPage.bind(this);
  }

  async callAPIEndpoints() {
    const users = await axios.get('/user', this.axiosConfig);
    this.setState({
      users: users.data,
    });
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  openSingleUserPage(id) {
    this.props.history.push(`/admin/user/single/${id}`);
  }

  render() {
    let listItems = null;

    if (this.state.users.length > 0) {
      listItems = this.state.users.map(item =>
        <ListItem key={item.id}>
          <h3 onClick={() => { this.openSingleUserPage(item.id); }}>{item.username}</h3>
        </ListItem>);
    }

    return (
      <div>
        <List header="Lista użytkowników">
          {listItems}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminUsersListPage);
