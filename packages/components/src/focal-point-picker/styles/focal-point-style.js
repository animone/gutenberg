/**
 * External dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import { color } from '../../utils/style-mixins';

export const FocalPointWrapper = styled.div`
	box-sizing: border-box;
	background-color: transparent;
	cursor: grab;
	height: 30px;
	opacity: 0.8;
	position: absolute;
	will-change: transform;
	width: 30px;
	z-index: 10000;

	&.is-dragging {
		cursor: grabbing;
	}
`;

export const PointerIconSVG = styled( SVG )`
	display: block;
	height: 100%;
	left: -15px;
	position: absolute;
	top: -15px;
	width: 100%;
`;

export const PointerIconPathOutline = styled( Path )`
	fill: white;
`;

export const PointerIconPathFill = styled( Path )`
	fill: ${color( 'ui.brand' )};
`;
