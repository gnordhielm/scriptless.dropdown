import isDefined from './isDefined'

export default () => ({
	x: isDefined(window.pageXOffset) ?
		window.pageXOffset : 
		(document.documentElement || document.body.parentNode || document.body)
			.scrollLeft,
	y: isDefined(window.pageYOffset) ?
		window.pageYOffset : 
		(document.documentElement || document.body.parentNode || document.body)
			.scrollTop,
})