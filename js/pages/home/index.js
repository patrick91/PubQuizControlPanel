import React from 'react';
import { withRouter } from 'react-router'

import CSSModules from 'react-css-modules';
import MaskedInput from 'react-maskedinput';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Done from 'material-ui/svg-icons/action/done';

import Firebase from 'firebase';

import styles from './styles.css';

import config from '../../../config.js';


class Home extends React.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            code: '',
        };

        this.firebase = new Firebase(config.FIREBASE_URL);

        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleEditGame = this.handleEditGame.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
    }

    generateNewGameCode() {
        const color = Math.floor(Math.random() * 1000 + 1);

        return (`0000${color}`).slice(-4);
    }

    handleCodeChange(e) {
        const code = e.target.value.replace(/[ _]/g, '');

        this.setState({
            code,
        });
    }

    handleEditGame() {
        const { code } = this.state;

        this.props.router.push(`/edit/${code}`);
    }

    handleNewGame() {
        const code = this.generateNewGameCode();

        this.firebase
                    .child(`games/${code}`)
                    .set({
                        currentQuestion: 0,
                        status: 'not_started',
                        users: {},
                        questions: [
                        {
                            title: 'Example Question',
                            answers: [
                                'First answer',
                                'Second answer',
                                'Third answer',
                                'Fourth answer',
                            ],
                            correct: 2,
                        }],
                    }, () => {
                        this.props.router.push(`/edit/${code}`);
                    });
    }

    render() {
        const { code } = this.state;

        return <div styleName='wrapper'>
            <div
                styleName='box'
                style={{
                    backgroundColor: '#9013FE',
                }}
                onClick={this.handleNewGame}
            >Create new game</div>

            <div
                styleName='box'
                style={{
                    backgroundColor: '#50E3C2',
                }}>

                Edit game

                <MaskedInput
                    onChange={this.handleCodeChange}
                    styleName='code-input' mask='1 1 1 1' maxLength='4' />

                { code.length >= 4 && <FloatingActionButton
                    onClick={this.handleEditGame}
                    styleName='button' backgroundColor='#9013FE'>
                    <Done />
                </FloatingActionButton> }
            </div>
        </div>;
    }
}

export default withRouter(CSSModules(styles)(Home));
