import React from 'react';
import { Link } from 'react-router'
import CSSModules from 'react-css-modules';
import MaskedInput from 'react-maskedinput';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Done from 'material-ui/svg-icons/action/done';

import styles from './styles.css';


class Home extends React.Component {
    constructor() {
        super();

        this.state = {
            code: '',
        };
    }

    handleCodeChange(e) {
        const code = e.target.value.replace(/[ _]/g, '');

        this.setState({
            code,
        });
    }

    render() {
        const { code } = this.state;

        console.log(code);

        return <div styleName='wrapper'>
            <Link styleName='box' style={{
                backgroundColor: '#9013FE',
            }} to="new-game">Create new game</Link>

            <div styleName='box' style={{
                backgroundColor: '#50E3C2',
            }}>
                Edit game

                <MaskedInput
                    onChange={ e => this.handleCodeChange(e) }
                    styleName='code-input' mask='1 1 1 1' maxLength='4' />

                { code.length >= 4 && <FloatingActionButton
                    styleName='button' backgroundColor='#9013FE'>
                    <Done />
                </FloatingActionButton> }
            </div>
        </div>;
    }
}

export default CSSModules(styles)(Home);
