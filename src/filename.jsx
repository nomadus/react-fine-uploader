import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Filename extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        uploader: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props)

        this.state = {
            filename: props.uploader.methods.getName(props.id)
        }

        this._interceptSetName()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.filename !== this.state.filename
    }

    render() {
        console.log('The url passed is', this.props.url);
        console.log('The file name is ', this.state.filename);
        return (
            <a href={this.props.url} alt={this.state.filename}>
                <span className={`react-fine-uploader-filename ${this.props.className || ''}`}>
                    {this.state.filename}
                </span>
            </a>

        )
    }

    _interceptSetName() {
        const oldSetName = this.props.uploader.methods.setName

        this.props.uploader.methods.setName = (id, newName) => {
            oldSetName.call(this.props.uploader.methods, id, newName)

            if (id === this.props.id) {
                this.setState({
                    filename: newName
                })
            }
        }
    }
}

export default Filename
