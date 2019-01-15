import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '@leiops/helpers'
import isDefined from '../../utils/isDefined'
import getPageOffset from '../../utils/getPageOffset'
import noop from '../../utils/noop'
import squelchEvent from '../../utils/squelchEvent'
import Trigger from '../Trigger'
import Content from '../Content'

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

	dropdownRef = React.createRef()
	triggerRef = React.createRef()

	state = {
		hasFocus: false,
	}

	removedNodes = []
	removedTriggerNodes = []

	componentDidMount() {		
		this.triggerObserver.observe(
			this.triggerRef.current,
			{ 
				childList: true,
				subtree: true,
			}
		)
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
			this.contentObserver.observe(
				this.dropdownRef.current,
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
			this.contentObserver.disconnect()
		}
			
	}
	
	componentWillUnmount() {
		window.removeEventListener('click', this.handleWindowClick)
		this.contentObserver.disconnect()
		this.triggerObserver.disconnect()
	}

	handleMutation = mutationList => {
		for (let i in mutationList)
			this.removedNodes = [
				...this.removedNodes,
				...mutationList[i].removedNodes,
			]
	}

	handleTriggerMutation = mutationList => {
		
		for (let i in mutationList)
			this.removedTriggerNodes = [
				...this.removedTriggerNodes,
				...mutationList[i].removedNodes,
			]
		
	}	

	contentObserver = new MutationObserver(this.handleMutation)
	triggerObserver = new MutationObserver(this.handleTriggerMutation)

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

		let wasRemovedFromTrigger = false
		for (let i in this.removedTriggerNodes)
			if (this.removedTriggerNodes[i] === event.target ||
				this.removedTriggerNodes[i].contains(event.target))
			{
				wasRemovedFromTrigger = true
				break
			}

		const triggerNode = this.triggerRef.current
		const isTriggerClick = (
			triggerNode &&
			(triggerNode === event.target || triggerNode.contains(event.target))
		)

		if (isTriggerClick || wasRemovedFromTrigger)
		{

			event.preventDefault()
			if (this.state.hasFocus && !this.props.triggerShouldNotToggle)
				this.hide()
			else
				this.show()

			return
		}
		
		// if (!this.state.hasFocus) return
		
		const dropdownNode = this.dropdownRef.current
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

		if (isNotInDropdown && !wasRemovedFromDropdown) 
		{
			this.props.onBlur()
			this.hide()
		}
		else if (!isNotInDropdown)
		{
			this.props.onFocus()
			// this.props.onContentFocus()
		}
	}

	handleMouseEnter = event => {
		if (!this.props.isHoverable) return
		if (this.state.hasFocus) return

		const thisElement = this.dropdownRef.current
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

		const dropdownNode = this.dropdownRef.current

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

	// TO DO - I guess I'm allowed to do whatever I want to the trigger, since it's a wrapper node? Ideally, there wouldn't be a wrapper node added, but then I have to figure out how to reference the trigger locally without overwriting a possible ref passed by the user.

	renderTrigger = trigger => React.cloneElement(
		trigger, 
		{
			// onClick: this.addEventHandler(
			// 	trigger, 'onClick', this.handleTriggerClick
			// ),
			onMouseEnter: this.addEventHandler(
				trigger, 'onMouseEnter', this.handleMouseEnter
			),
			onMouseLeave: this.addEventHandler(
				trigger, 'onMouseLeave', this.handleMouseLeave
			),
			_isActive: this.state.hasFocus,
			_passRef: this.triggerRef,
		}
	)

	renderContent = content => {

		if (!this.dropdownRef.current) return null

		const finalPosition = {}
		const position = getPosition(this.dropdownRef.current)

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
					...(content.props.style || {}),
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
			shouldStopClickPropagation,
			style,
		} = this.props

		const { hasFocus } = this.state

		return (
			<div
				ref={this.dropdownRef}
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
				style={style}
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
	onFocus: noop,
	onBlur: noop,
	triggerShouldNotToggle: false,
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
	// called when focus has moved to within the dropdown trigger
	// onTriggerFocus: PropTypes.func,
	// called when focus has moved to within the dropdown content
	// onContentFocus: PropTypes.func,
	// called when focus has moved to within the dropdown container
	onFocus: PropTypes.func,
	// called when focus has moved to outside the dropdown container
	onBlur: PropTypes.func,
	// should the dropdown intercept and stop events from bubbling up the DOM
	shouldStopClickPropagation: PropTypes.bool,
	// trigger and content
	children: PropTypes.node.isRequired,
	// extra classnames
	className: PropTypes.string,
	// custom styles prop
	style: PropTypes.object,
	// stops onhide from being called when the trigger is clicked while dropdown is open
	triggerShouldNotToggle: PropTypes.bool,
}

export default Dropdown