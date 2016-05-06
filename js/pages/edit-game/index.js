import React from 'react';
import { Link } from 'react-router'
import CSSModules from 'react-css-modules';

import PlayIcon from '../../components/play-icon';
import classNames from 'classnames';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Done from 'material-ui/svg-icons/action/done';

import styles from './styles.css';


const questions = [
    {
        title: 'Question 1',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
    {
        title: 'Question 2',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
    {
        title: 'Question 3',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
    {
        title: 'Question 4',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
    {
        title: 'Question 5',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
    {
        title: 'Question 6',
        correct: 1,
        answers: [
            'option 1',
            'option 2',
            'option 3',
            'option 4',
        ],
    },
]


class EditGame extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            code: '',
        };

        this.createQuestion = this.createQuestion.bind(this);
    }

    createAnswers(answers, correct) {
        return answers.map((answer, index) => {
            const style = classNames('answer', {
                correct: correct === index,
            })

            return <li styleName={style} key={index}>{answer}</li>
        });
    }

    createQuestion(question, index) {
        return <li key={index} styleName='question'>
            <div styleName='question-title'>{question.title}</div>

            <ul styleName='answers'>
                { this.createAnswers(question.answers, question.correct) }
            </ul>
        </li>;
    }

    render() {
        return <div styleName='wrapper'>
            <div styleName='header'>
                <h1>Editing game: <strong>{this.props.params.code}</strong></h1>

                <div><PlayIcon /></div>
            </div>

            <ul>
                { questions.map(this.createQuestion) }
            </ul>
        </div>;
    }
}

export default CSSModules(styles, {
    allowMultiple: true,
})(EditGame);
