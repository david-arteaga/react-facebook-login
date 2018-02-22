import * as React from 'react';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom'
import HomeLoginPage from './components/home-login-page/home-login-page.component';
// import { initFacebook } from './init';


class App extends React.Component {

  render() {
    return (
      <HashRouter>
        <React.Fragment>
          <Switch>
          <Route
            exact={true}
            route="/"
            component={HomeLoginPage}
          />
          </Switch>
        </React.Fragment>
      </HashRouter>

    );
  }
}

export default App;
