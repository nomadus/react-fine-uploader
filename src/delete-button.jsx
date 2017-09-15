import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DeleteButton extends Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.number.isRequired,
        onlyRenderIfDeletable: PropTypes.bool,
        uploader: PropTypes.object.isRequired
    };

    static defaultProps = {
        onlyRenderIfDeletable: true
    };

    constructor(props) {
        super(props)

        this.state = {
            deletable: true,
            deleting: false,
        }

        const statusEnum = props.uploader.qq.status

        this._onStatusChange = (id, oldStatus, newStatus) => {
            console.log('id', id, isDeletable(newStatus, statusEnum), newStatus, this._unmounted);
            if (id === this.props.id && !this._unmounted) {            

                if (!isDeletable(newStatus, statusEnum) && newStatus !== statusEnum.DELETING && this.state.deletable) {

                    console.log('test', id, isDeletable(newStatus, statusEnum), newStatus, this._unmounted);

                    !this._unmounted && this.setState({
                        deletable: false,
                        deleting: false
                    })
                    this._unregisterStatusChangeHandler()
                }
                else if (isDeletable(newStatus, statusEnum) && !this.state.deletable) {
                    this.setState({
                        deletable: true,
                        deleting: false
                    })
                }
                else if (newStatus === statusEnum.DELETING && !this.state.deleting) {
                    this.setState({ deleting: true })
                }

                console.log('statusToCheck', deletable, deleting, isDeletable(newStatus, statusEnum), this._unmounted);
            }
        }

        this._onClick = () => this.props.uploader.methods.deleteFile(this.props.id);
    }

    componentDidMount() {
        this.props.uploader.on('statusChange', this._onStatusChange)
    }

    componentWillUnmount() {
        this._unmounted = true
        this._unregisterStatusChangeHandler()
    }

    render() {
        const { children, onlyRenderIfDeletable, id, uploader, ...elementProps } = this.props // eslint-disable-line no-unused-vars
        const content = children || 'Delete'
        console.log('state', this.state);
        console.log('props', this.props, onlyRenderIfDeletable);

        if (this.state.deletable || this.state.deleting || !onlyRenderIfDeletable) {
            return (
                <button aria-label='delete'
                    className={`react-fine-uploader-delete-button ${this.props.className || ''}`}
                    disabled={!this.state.deletable || this.state.deleting}
                    onClick={this.state.deletable && !this.state.deleting && this._onClick}
                    type='button'
                    { ...elementProps }
                >
                    {content}
                </button>
            )
        }

        return null
    }

    _unregisterStatusChangeHandler() {
        this.props.uploader.off('statusChange', this._onStatusChange)
    }
}

const isDeletable = (statusToCheck, statusEnum) => {
    return [
        statusEnum.DELETE_FAILED,
        statusEnum.UPLOAD_SUCCESSFUL
    ].indexOf(statusToCheck) >= 0
}

export default DeleteButton
