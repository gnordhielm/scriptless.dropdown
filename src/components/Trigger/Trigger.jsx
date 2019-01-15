import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'
import noop from '../../utils/noop'

// DEV - this must maintain state in order to be referenceable in the parent

class Trigger extends React.Component {
    render = () => {
        const {
            _isActive, 
            _passRef, 
            children, 
            className, 
            isDisabled,
            onClick,
            ...rest, 
        } = this.props
        return (
            <a
                {...rest}
                ref={_passRef}
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

Trigger.displayName = "Trigger"

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