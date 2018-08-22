import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'
import { noop } from '../utils'

// DEV - this must maintain state in order to be referenceable in the parent

class Trigger extends React.Component {
    render = () => {
        const {
            _isActive, 
            children, 
            className, 
            isDisabled,
            onClick,
            ...rest, 
        } = this.props
        return (
            <a
                {...rest}
                onClick={isDisabled ? noop : onClick}
                className={classNames(
                    'dropdown__trigger',
                    _isActive && '--active',
                    className,
                )}
            >
                {children}
            </a>
        )
    }
}

Trigger.propTypes = {
    children: PropTypes.node.isRequired,
    _isActive: PropTypes.bool,
    isDisabled: PropTypes.bool,
    className: PropTypes.string
}

Trigger.defaultProps = {
    className: '',
    _isActive: false,
    isDisabled: false,
}

export default Trigger