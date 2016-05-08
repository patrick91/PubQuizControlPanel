import React from 'react';
import CSSModules from 'react-css-modules';

import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';

import PlayIcon from '../../components/play-icon';
import classNames from 'classnames';

import Firebase from 'firebase';

import styles from './styles.css';


class EditGame extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            code: '',
            editors: [],
        };

        this.renderQuestion = this.renderQuestion.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
        this.onGameObjectUpdate = this.onGameObjectUpdate.bind(this);
    }

    componentWillMount() {
        // we can replace on with once if we don't want to allow multiple users
        // to edit the same game at the same time
        // we might be more clever and allow multiple users by using child_added, child_changed
        // etc.
        const gameCode = this.props.params.code;

        this.backend = new Firebase(`https://testquizapp123456.firebaseio.com/games/${gameCode}`);
        this.backend.on('value', this.onGameObjectUpdate);
    }

    componentWillUnmount() {
        this.backend.off('value', this.onGameObjectUpdate);
    }

    onGameObjectUpdate(snapshot) {
        if (snapshot.val() === null) {
            // TODO:
            // invalid game code
            console.log('invalid game code');
            return;
        }

        const game = snapshot.val();

        this.initializeUi(game);
        this.setState({
            game,
        });
    }

    initializeUi(game) {
        console.log('game', game);
        const editors = [];

        game.questions.forEach(question => {
            editors.push(this.createQuestion(question));
        });

        this.setState({
            editors,
        });
    }

    onChangeQuestion(index, editorState) {
        const editors = [...this.state.editors];

        editors[index].title = editorState;

        const textBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const text = textBlocks.reduce((previousValue, block, _) => {
            return `${previousValue} ${block.text}`;
        }, '');

        this.backend.child(`questions/${index}/title`).set(text);
        this.setState({ editors });
    }

    onChangeAnswer(question, index, editorState) {
        const editors = [...this.state.editors];

        const textBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const text = textBlocks.reduce((previousValue, block, _) => {
            return `${previousValue} ${block.text}`;
        }, '');

        this.backend.child(`questions/${question}/answers/${index}`).set(text);
        editors[question].answers[index] = editorState;

        this.setState({ editors });
    }

    addNewQuestion() {
        const question = {
            title: 'random question',
            answers: ['1', '2', '3', '4'],
            correct: 0,
        };

        this.backend.child('questions').transaction(currentQuestions => {
            return [
                ...currentQuestions,
                question,
            ];
        });

        const editors = [...this.state.editors];

        editors.push(this.createQuestion(question));

        this.setState({ editors }, () => {
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

                {!this.isGameStarted() && <li styleName='add-new-question' onClick={this.addNewQuestion}>Add new question</li>}
            </ul>
        </div>;
    }

    isGameFinished() {
        return this.state.game.status === 'finished';
    }

    isGameStarted() {
        return this.state.game.status === 'running';
    }
}

export default CSSModules(styles, {
    allowMultiple: true,
})(EditGame);
