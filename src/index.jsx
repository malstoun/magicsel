import React from 'react';

class Magicsel extends React.Component {
	state = {
		currentTranslateX: 0
	};

	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.timeoutFunction = this.timeoutFunction.bind(this);
		this.enableTransition = this.enableTransition.bind(this);
		this.disableTransition = this.disableTransition.bind(this);
		this.handleEndTransition = this.handleEndTransition.bind(this);

		this.count = React.Children.count(props.children);
		this.currentSlide = 0;
	}

	handleStart(e) {
		this.setState({
			translateX: this.state.currentTranslateX,
			position: e.touches[0].screenX,
			startX: e.touches[0].screenX
		})
	}

	handleMove({ touches: [t] }) {
		this.setState((state) => {
			return {
				translateX: state.translateX + (t.screenX - state.position),
				position: t.screenX
			}
		})
	}

	handleEnd({ changedTouches: [t] }) {
		if (this.state.translateX > 0) {
			this.animate(0);

			return
		}

		if (this.state.startX === t.screenX) {
			return
		}

		const max = Math.max(t.screenX, this.state.startX);
		const min = Math.min(t.screenX, this.state.startX);

		const direction = t.screenX - this.state.startX > 0 ? -1 : 1;

		const width = this.component.getBoundingClientRect().width;

		if (max - min > 100 && this.currentSlide + direction < this.count) {
			this.currentSlide += direction;
			this.animate(this.currentSlide * -width * direction);
		} else {
			this.animate(this.state.currentTranslateX);
		}
	}

	timeoutFunction(to) {
		const p = new Promise((r) => {
			this.setState((state) => ({
				translateX: to,
				currentTranslateX: to
			}), r);
		});

		return p;
	}

	enableTransition() {
		const p = new Promise((r) => {
			this.setState({
				transition: true
			}, r)
		});

		return p;
	}

	disableTransition() {
		this.setState({
			transition: false
		})
	}

	animate(to) {
		this.enableTransition()
			.then(() => this.timeoutFunction(to))
	}

	handleEndTransition() {
		this.disableTransition();
	}

	render() {
		const {
			translateX,
			transition
		} = this.state;

		return (
			<div
				className="magicsel"
				onTouchStart={this.handleStart}
				onTouchMove={this.handleMove}
				onTouchEnd={this.handleEnd}
				ref={(component) => { this.component = component }}
				style={{
					display: 'flex',
					overflow: 'hidden'
				}}
			>
				{
					React.Children.map(this.props.children, (child) => {
						return (
							<Slide
								translateX={translateX}
								transition={transition}
								handleEndTransition={this.handleEndTransition}
								time={this.props.time}
								easeFn={this.props.easeFn}
							>
								{child}
							</Slide>
						)
					})
				}
			</div>
		)
	}
}

class Slide extends React.Component {
	render() {
		const {
			transition,
			time,
			easeFn
		} = this.props;

		return (
			<div
				className="magicsel-slide"
				style={{
					transform: `translateX(${this.props.translateX}px)`,
					transition: transition ? `transform ${time / 1000}s ${easeFn} 0s` : ''
				}}
				onTransitionEnd={this.props.handleEndTransition}
			>
				{this.props.children}
			</div>
		)
	}
}

export default Magicsel;
