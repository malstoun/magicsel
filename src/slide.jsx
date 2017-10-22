import React from 'react';

export default ({
	transition,
	translateX,
	time,
	easeFn,
	children,
	handleEndTransition
}) => (
	<div
		className="magicsel-slide"
		style={{
			transform: `translateX(${translateX}px)`,
			transition: transition ? `transform ${time / 1000}s ${easeFn} 0s` : ''
		}}
		onTransitionEnd={handleEndTransition}
	>
		{children}
	</div>
)
