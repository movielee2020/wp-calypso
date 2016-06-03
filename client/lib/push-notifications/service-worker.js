/**
 *  This file is served as-is as /service-worker.js
 **/

/* eslint-disable */
'use strict';
/* eslint-enable */

var queuedMessages = [];

self.addEventListener( 'install', function( event ) {
	event.waitUntil( self.skipWaiting() );
} );

self.addEventListener( 'activate', function( event ) {
	event.waitUntil( self.clients.claim() );
} );

self.addEventListener( 'push', function( event ) {
	var notification;

	if ( typeof event.data !== 'object' && typeof event.data.json !== 'function' ) {
		return;
	}

	notification = event.data.json();

	event.waitUntil(
		self.registration.showNotification( notification.msg, {
			tag: 'note_' + notification.note_id,
			icon: notification.icon,
			timestamp: notification.note_timestamp
		} )
	);
} );

self.addEventListener( 'notificationclick', function( event ) {
	event.notification.close();

	event.waitUntil(
		self.clients.matchAll().then( function( clientList ) {
			if ( clientList.length > 0 ) {
				clientList[0].postMessage( { action: 'openPanel' } );
				try {
					clientList[0].focus();
				} catch ( err ) {
					// Client didn't need focus
				}
			} else {
				queuedMessages.push( { action: 'openPanel' } );
				self.clients.openWindow( '/' );
			}
		} )
	);
} );

self.addEventListener( 'message', function( event ) {
	if ( ! ( 'action' in event.data ) ) {
		return;
	}

	switch ( event.data.action ) {
		case 'sendQueuedMessages':
			self.clients.matchAll().then( function( clientList ) {
				var queuedMessage;

				if ( clientList.length > 0 ) {
					queuedMessage = queuedMessages.shift();
					while ( queuedMessage ) {
						clientList[0].postMessage( queuedMessage );
						queuedMessage = queuedMessages.shift();
					}
				}
			} );
			break;
	}
} );
