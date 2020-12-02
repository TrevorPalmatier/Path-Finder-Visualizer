import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
    render() {
        const {
        col,
        isFinish,
        isStart,
        isWall,
        onMouseDown,
        onMouseEnter,
        onMouseOut,
        onMouseUp,
        row,
    } = this.props;
    const extraClassName = isFinish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : isWall
        ? 'node-wall'
        : '';

        return (
            <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseOut={() => onMouseOut(row, col)}
            onMouseUp={() => onMouseUp(row, col)}></div>
        );
    }
}