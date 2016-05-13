import React from 'react';

import CSSModules from 'react-css-modules';

import styles from './styles.css';

import config from '../../../config.js';
import Firebase from 'firebase';


class Game extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            game: null,
        };

        this.onGameObjectUpate = this.onGameObjectUpate.bind(this);
    }

    componentWillMount() {
        const code = this.props.params.code;

        this.backend = new Firebase(`${config.FIREBASE_URL}/games/${code}`);

        this.backend.once('value', snapshot => {
            this.setState({
                game: snapshot.val(),
            });

            this.backend.on('child_changed', this.onGameObjectUpate);
        });
    }

    componentWillUnmount() {
        this.backend.off('child_changed');
    }

    onGameObjectUpate(snapshot) {
        this.setState({
            game: {
                ...this.state.game,
                [snapshot.key()]: snapshot.val(),
            },
        });
    }

    renderAnswer(answer) {
        return <li styleName='answer'>{answer}</li>;
    }

    renderQuestion(question) {
        return <div>
            <h1 styleName='big-text'>{question.title}</h1>

            <ol>
                {question.answers.map(this.renderAnswer)}
            </ol>
        </div>;
    }

    render() {
        // TODO: Implement show answer? Not sure what it should be
        const showAnswer = true;
        let content = null;

        // I don't like it. I think game === null is a special case enough to duplicate the
        // return code.
        if (!this.state.game) {
            content = <h1 styleName='big-text'>Waiting for the game to load</h1>;
        } else {
            switch (this.state.game.status) {
                case 'not_started':
                    content = <h1 styleName='big-text'>Game is starting...</h1>;
                    break;
                case 'finished':
                    content = <h1 styleName='big-text'>Game is finished!</h1>;
                    break;
                default: {
                    const currentQuestion = this.state.game.questions[this.state.game.currentQuestion];
                    content = this.renderQuestion(currentQuestion);
                    break;
                }
            }
        }

        return <div styleName='wrapper'>
            { content }
        </div>;
    }
}

export default CSSModules(styles)(Game);
