export const isDefined = a => a !== undefined

export const getPageOffset = () => ({
	x: isDefined(window.pageXOffset) ?
		window.pageXOffset : 
		(document.documentElement || document.body.parentNode || document.body)
			.scrollLeft,
	y: isDefined(window.pageYOffset) ?
		window.pageYOffset : 
		(document.documentElement || document.body.parentNode || document.body)
			.scrollTop,
})

export const noop = () => {}