import * as React from 'react'
import LoginPage from '../login-page/login-page.component';
import HomePage from '../home-page/home-page.component';
import { AuthService } from '../../services/auth.service/auth.service';
import { authService } from '../../services';

const HomeLoginPageInner = (props: HomeLoginPageProps) => props.loggedIn ? (<HomePage />) : (<LoginPage onLogin={props.onLogin} />)

class HomeLoginPageContainer extends React.Component<{ authService: AuthService }, { loggedIn: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    this.props.authService.isLoggedIn()
      .then(loggedIn => {
        if (loggedIn) {
          console.debug('loggedin')
          this.handleLogin()
        }
      })
      .catch(e => console.error(e))
  }

  handleLogin = () => {
    this.setState({ loggedIn: true })
  }

  render() {
    const { loggedIn } = this.state
    return <HomeLoginPageInner loggedIn={loggedIn} onLogin={this.handleLogin} />
  }
}

export interface HomeLoginPageProps {
  loggedIn: boolean
  onLogin: () => void
}

export const HomeLoginPage = () => <HomeLoginPageContainer authService={authService} />
export default HomeLoginPage
