import React from 'react';
import CSSModules from 'react-css-modules';

import { Editor, EditorState, ContentState } from 'draft-js';

import PlayIcon from '../../components/play-icon';
import classNames from 'classnames';

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
            editors.push(this.createQuestion(question));
        }

        this.state = {
            code: '',
            editors,
        };

        this.renderQuestion = this.renderQuestion.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
    }

    onChangeQuestion(index, editorState) {
        const editors = [...this.state.editors];

        editors[index].title = editorState;

        this.setState({editors});
    }

    onChangeAnswer(question, index, editorState) {
        const editors = [...this.state.editors];

        editors[question].answers[index] = editorState;

        this.setState({editors});
    }

    addNewQuestion() {
        const question = {
            title: 'random question',
            answers: [],
            correct: 0,
        };

        questions.push(question);

        const editors = [...this.state.editors];

        editors.push(this.createQuestion(question));

        this.setState({editors}, () => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    }


    createQuestion(question) {
        const content = ContentState.createFromText(question.title);

        const answers = [];

        for (let i = 0; i < 4; i++) {
            const answer = question.answers[i] || `${i + 1}`;

            const contentAnswer = ContentState.createFromText(answer);

            answers.push(EditorState.createWithContent(contentAnswer));
        }

        return {
            title: EditorState.createWithContent(content),
            answers,
            correct: question.correct,
        };
    }

    renderAnswers(questionIndex, answers, correct) {
        return answers.map((answer, index) => {
            const style = classNames('answer', {
                correct: correct === index,
            })

            return <li styleName={style} key={index}>
                <Editor
                    onChange={(editorState) => this.onChangeAnswer(
                        questionIndex, index, editorState
                    )}
                    editorState={answer} />
            </li>
        });
    }

    renderQuestion(editor, index) {
        return <li key={index} styleName='question'>
            <div styleName='question-title'>
                <Editor
                    onChange={(editorState) => this.onChangeQuestion(index, editorState)}
                    editorState={editor.title} />
            </div>

            <ul styleName='answers'>
                { this.renderAnswers(index, editor.answers, editor.correct) }
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
                { this.state.editors.map(this.renderQuestion) }

                <li styleName='add-new-question' onClick={this.addNewQuestion}>Add new question</li>
            </ul>
        </div>;
    }
}

export default CSSModules(styles, {
    allowMultiple: true,
})(EditGame);
