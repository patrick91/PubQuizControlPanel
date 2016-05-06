import React from 'react';
import { Link, withRouter } from 'react-router'

import CSSModules from 'react-css-modules';
import MaskedInput from 'react-maskedinput';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Done from 'material-ui/svg-icons/action/done';

import styles from './styles.css';


class Home extends React.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            code: '',
        };

        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleEditGame = this.handleEditGame.bind(this);
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

    render() {
        const { code } = this.state;

        return <div styleName='wrapper'>
            <Link styleName='box' style={{
                backgroundColor: '#9013FE',
            }} to="new-game">Create new game</Link>

            <div styleName='box' style={{
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
