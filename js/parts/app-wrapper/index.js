import React from 'react';
import AppBar from 'material-ui/AppBar';



export default class App extends React.Component {
    render() {
        return <div>
            <AppBar
                title="Title"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
            />

            <h1>Hello</h1>

        </div>;
    }
}
