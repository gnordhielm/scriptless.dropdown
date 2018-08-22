import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'

// DEV - needs to be stateful to take refs

class Trigger extends React.Component {
    render = () => {
        const { children, className, ...rest } = this.props
        return (
            <a
                {...rest}
                className={classNames('__trigger', className)}
            >
                {children}
            </a>
        )
    }
}

Trigger.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

Trigger.defaultProps = {
    className: ''
}

export default Trigger