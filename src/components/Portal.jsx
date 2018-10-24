import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { classNames } from '@leiops/helpers'
import { FRAME_RATE_MS } from '../constants'
import { isDefined, getPageOffset, noop } from '../utils'
import _debounce from 'lodash.debounce'
import Trigger from './Trigger'
import Content from './Content'

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

const squelchEvent = event => { event.stopPropagation() }

class Dropdown extends React.Component {

	elementRef = React.createRef()

	portalRef = React.createRef()

	portalMountElement = document.createElement('div')

	state = {
		hasFocus: false,
	}

	componentDidMount = () => {
		document.body.appendChild(this.portalMountElement)
		window.addEventListener('click', this.handleWindowClick)
		window.addEventListener('scroll', this.selectiveForceUpdate, { 
			passive: true
		})
		window.addEventListener('resize', this.selectiveForceUpdate, { 
			passive: true
		})
	}
	
	static getDerivedStateFromProps = (props, state) => {
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
				findDOMNode(this), 
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
	
	componentWillUnmount = () => {
		document.body.removeChild(this.portalMountElement)
		window.removeEventListener('click', this.handleWindowClick)
		window.removeEventListener('scroll', this.selectiveForceUpdate)
		window.removeEventListener('resize', this.selectiveForceUpdate)
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
	
	selectiveForceUpdate = _debounce(() => {
		if (!this.state.hasFocus) return
		this.forceUpdate()
	}, FRAME_RATE_MS)

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
		
		const dropdownNode = findDOMNode(this)
		const isNotInDropdown = (
			dropdownNode &&
			event.target.constructor.name.includes('Element') &&
			event.target !== dropdownNode &&
			!dropdownNode.contains(event.target)
		)

		const portalElement = findDOMNode(this.portalRef.current)
		const isNotInPortal = (
			portalElement &&
			event.target.constructor.name.includes('Element') &&
			event.target !== portalElement &&
			!portalElement.contains(event.target)
		)

		let wasRemovedFromDropdown = false
		for (let i in this.removedNodes)
			if (this.removedNodes[i] === event.target ||
				this.removedNodes[i].contains(event.target))
			{
				wasRemovedFromDropdown = true
				break
			}

		if (isNotInDropdown && 
			isNotInPortal && 
			!wasRemovedFromDropdown) this.hide()
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

		const portalElement = findDOMNode(this.portalRef.current)
		const isInPortal = (
			portalElement && 
			event.target.constructor.name.includes('Element') &&
			(
				event.target === portalElement ||
				portalElement.contains(event.target)
			)
		)

		if (isInDropdown || isInPortal) this.show()
	}

	handleMouseLeave = event => {
		if (!this.props.isHoverable) return
		if (!this.state.hasFocus) return

		const dropdownNode = findDOMNode(this)
		const isNotInDropdown = (
			dropdownNode &&
			event.relatedTarget.constructor.name.includes('Element') &&
			event.relatedTarget !== dropdownNode &&
			!dropdownNode.contains(event.relatedTarget)
		)

		const portalElement = findDOMNode(this.portalRef.current)
		const isNotInPortal = (
			portalElement &&
			event.relatedTarget.constructor.name.includes('Element') &&
			event.relatedTarget !== portalElement &&
			!portalElement.contains(event.relatedTarget)
		)

		if (isNotInDropdown && isNotInPortal) this.hide()
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
		}
	)

	renderContent = content => {
		if (!this.elementRef.current) return null

		const finalPosition = {}
		const position = getPosition(this.elementRef.current)

		const isBelow = (position.bottom + minDropdownHeight) < window.innerHeight

		if (isBelow)
			finalPosition.top = position.bottom
		else
			finalPosition.bottom =  window.innerHeight - position.top

		finalPosition[this.props.justify] = position[this.props.justify]

		return ReactDom.createPortal(
			React.cloneElement(
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
			),
			this.portalMountElement
		)
	}

	render = () => {

		const {
			children,
			className,
			isDisabled,
			shouldStopClickPropagation
		} = this.props

		const hasFocus = this.state.hasFocus

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
	justify: 'right',
	isHoverable: false,
	shouldStopClickPropagation: false,
	className: '',
	onHide: noop,
	onShow: noop,
}

Dropdown.propTypes = {
	// left or right, the component will try to keep the specified side justified to the dropdown trigger as long as there is space
	justify: PropTypes.string,
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