import React from 'react';
import CSSModules from 'react-css-modules';

import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';

import PlayIcon from '../../components/play-icon';
import classNames from 'classnames';

import Firebase from 'firebase';

import styles from './styles.css';
import Modal from '../../components/modal';


class EditGame extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
    }

    constructor() {
        super();

        this.state = {
            code: '',
            editors: [],
            modalTitle: '',
            modalMessage: '',
            modalOpen: false,
        };

        this.renderQuestion = this.renderQuestion.bind(this);
        this.onChangeQuestion = this.onChangeQuestion.bind(this);
        this.onChangeAnswer = this.onChangeAnswer.bind(this);
        this.addNewQuestion = this.addNewQuestion.bind(this);
        this.onGameObjectUpdate = this.onGameObjectUpdate.bind(this);
        this.startGame = this.startGame.bind(this);
        this.finishGame = this.finishGame.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.hideModal = this.hideModal.bind(this);
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
        }, '').trim();

        this.backend.child(`questions/${index}/title`).set(text);
        this.setState({ editors });
    }

    onChangeAnswer(question, index, editorState) {
        const editors = [...this.state.editors];

        const textBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const text = textBlocks.reduce((previousValue, block, _) => {
            return `${previousValue} ${block.text}`;
        }, '').trim();

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

        this.backend.child('questions').transaction(currentQuestions => [
            ...currentQuestions,
            question,
        ]);

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
                    stripPastedStyles
                    readOnly={this.isGameStarted()}
                    onChange={(editorState) => this.onChangeAnswer(
                        questionIndex, index, editorState
                    )}
                    editorState={answer} />
            </li>
        });
    }

    renderQuestion(editor, index) {
        const questionStyle = classNames('question', {
            'question-current': index === this.state.game.currentQuestion,
        });

        return <li key={index} styleName={questionStyle}>
            <div styleName='question-title'>
                <Editor
                    stripPastedStyles
                    readOnly={this.isGameStarted()}
                    onChange={(editorState) => this.onChangeQuestion(index, editorState)}
                    editorState={editor.title} />
            </div>

            <ul styleName='answers'>
                { this.renderAnswers(index, editor.answers, editor.correct) }
            </ul>
        </li>;
    }

    startGame() {
        this.showModal('Starting the game', 'Starting the game...');

        // reset the current question to the first one
        this.backend.child('currentQuestion').set(0, () => {
            this.backend.child('status').set('running', this.hideModal);
        });
    }

    finishGame() {
        // TODO: Show modal 'Ending the game'
        this.showModal('Ending the game', 'Ending the game...');

        this.backend.child('status').set('finished', this.hideModal);
    }

    nextQuestion() {
        this.showModal('Changing question', 'Changing question...');

        // TODO: Show modal 'Changing question'
        const nextQuestionIndex = this.state.game.currentQuestion + 1;

        if (nextQuestionIndex >= this.state.game.questions.length) {
            // TODO: Show modal 'no more questions'
            console.log('no more questions');
            this.showModal('Error', 'No more questions');
            return;
        }

        this.backend.child('currentQuestion')
                    .set(this.state.game.currentQuestion + 1, this.hideModal);
    }

    showModal(title, message) {
        this.setState({
            modalTitle: title,
            modalMessage: message,
            modalOpen: true,
        });
    }

    hideModal() {
        this.setState({
            modalOpen: false,
        });
    }

    render() {
        if (!this.state.game) {
            return <div>Waiting for the game to load...</div>;
        }

        return <div styleName='wrapper'>
            <div styleName='header'>
                <h1>Editing game: <strong>{this.props.params.code}</strong></h1>

                {(this.isGameNotStartedYet() || this.isGameFinished()) && <div onClick={this.startGame}>
                    <PlayIcon />
                </div>}

                {this.isGameStarted() && <div>
                    <span onClick={this.nextQuestion}>Next question</span>{' '}
                    <span onClick={this.finishGame}>Finish game</span>
                </div>}
            </div>

            <ul>
                { this.state.editors.map(this.renderQuestion) }

                {!this.isGameStarted() && <li styleName='add-new-question' onClick={this.addNewQuestion}>Add new question</li>}
            </ul>

            <Modal
                title={this.state.modalTitle}
                message={this.state.modalMessage}
                open={this.state.modalOpen} />
        </div>;
    }

    isGameFinished() {
        if (!this.state.game) {
            return false;
        }

        return this.state.game.status === 'finished';
    }

    isGameStarted() {
        if (!this.state.game) {
            return false;
        }

        return this.state.game.status === 'running';
    }

    isGameNotStartedYet() {
        if (!this.state.game) {
            return false;
        }

        return this.state.game.status === 'not_started';
    }
}

export default CSSModules(styles, {
    allowMultiple: true,
})(EditGame);
