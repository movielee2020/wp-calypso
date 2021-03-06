import React from 'react';

/**
 * Internal dependencies
 */
import FormTextInput from 'components/forms/form-text-input';
import Gridicon from 'components/gridicon';

export default React.createClass( {
	displayName: 'JetpackConnectExampleActivate',

	render() {
		return (
			<div className="jetpack-connect__example">
				<div className="jetpack-connect__browser-chrome jetpack-connect__site-url-input-container">
					<div className="jetpack-connect__browser-chrome-dot"></div>
					<div className="jetpack-connect__browser-chrome-dot"></div>
					<div className="jetpack-connect__browser-chrome-dot"></div>

					<div className="site-address-container">
						<Gridicon
							size={ 24 }
							icon="globe" />
						<FormTextInput
							className="jetpack-connect__browser-chrome-url"
							disabled="true"
							placeholder={ this.props.url } />
					</div>

				</div>
				{
					this.props.isInstall
						? <img src="/calypso/images/jetpack/jetpack-connect-activate.png" />
						: <img src="/calypso/images/jetpack/jetpack-connect-activate-from-plugins.png" />
				}
			</div>
		);
	}
} );
