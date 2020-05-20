/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element';
import { withInstanceId, compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import withFocusOutside from '../higher-order/with-focus-outside';
import BaseControl from '../base-control';
import Controls from './controls';
import FocalPoint from './focal-point';
import Grid from './grid';
import Media from './media';
import {
	MediaWrapper,
	MediaContainer,
} from './styles/focal-point-picker-style';

export class FocalPointPicker extends Component {
	constructor( props ) {
		super( props );
		this.onMouseMove = this.onMouseMove.bind( this );
		this.state = {
			isDragging: false,
			isGridEnabled: false,
			bounds: {},
			percentages: props.value,
		};
		this.containerRef = createRef();
		this.mediaRef = createRef();
		this.horizontalPositionChanged = this.horizontalPositionChanged.bind(
			this
		);
		this.verticalPositionChanged = this.verticalPositionChanged.bind(
			this
		);
		this.onLoad = this.onLoad.bind( this );
		this.handleOnMouseUp = this.handleOnMouseUp.bind( this );
	}
	componentDidMount() {
		document.addEventListener( 'mouseup', this.handleOnMouseUp );
	}
	componentDidUpdate( prevProps ) {
		if ( prevProps.url !== this.props.url ) {
			this.setState( {
				isDragging: false,
			} );
		}
	}
	componentWillUnmount() {
		document.removeEventListener( 'mouseup', this.handleOnMouseUp );
	}
	calculateBounds() {
		const bounds = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			width: 0,
			height: 0,
		};
		if ( ! this.mediaRef.current ) {
			return bounds;
		}
		const dimensions = {
			width: this.mediaRef.current.clientWidth,
			height: this.mediaRef.current.clientHeight,
		};
		const pickerDimensions = this.pickerDimensions();
		const widthRatio = pickerDimensions.width / dimensions.width;
		const heightRatio = pickerDimensions.height / dimensions.height;
		if ( heightRatio >= widthRatio ) {
			bounds.width = bounds.right = pickerDimensions.width;
			bounds.height = dimensions.height * widthRatio;
			bounds.top = ( pickerDimensions.height - bounds.height ) / 2;
			bounds.bottom = bounds.top + bounds.height;
		} else {
			bounds.height = bounds.bottom = pickerDimensions.height;
			bounds.width = dimensions.width * heightRatio;
			bounds.left = ( pickerDimensions.width - bounds.width ) / 2;
			bounds.right = bounds.left + bounds.width;
		}
		return bounds;
	}
	onLoad() {
		this.setState( {
			bounds: this.calculateBounds(),
		} );
	}
	handleOnMouseUp() {
		this.setState( { isDragging: false } );
	}
	onMouseMove( event ) {
		const { isDragging, bounds } = this.state;
		const { onChange } = this.props;

		if ( isDragging ) {
			const pickerDimensions = this.pickerDimensions();
			const cursorPosition = {
				left: event.pageX - pickerDimensions.left,
				top: event.pageY - pickerDimensions.top,
			};
			const left = Math.max(
				bounds.left,
				Math.min( cursorPosition.left, bounds.right )
			);
			const top = Math.max(
				bounds.top,
				Math.min( cursorPosition.top, bounds.bottom )
			);
			const percentages = {
				x: (
					( left - bounds.left ) /
					( pickerDimensions.width - bounds.left * 2 )
				).toFixed( 2 ),
				y: (
					( top - bounds.top ) /
					( pickerDimensions.height - bounds.top * 2 )
				).toFixed( 2 ),
			};
			this.setState( { percentages }, function() {
				onChange( {
					x: this.state.percentages.x,
					y: this.state.percentages.y,
				} );
			} );
		}
	}
	horizontalPositionChanged( nextValue ) {
		this.positionChangeFromTextControl( 'x', nextValue );
	}
	verticalPositionChanged( nextValue ) {
		this.positionChangeFromTextControl( 'y', nextValue );
	}
	positionChangeFromTextControl( axis, value ) {
		const { onChange } = this.props;
		const { percentages } = this.state;
		const cleanValue = Math.max( Math.min( parseInt( value ), 100 ), 0 );
		percentages[ axis ] = ( cleanValue ? cleanValue / 100 : 0 ).toFixed(
			2
		);
		this.setState( { percentages }, function() {
			onChange( {
				x: this.state.percentages.x,
				y: this.state.percentages.y,
			} );
		} );
	}
	pickerDimensions() {
		if ( this.containerRef.current ) {
			return {
				width: this.containerRef.current.clientWidth,
				height: this.containerRef.current.clientHeight,
				top:
					this.containerRef.current.getBoundingClientRect().top +
					document.body.scrollTop,
				left: this.containerRef.current.getBoundingClientRect().left,
			};
		}
		return {
			width: 0,
			height: 0,
			left: 0,
			top: 0,
		};
	}
	handleFocusOutside() {
		this.setState( {
			isDragging: false,
		} );
	}
	render() {
		const {
			autoPlay,
			instanceId,
			url,
			value,
			label,
			help,
			className,
		} = this.props;
		const { bounds, isDragging, isGridEnabled, percentages } = this.state;
		const pickerDimensions = this.pickerDimensions();
		const iconCoordinates = {
			left:
				value.x * ( pickerDimensions.width - bounds.left * 2 ) +
				bounds.left,
			top:
				value.y * ( pickerDimensions.height - bounds.top * 2 ) +
				bounds.top,
		};

		const classes = classnames(
			'components-focal-point-picker-control',
			className
		);

		const id = `inspector-focal-point-picker-control-${ instanceId }`;

		return (
			<BaseControl
				label={ label }
				id={ id }
				help={ help }
				className={ classes }
			>
				<MediaWrapper className="components-focal-point-picker-wrapper">
					<MediaContainer
						className="components-focal-point-picker"
						onMouseDown={ () =>
							this.setState( { isDragging: true } )
						}
						onDragStart={ () =>
							this.setState( { isDragging: true } )
						}
						onMouseUp={ this.handleOnMouseUp }
						onDrop={ () => this.setState( { isDragging: false } ) }
						onMouseMove={ this.onMouseMove }
						ref={ this.containerRef }
						role="button"
						tabIndex="-1"
					>
						{ isGridEnabled && (
							<Grid
								style={ {
									width: bounds.width,
									height: bounds.height,
								} }
							/>
						) }
						<Media
							alt="Dimensions helper"
							autoPlay={ autoPlay }
							mediaRef={ this.mediaRef }
							onLoad={ this.onLoad }
							src={ url }
						/>
						<FocalPoint
							coordinates={ iconCoordinates }
							isDragging={ isDragging }
						/>
					</MediaContainer>
				</MediaWrapper>
				<Controls
					percentages={ percentages }
					onHorizontalChange={ this.horizontalPositionChanged }
					onVerticalChange={ this.verticalPositionChanged }
					isGridEnabled={ isGridEnabled }
					onToggleGrid={ ( next ) =>
						this.setState( { isGridEnabled: next } )
					}
				/>
			</BaseControl>
		);
	}
}

FocalPointPicker.defaultProps = {
	autoPlay: true,
	url: null,
	value: {
		x: 0.5,
		y: 0.5,
	},
	onChange: () => {},
};

export default compose( [ withInstanceId, withFocusOutside ] )(
	FocalPointPicker
);
