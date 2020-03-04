import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Users from "./components/Users/Users";
import User from "./components/Users/User";
import Search from "./components/Users/Search";
import ALert from "./components/layout/ALert";
import About from "./components/Pages/About";
import axios from "axios";

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  };
  // async componentDidMount() {
  //   this.setState({ loading: true });
  //   const res = await axios.get(
  //     `https://api.github.com/users?client_id=${process.env.REACT_APP_GUTHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GUTHUB_CLIENT_SECRET}`
  //   );
  //   this.setState({ users: res.data, loading: false });
  // }

  //Search github users
  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GUTHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GUTHUB_CLIENT_SECRET}`
    );
    this.setState({ users: res.data.items, loading: false });
  };

  //Get a single github user

  getUser = async username => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GUTHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GUTHUB_CLIENT_SECRET}`
    );
    this.setState({ user: res.data, loading: false });
  };

  //Get a user repos
  getUserRepos = async username => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GUTHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GUTHUB_CLIENT_SECRET}`
    );
    this.setState({ repos: res.data, loading: false });
  };

  //Clear user from state
  clearUsers = () => this.setState({ users: [], loading: false });
  //set alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };
  render() {
    const { loading, users, user, repos } = this.state;
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <ALert alert={this.state.alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Fragment>
                  <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={this.state.users.length > 0 ? true : false}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={props => (
                <User
                  {...props}
                  getUser={this.getUser}
                  getUserRepos={this.getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
