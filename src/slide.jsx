import React from 'react';
import PropTypes from 'prop-types';

const Slide = ({
	transition,
	translateX,
	time,
	easeFn,
	children,
	handleEndTransition,
}) => (
	<div
		className="magicsel-slide"
		style={{
			transform: `translateX(${translateX}px)`,
			transition: transition ? `transform ${time / 1000}s ${easeFn} 0s` : '',
		}}
		onTransitionEnd={handleEndTransition}
	>
		{children}
	</div>
);

Slide.propTypes = {
	transition: PropTypes.bool.isRequired,
	translateX: PropTypes.number.isRequired,
	time: PropTypes.number.isRequired,
	easeFn: PropTypes.string.isRequired,
	children: PropTypes.arrayOf(PropTypes.element),
	handleEndTransition: PropTypes.func.isRequired,
};

Slide.defaultProps = {
	children: [],
};

export default Slide;
