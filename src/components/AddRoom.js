import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

// const options = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

function AddRoom({ show, handleClose, setReload, socket }) {
  const [roomName, setRoomName] = useState("");
  const [userOption, setUserOption] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  console.log(
    "🚀 ~ file: AddRoom.js ~ line 15 ~ AddRoom ~ selectedUser",
    selectedUser
  );
  const user = localStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:8000/user").then(async (res) => {
      const data = await res.json();
      const newData = data.map((item) => ({
        id: item._id,
        label: item.username,
        value: item.username,
      }));
      console.log("🚀 ~ file: AddRoom.js ~ line 18 ~ fetch ~ data", data);
      setUserOption(newData);
    });
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    await socket.emit("addChannel", { roomName, username: selectedUser },(response)=>{
      console.log('response after added==>',response);
      setReload((prevFetch) => prevFetch + 1);
    });
    handleClose();
  };
  const handleSelect = (e) => {
    setSelectedUser(e.map((element) => element.value));
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit}>
            <div>
              <input
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
                placeholder="enter room name"
                className="messageInput"
              />
              <div className='pt-2'>
                <label>Select Participant</label>
                <Select
                  options={userOption}
                  isMulti
                  onChange={handleSelect}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="pt-2 text-end">
              <button className="btn btn-danger m-1" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary m-1"
                disabled={!roomName || selectedUser.length<=0}
              >
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddRoom;
