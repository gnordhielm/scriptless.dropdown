import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'

// DEV - this must maintain state in order to be referenceable in the parent

class Content extends React.Component {

    render = () => {
        const { children, className, ...rest } = this.props
        
        return (
            <div
                {...rest}
                className={classNames(
                    'dropdown__content', 
                    className
                )}
            >
                {children}
            </div>
        )
    }
}


Content.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

Content.defaultProps = {
    className: ''
}

export default Content