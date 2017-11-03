import React from 'react';
import PropTypes from 'prop-types';

import Slide from './slide';

class Magicsel extends React.Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.handleEnd = this.handleEnd.bind(this);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);

		this.timeoutFunction = this.timeoutFunction.bind(this);
		this.enableTransition = this.enableTransition.bind(this);
		this.disableTransition = this.disableTransition.bind(this);
		this.handleEndTransition = this.handleEndTransition.bind(this);

		this.count = React.Children.count(props.children);
		this.currentSlide = 0;

		this.state = {
			currentTranslateX: 0,
		};
	}

	handleStart({ touches: [t] }) {
		this.setState({
			translateX: this.state.currentTranslateX,
			startX: t.screenX,
		});
	}

	handleMove({ touches: [t] }) {
		this.setState(state => ({
			translateX: state.translateX + (t.screenX - state.position),
		}));
	}

	handleEnd({ changedTouches: [t] }) {
		if (this.state.translateX > 0) {
			this.animate(0);

			return;
		}

		if (this.state.startX === t.screenX) {
			return;
		}

		const max = Math.max(t.screenX, this.state.startX);
		const min = Math.min(t.screenX, this.state.startX);

		const direction = t.screenX - this.state.startX > 0 ? -1 : 1;

		const {
			width,
		} = this.component.getBoundingClientRect();

		if (max - min > 100 && this.currentSlide + direction < this.count) {
			this.currentSlide += direction;
			this.animate(this.currentSlide * -width * direction);
		} else {
			this.animate(this.state.currentTranslateX);
		}
	}

	handleMouseDown(e) {
		e.preventDefault();
		this.setState({
			translateX: this.state.currentTranslateX,
			startX: e.screenX,
			mousePressed: true,
		});
	}

	handleMouseMove({ screenX }) {
		if (this.state.mousePressed) {
			this.setState(state => ({
				translateX: state.translateX + (screenX - state.position),
				position: screenX,
			}));
		}
	}

	handleMouseUp({ screenX }) {
		this.setState({
			mousePressed: false,
		});

		if (this.state.translateX > 0) {
			this.animate(0);

			return;
		}

		if (this.state.startX === screenX) {
			return;
		}

		const max = Math.max(screenX, this.state.startX);
		const min = Math.min(screenX, this.state.startX);

		const direction = screenX - this.state.startX > 0 ? -1 : 1;

		const {
			width,
		} = this.component.getBoundingClientRect();

		if (max - min > 100 && this.currentSlide + direction < this.count) {
			this.currentSlide += direction;
			this.animate(this.currentSlide * -width * direction);
		} else {
			this.animate(this.state.currentTranslateX);
		}
	}

	timeoutFunction(to) {
		return new Promise((r) => {
			this.setState(() => ({
				translateX: to,
				currentTranslateX: to,
			}), r);
		});
	}

	enableTransition() {
		return new Promise((r) => {
			this.setState({
				transition: true,
			}, r);
		});
	}

	disableTransition() {
		this.setState({
			transition: false,
		});
	}

	animate(to) {
		this.enableTransition()
			.then(() => this.timeoutFunction(to));
	}

	handleEndTransition() {
		this.disableTransition();
	}

	render() {
		const {
			translateX,
			transition,
		} = this.state;

		return (
			<div
				className="magicsel"
				onTouchStart={this.handleStart}
				onTouchMove={this.handleMove}
				onTouchEnd={this.handleEnd}
				onMouseDown={this.handleMouseDown}
				onMouseMove={this.handleMouseMove}
				onMouseUp={this.handleMouseUp}
				ref={(component) => { this.component = component; }}
				style={{
					display: 'flex',
					overflow: 'hidden',
				}}
				role="Banner"
			>
				{
					React.Children.map(this.props.children, child => (
						<Slide
							translateX={translateX}
							transition={transition}
							handleEndTransition={this.handleEndTransition}
							time={this.props.time}
							easeFn={this.props.easeFn}
						>
							{child}
						</Slide>
					))
				}
			</div>
		);
	}
}

Magicsel.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.arrayOf(PropTypes.element),
	]),
	time: PropTypes.number.isRequired,
	easeFn: PropTypes.string.isRequired,
};

Magicsel.defaultProps = {
	children: [],
};

export default Magicsel;
