import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { classNames } from '@leiops/helpers'
import isDefined from '../utils/isDefined'
import getPageOffset from '../utils/getPageOffset'
import noop from '../utils/noop'
import squelchEvent from '../utils/squelchEvent'
import Trigger from './Trigger.jsx'
import Content from './Content.jsx'

const minDropdownHeight = 200

const getPosition = element => {
	const boundingRectangle = element.getBoundingClientRect()
	const pageOffset = getPageOffset()
	const top = pageOffset.y + boundingRectangle.top
	const bottom = pageOffset.y + boundingRectangle.bottom
	const left = pageOffset.x + boundingRectangle.left
	const right = window.innerWidth - boundingRectangle.right - pageOffset.x	
	
	return { 
		top, 
		left, 
		right,
		bottom,
	}
}

class Dropdown extends React.Component {

	elementRef = React.createRef()

	state = {
		hasFocus: false,
	}

	componentDidMount() {
		window.addEventListener('click', this.handleWindowClick)
	}
	
	static getDerivedStateFromProps(props, state) {
		if (props.hasFocus === state.hasFocus ||
			!isDefined(props.hasFocus))
			return null

		return { hasFocus: props.hasFocus }
	}

	componentDidUpdate(lastProps, lastState) {
		// gained focus
		if (!lastState.hasFocus && this.state.hasFocus)
		{
			this.observer.observe(
				// findDOMNode(this),
				findDOMNode(this.elementRef.current),
				{ 
					childList: true,
					subtree: true,
				}
			)
		}
		// lost focus
		else if (lastState.hasFocus && !this.state.hasFocus)
		{
			this.removedNodes = []
			this.observer.disconnect()
		}
			
	}
	
	componentWillUnmount() {
		window.removeEventListener('click', this.handleWindowClick)
		this.observer.disconnect()
	}

	handleMutation = mutationList => {
		for (let i in mutationList)
			this.removedNodes = [
				...this.removedNodes,
				...mutationList[i].removedNodes,
			]
	}

	observer = new MutationObserver(this.handleMutation)
	removedNodes = []

	hide = () => {
		if (!this.state.hasFocus) return

		this.setState({
			hasFocus: false
		}, this.props.onHide)
	}

	show = () => {
		if (this.state.hasFocus) return

		this.setState({
			hasFocus: true
		}, this.props.onShow)
	}

	addEventHandler = (child, propName, handler) => 
		event => {
			if (this.props.isDisabled) return

			handler(event)
		
			if (child.props[propName])
				child.props[propName].apply(child, arguments)
		}

	handleWindowClick = event => {
		
		if (!this.state.hasFocus) return
		
		const dropdownNode = findDOMNode(this.elementRef.current)
		const isNotInDropdown = (
			dropdownNode &&
			event.target.constructor.name.includes('Element') &&
			event.target !== dropdownNode &&
			!dropdownNode.contains(event.target)
		)

		let wasRemovedFromDropdown = false
		for (let i in this.removedNodes)
			if (this.removedNodes[i] === event.target ||
				this.removedNodes[i].contains(event.target))
			{
				wasRemovedFromDropdown = true
				break
			}

		if (isNotInDropdown && !wasRemovedFromDropdown) this.hide()
	}

	handleTriggerClick = event => {
		event.preventDefault()
		if (this.state.hasFocus)
			this.hide()
		else
			this.show()
	}

	handleMouseEnter = event => {
		if (!this.props.isHoverable) return
		if (this.state.hasFocus) return

		const thisElement = findDOMNode(this)
		const isInDropdown = (
			thisElement && 
			event.target.constructor.name.includes('Element') &&
			(
				event.target === thisElement ||
				thisElement.contains(event.target)
			)
		)

		if (isInDropdown) this.show()
	}

	handleMouseLeave = event => {
		if (!this.props.isHoverable) return
		if (!this.state.hasFocus) return

		const dropdownNode = findDOMNode(this)

		const isNotInDropdown = (
			dropdownNode &&
			event.relatedTarget.constructor.name === 'Window' ?
				true : 
				(
					event.relatedTarget.constructor.name.includes('Element') &&
					event.relatedTarget !== dropdownNode &&
					!dropdownNode.contains(event.relatedTarget)
				)
		)

		if (isNotInDropdown) this.hide()
	}

	renderTrigger = trigger => React.cloneElement(
		trigger, 
		{
			onClick: this.addEventHandler(
				trigger, 'onClick', this.handleTriggerClick
			),
			onMouseEnter: this.addEventHandler(
				trigger, 'onMouseEnter', this.handleMouseEnter
			),
			onMouseLeave: this.addEventHandler(
				trigger, 'onMouseLeave', this.handleMouseLeave
			),
			_isActive: this.state.hasFocus,
		}
	)

	renderContent = content => {

		if (!this.elementRef.current) return null

		const finalPosition = {}
		const position = getPosition(this.elementRef.current)

		const isBelow = (position.bottom + minDropdownHeight) < window.innerHeight

		if (isBelow)
			finalPosition.top = '100%'
		else
			finalPosition.bottom = '100%'

		finalPosition[this.props.justify] = this.props.justifyOffset

		return React.cloneElement(
			content, 
			{
				ref: this.portalRef,
				onMouseEnter: this.addEventHandler(
					content, 'onMouseEnter', this.handleMouseEnter
				),
				onMouseLeave: this.addEventHandler(
					content, 'onMouseLeave', this.handleMouseLeave
				),
				style: {
					position: 'absolute',
					...finalPosition,
				}
			}
		)
	}

	render = () => {

		const {
			children,
			className,
			isDisabled,
			shouldStopClickPropagation
		} = this.props

		const { hasFocus } = this.state

		return (
			<div
				ref={this.elementRef}
				className={classNames(
					'dropdown',
					hasFocus && '--active',
					isDisabled && '--disabled',
					className,
				)}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onClick={shouldStopClickPropagation ? 
					squelchEvent : 
					undefined
				}
			>
				{React.Children.map(children, child => {
					if (!child) 
						return null
					switch (child.type)
					{
						case Trigger:
							return this.renderTrigger(child)
						case Content:
							return hasFocus ? 
								this.renderContent(child) :
								null
						default:
							return child
					}
				})}
			</div>
		)
	}
}

Dropdown.defaultProps = {
	justify: 'left',
	justifyOffset: '0',
	isHoverable: false,
	shouldStopClickPropagation: false,
	className: '',
	onHide: noop,
	onShow: noop,
}

Dropdown.propTypes = {
	// left or right, the component will try to keep the specified side justified to the dropdown trigger as long as there is space
	justify: PropTypes.oneOf(['right', 'left']),
	// the value for style.right or style.left, depending on the vaue of justify
	justifyOffset: PropTypes.string,
	// should the dropdown open on mouseenter and close on mouseleave
	isHoverable: PropTypes.bool,
	// stop the dropdown from accepting user interactions
	isDisabled: PropTypes.bool,
	// decide whether or not the dropdown is open from the parent
	hasFocus: PropTypes.bool,
	// called when the dropdown disappears, or tells the parent component to give focus
	onHide: PropTypes.func,
	// called when the dropdown appears, or tells the parent component to remove focus
	onShow: PropTypes.func,
	// should the dropdown intercept and stop events from bubbling up the DOM
	shouldStopClickPropagation: PropTypes.bool,
	// trigger and content
	children: PropTypes.node.isRequired,
	// extra classnames
	className: PropTypes.string,
	// custom styles prop
	style: PropTypes.object
}

export default Dropdown