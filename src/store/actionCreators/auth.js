import { toast } from 'react-toastify';

import {
	AUTH_START,
	AUTH_SUCCESS,
	AUTH_FAIL,
	AUTH_LOGOUT,
} from '../actionTypes';


export const authStart = () => {
	toast.dismiss();
	return {
		type: AUTH_START,
	};
};

export const authSuccess = (token, userId,  userName) => ({
	type: AUTH_SUCCESS,
	payload: { token, userId, userName },
});

export const authFail = error => ({ type: AUTH_FAIL, payload: { error } });

export const logout = (type = 'MANUAL') => {
	localStorage.removeItem('token');
	localStorage.removeItem('userid');
	localStorage.removeItem('username');

	return {
		type: AUTH_LOGOUT,
	};
};


export const auth = ({ username, password }) => {
	return async dispatch => {
		try {
			dispatch(authStart());
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
				  Accept: "application/json",
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({
				  username,
				  password,
				}),
			  });
			  const {user, token} = await response.json();
			localStorage.setItem('token', token);
			localStorage.setItem('userid', user._id);
			localStorage.setItem('username', user.username);
			dispatch(authSuccess(token, user._id, user.username));
		} catch (error) {
			console.log(error);
			dispatch(authFail(error.message));
		}
	};
};

export const authCheckState = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout('CHECK'));
		} else {
			const userId = localStorage.getItem('userid');
			const userName = localStorage.getItem('username');
			dispatch(authSuccess(token, userId, userName));
		}
	};
};
