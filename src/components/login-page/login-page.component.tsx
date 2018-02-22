import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router';
import { AuthService } from '../../services/auth.service/auth.service';
import { authService } from '../../services';
import { Subscription } from 'rxjs';
import { initFacebook } from '../../wrappers';
import { Facebook, FacebookLoginButton } from '../../wrappers/facebook/facebook.init';

class LoginPageInner extends React.Component<LoginPageProps, { facebook: Facebook, fbInit: boolean }> {

  subs: Subscription[]

  constructor(props: LoginPageProps) {
    super(props)
    this.state = {
      facebook: initFacebook(),
      fbInit: false
    }

    this.subs = []
  }

  componentDidMount() {
    this.subs.push(this.state.facebook.onInit.subscribe(() => this.setState({ fbInit: true })))
    this.subs.push(this.state.facebook.onLogin.subscribe(this.login))
    this.subs.push(this.state.facebook.onFbInitLoggedIn.subscribe(this.login))
  }

  componentWillUnmount() {
    this.subs.forEach(s => s.unsubscribe())
  }

  login = (response: fb.AuthResponse) => {
    this.props.authService.loginUserWithFacebookToken(response.authResponse.accessToken)
      .then(res => {
        this.props.onLogin()
      })
      .catch(e => {
        console.error(e)
      })
  }

  render () {
    return (
      <div>
        {this.state.fbInit ? (<FacebookLoginButton/>) : null}
      </div>
    )
  }
}

export interface LoginPageProps extends RouteComponentProps<{}> {
  authService: AuthService
  onLogin: () => void
}

const LoginPageWithRouter = withRouter(LoginPageInner)
export const LoginPage = (props) => <LoginPageWithRouter authService={authService} onLogin={props.onLogin} />
export default LoginPage
