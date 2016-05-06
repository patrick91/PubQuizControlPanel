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

        for (const question of questions) {
            const content = ContentState.createFromText(question.title);

            const answers = [];

            for (let i = 0; i < 4; i++) {
                const answer = question.answers[i] || '';

                const contentAnswer = ContentState.createFromText(answer);

                answers.push(EditorState.createWithContent(contentAnswer));
            }

            editors.push({
                title: EditorState.createWithContent(content),
                answers,
            });
        }

        this.state = {
            code: '',
            editors,
        };

        this.createQuestion = this.createQuestion.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
    }

    onChangeQuestion(index, editorState) {
        const editors = [...this.state.editors];

        editors[index].title = editorState;

        this.setState({editors})
    }

    onChangeAnswer(question, index, editorState) {
        const editors = [...this.state.editors];

        editors[question].answers[index] = editorState;

        this.setState({editors})
    }

    createAnswers(questionIndex, answers, correct) {
        return answers.map((answer, index) => {
            const style = classNames('answer', {
                correct: correct === index,
            })

            return <li styleName={style} key={index}>
                <Editor
                    onChange={(editorState) => this.onChangeAnswer(
                        questionIndex, index, editorState
                    )}
                    editorState={this.state.editors[questionIndex].answers[index]} />
            </li>
        });
    }

    createQuestion(question, index) {
        return <li key={index} styleName='question'>
            <div styleName='question-title'>
                <Editor
                    onChange={(editorState) => this.onChangeQuestion(index, editorState)}
                    editorState={this.state.editors[index].title} />
            </div>

            <ul styleName='answers'>
                { this.createAnswers(index, question.answers, question.correct) }
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
