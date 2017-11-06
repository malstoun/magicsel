import React from 'react';
import PropTypes from 'prop-types';

import Slide from './slide.jsx';

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

		this.handleMoveEnd = this.handleMoveEnd.bind(this);

		this.count = React.Children.count(props.children);

		this.state = {
			currentTranslateX: 0,
			currentSlide: 0,
		};
	}

	handleStart({ touches: [t] }) {
		this.setState({
			translateX: this.state.currentTranslateX,
			position: t.screenX,
			startX: t.screenX,
		});
	}

	handleMove({ touches: [t] }) {
		this.setState(state => ({
			translateX: state.translateX + (t.screenX - state.position),
			position: t.screenX,
		}));
	}

	handleEnd({ changedTouches: [t] }) {
		if (this.state.translateX > 0) {
			this.animate(0);

			return;
		}

		this.handleMoveEnd(t.screenX);
	}

	handleMouseDown(e) {
		e.preventDefault();
		this.setState({
			translateX: this.state.currentTranslateX,
			position: e.screenX,
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

		this.handleMoveEnd(screenX);
	}

	handleMoveEnd(screenX) {
		if (this.state.startX === screenX) {
			return;
		}

		const max = Math.max(screenX, this.state.startX);
		const min = Math.min(screenX, this.state.startX);

		const direction = screenX - this.state.startX > 0 ? -1 : 1;

		const {
			width,
		} = this.component.getBoundingClientRect();

		if (max - min > (width / 4) && this.state.currentSlide + direction < this.count) {
			this.animate(
				-(this.state.currentSlide * width) + (-width * direction),
				this.state.currentSlide + direction,
			);
		} else {
			this.animate(
				this.state.currentTranslateX,
				this.state.currentSlide,
			);
		}
	}

	timeoutFunction(to) {
		return new Promise((r) => {
			this.setState(() => ({
				translateX: to,
				currentTranslateX: to,
				startX: 0,
				position: 0,
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

	animate(to, nextSlide) {
		this.enableTransition()
			.then(() => this.timeoutFunction(to))
			.then(() => {
				this.setState({
					currentSlide: nextSlide,
				});
			});
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
