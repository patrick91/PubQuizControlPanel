import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';


export class Modal extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
        open: React.PropTypes.bool.isRequired,
        showCloseButton: React.PropTypes.bool,
        onClose: React.PropTypes.func.isRequired,
    };

    static defaultProps = {
        showCloseButton: false,
    };

    render() {
        const actions = [];

        if (this.props.showCloseButton) {
            actions.push(<FlatButton label="Close" primary={true} onClick={this.props.onClose} />);
        }

        return <Dialog title={this.props.title} open={this.props.open} actions={actions} modal>
            {this.props.message}
        </Dialog>;
    }
}

export default CSSModules(styles)(Modal);
