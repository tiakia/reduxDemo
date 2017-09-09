import React, { Component, PropTypes } from 'react';

export default class Todo extends Component {
    render(){
        return (
            <li onClick={this.props.onClick} style={{
                cursor: this.props.completed ? 'default' : 'pointer',
                backgroundColor: this.props.completed ? 'green' : "#f6d6d6",
                color: this.props.completed ? "#fff" : "#1d1d1d"
            }}>
            {this.props.text}
            </li>
        );
    }
}

Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
};
