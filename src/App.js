import { useEffect, useCallback } from 'react';
import Header from "./components/Header";
import io from "socket.io-client";
import RoutesWrapper from "./routes";
import { ToastContainer, Zoom } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { authCheckState } from './store/actionCreators';
import "./App.css";

const socket = io.connect("/");
function App() {
	const dispatch = useDispatch();
	const onTryAutoLogin = useCallback(() => dispatch(authCheckState()), [dispatch]);

	useEffect(() => {
		const data = {username: localStorage.getItem('username') || null}
		onTryAutoLogin();
		socket.emit("login", data)
	}, [onTryAutoLogin]);
  return (
    <div className="App">
      <ToastContainer
				position='top-right'
				transition={Zoom}
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
			/>
      <Header />
     <RoutesWrapper socket={socket} />
    </div>
  );
}

export default App;
