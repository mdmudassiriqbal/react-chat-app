import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from "react-router-dom";
import { auth } from '../store/actionCreators';

function Login({ socket }) {
  const authToken = useSelector(({ auth: { token } }) => token);
	const dispatch = useDispatch();
	const onAuth = payload => dispatch(auth(payload));
  const history = useHistory();
  const [formValue, setFormValue] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
          username: formValue,
          password,
        }
		onAuth(payload);

    socket.emit("login", payload)

    // fetch("http://localhost:8000/login", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: formValue,
    //     password,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((resJson) => {
    //     if (resJson.user) {
    //       console.log("json", resJson);
    //       setErr("");
    //       localStorage.setItem("user", resJson.user.username);
    //       localStorage.setItem("token", resJson.token);
    //       localStorage.setItem("channels", resJson.user.channels);
    //       const data = {
    //         username: resJson.user.username,
    //         channel: resJson.user.channels,
    //       };
    //       socket.emit("login", data);
    //       history.push("/channels");
    //     } else {
    //       setErr(resJson.message);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //   });
  };
  if (authToken !== null) {
		return <Redirect to='/channels' />;
	}
  return (
    <div className="d-flex justifiy-content-between align-item-center w-100">
      <form
        onSubmit={submitHandler}
        style={{
          display: "grid",
          placeContent: "center",
          height: "90vh",
          width: "100%",
        }}
      >
        <h1 className="text-center">Login</h1>
        {err && <p className="text-danger">{err}</p>}
        <div className="form-group">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            className="form-control"
            placeholder="Enter name"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mt-2"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3 rounded w-100"
          disabled={!formValue || !password}
        >
          Submit
        </button>
        <div className="text-center">
          <p className="mb-0">or</p>
          <Link to={"/signup"} className="text-center">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
