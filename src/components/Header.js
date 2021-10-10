import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './../store/actionCreators';
function Header() {
	const dispatch = useDispatch();
	const onLogout = () => dispatch(logout());
	const { token } = useSelector(({ auth: authData }) => authData);

	return (
		<div>
			<nav className='navbar navbar-light bg-primary'>
				<h3>Chat App</h3>
				{token && (
					<button className='btn btn-secondary' onClick={() => onLogout()}>
						logout
					</button>
				)}
			</nav>
		</div>
	);
}

export default Header;
