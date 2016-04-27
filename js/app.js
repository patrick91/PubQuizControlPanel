import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/home';

// eslint-disable-next-line
import styles from 'app.css';


const Application = () => <Router history={browserHistory}>
    <Route path="/" component={Home} />
</Router>;

ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}>
    <Application />
</MuiThemeProvider>, document.querySelector('#app'));
