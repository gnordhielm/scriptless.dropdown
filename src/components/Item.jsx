import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'

const Item = ({ children, className, ...rest }) => (
    <div
        {...rest}
        className={classNames('__item', className)}
    >
        {children}
    </div>
)

Item.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

Item.defaultProps = {
    className: ''
}

export default Item