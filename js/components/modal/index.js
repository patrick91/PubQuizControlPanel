import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

import Dialog from 'material-ui/Dialog';


export class Modal extends React.Component {
    static propTypes = {
        title: React.PropTypes.string,
        message: React.PropTypes.string,
        open: React.PropTypes.bool,
    };

    render() {
        return <Dialog title={this.props.title} open={this.props.open} modal>
            {this.props.message}
        </Dialog>;
    }
}

export default CSSModules(styles)(Modal);
