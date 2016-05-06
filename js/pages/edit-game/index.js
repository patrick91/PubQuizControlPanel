import React from 'react';
import { Link } from 'react-router'
import CSSModules from 'react-css-modules';

import { Editor, EditorState, ContentState } from 'draft-js';

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

        const editors = [];

        for (let i = 0; i < questions.length; i++) {
            const content = ContentState.createFromText(questions[i].title);

            editors.push(EditorState.createWithContent(content));
        }

        this.state = {
            code: '',
            editors,
        };

        this.createQuestion = this.createQuestion.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(index, editorState) {
        const editors = [...this.state.editors];

        editors[index] = editorState;

        this.setState({editors})
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
            <div styleName='question-title'>
                <Editor
                    onChange={(editorState) => this.onChange(index, editorState)}
                    editorState={this.state.editors[index]}>{question.title}</Editor>
            </div>

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
