import React from 'react';

import CSSModules from 'react-css-modules';

import styles from './styles.css';


class Game extends React.Component {
    render() {
        const starting = false;
        const showAnswer = true;

        return <div styleName='wrapper'>
            { starting && <h1 styleName='big-text'>Game is starting...</h1> }
            { !starting && <div>
                <h1 styleName='big-text'>How many ninjas do you need to change a light bulb?</h1>

                <ol>
                    <li styleName='answer'>None. They live in the dark</li>
                    <li styleName='answer'>Seven</li>
                    <li styleName='answer'>💻</li>
                    <li styleName='answer'>A couple</li>
                </ol>
            </div> }
        </div>;
    }
}

export default CSSModules(styles)(Game);
