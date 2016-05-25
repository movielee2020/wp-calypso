/**
 * External dependencies
 */
import io from 'socket.io-client';

/**
 * Internal dependencies
 */
import { cssBuildFailed, cssBuilding } from 'state/application/actions';
import i18n from 'lib/mixins/i18n';

// https://developer.mozilla.org/en/docs/Web/HTML/Element/link
var standardAttributes = [
	'crossorigin',
	'href',
	'hreflang',
	'media',
	'rel',
	'sizes',
	'title',
	'type'
];

/**
 * @returns {object} 
 */
function bustHashForHrefs( { name, oldValue } ) {
    const value = 'href' === name
        ? `${ oldValue.split( '?' ).shift() }?v=${ new Date().getTime() }`
        : oldValue;

    return { name, value };
};

/**
 * @returns {boolean} 
 */
function isChanged( href, changedFiles ) {
    // "/calypso/style-debug.css?v=5a1db7fee7" -> "style-debug.css"
    const path = href.split( '?' ).shift().split( '/' ).pop();

    return changedFiles.some( file => file === path );
}

var CssHotReload = {

	/**
	 * Initialize client CSS hot-reload handler
	 */
	init: function( reduxStore ) {

		var namespace = location.protocol + '//' + location.host + '/css-hot-reload';
		var socket = io.connect( namespace );

		socket.on( 'css-hot-reload', function( data ) {
			switch( data.status ) {
				case 'reload':
					// Turn HTMLCollection to standard list
					var elems = document.head.getElementsByTagName( 'link' );
					elems = [].slice.call( elems );
					elems.forEach( function( oldLink ) {
						if ( ( 'href' in oldLink ) && isChanged( oldLink.href, data.changedFiles ) ) {
							console.log( 'Reloading CSS: ', oldLink );
							// Remove old .css and insert new one in the same spot
							var newLink = document.createElement( 'link' );
							// Copy <link> standard attributes
							standardAttributes
								.filter( attr => oldLink.hasAttribute( attr ) )
								.map( attr => ( { name: attr, oldValue: oldLink.getAttribute( attr ) } ) )
								.map( bustHashForHrefs )
								.forEach( ( { name, value } ) => newLink.setAttribute( name, value ) );
							oldLink.parentNode.replaceChild( newLink, oldLink );
						}
					} );
					break;
				case 'building':
					reduxStore.dispatch( cssBuilding( i18n.translate( 'Building CSS…' ) ) );
					break
				case 'build-failed':
					reduxStore.dispatch( cssBuildFailed( i18n.translate( 'CSS build failed.' ) ) );
					break;
			}
		} );
	}
}

/**
 * Module exports
 */
module.exports = CssHotReload;
