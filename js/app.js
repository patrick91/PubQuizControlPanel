import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './pages/home';
import EditGame from './pages/edit-game';
import Game from './pages/game';

// eslint-disable-next-line
import styles from 'app.css';


const Application = () => <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="/edit/:code" component={EditGame} />
    <Route path="/game/:code" component={Game} />
</Router>;

ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}>
    <Application />
</MuiThemeProvider>, document.querySelector('#app'));
