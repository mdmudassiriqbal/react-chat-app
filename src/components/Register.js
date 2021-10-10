import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  const [formValue, setFormValue] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formValue,
        password,
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          history.push("/");
        } else {
          setErr(resJson.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
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
        <h1 className="text-center">Sign-up</h1>
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
      </form>
    </div>
  );
}

export default Register;
