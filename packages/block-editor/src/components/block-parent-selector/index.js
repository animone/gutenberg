/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';

/**
 * Block parent selector component, displaying the hierarchy of the
 * current block selection as a single icon to "go up" a level.
 *
 * @return {WPElement} Parent Block Selector.
 */
export default function BlockParentSelector() {
	const { selectBlock } = useDispatch( 'core/block-editor' );
	const { parents } = useSelect( ( select ) => {
		const { getSelectedBlockClientId, getBlockParents } = select(
			'core/block-editor'
		);
		const selectedBlockClientId = getSelectedBlockClientId();
		return {
			parents: getBlockParents( selectedBlockClientId ),
		};
	}, [] );

	const firstParentClientID = parents[ parents.length - 1 ];

	const { parentBlockType } = useSelect( ( select ) => {
		const { getBlockName } = select( 'core/block-editor' );
		const parentBlockName = getBlockName( firstParentClientID );
		return {
			parentBlockType: getBlockType( parentBlockName ),
		};
	}, [] );

	if ( parents && parents.length ) {
		return (
			<div
				className="block-editor-block-parent-selector"
				key={ firstParentClientID }
			>
				<Button
					className="block-editor-block-parent-selector__button"
					onClick={ () => selectBlock( firstParentClientID ) }
					label={ sprintf(
						/* translators: %s: Name of the block's parent. */
						__( 'Select parent (%s)' ),
						parentBlockType.title
					) }
					showTooltip
					icon={ <BlockIcon icon={ parentBlockType.icon } /> }
				/>
			</div>
		);
	}

	return null;
}
