import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AddRoom from './AddRoom';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirm } from './Confirmation/Confirmation';
import { Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import Poster from './Poster/Poster';

function ChannelList({ socket, routes }) {
  console.log(routes);
  const Routes = routes[0];
	const [list, setList] = useState([]);
	console.log('🚀 ~ file: ChannelList.js ~ line 7 ~ ChannelList ~ list', list);
	const [isAddRoom, setIsAddRomm] = useState(false);
	const [reload, setReload] = useState(0);
	const user = localStorage.getItem('username');
	const storedRoom = localStorage.getItem('room');

	useEffect(() => {
		fetch('http://localhost:8000/rooms/' + user).then(async response => {
			let data = await response.json();
			console.log(data);
			setList([...data.channels]);
		});
	}, [reload, user]);

	useEffect(() => {
		socket.on('channelAdded', data => {
			console.log('channelAdded', data);
			setReload(prevFetch => prevFetch + 1);
		});
	}, [socket]);

	const currentUser = localStorage.getItem('username') || 'Guest';
	const setChannel = async name => {
		console.log('channel set', name);
		localStorage.setItem('room', name);
		await fetch('http://localhost:8000/room', {
			method: 'PATCH',
			crossDomain: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: ''
			},
			mode: 'cors',
			body: JSON.stringify({
				name,
				username: user
			})
		});
		socket.emit('join', {
			channelToJoin: name,
			username: user,
			prevChannel: storedRoom || null
		});
	};
	const toggleAddRoom = () => {
		setIsAddRomm(prevIsAddRoom => !prevIsAddRoom);
	};
	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href=''
			ref={ref}
			onClick={e => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{/* custom icon */}
			{children}
			<Icon icon='carbon:overflow-menu-vertical' />
		</a>
	));
	const deleteChat = async item => {
		const isDelete = await confirm('Delete chat', 'Are you sure want to delete chat');
		if (isDelete) {
			await fetch('http://localhost:8000/delete-chat', {
				method: 'POST',
				crossDomain: true,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: ''
				},
				mode: 'cors',
				body: JSON.stringify({
					id: item.id,
					username: user
				})
			});
		}
		setReload(prevFetch => prevFetch + 1);
	};
	const addMember = item => {
		console.log('item==>', item);
	};
	return (
		<div className='m-4 h-100'>
			{isAddRoom && (
				<AddRoom
					show={isAddRoom}
					handleClose={toggleAddRoom}
					setReload={setReload}
					socket={socket}
				/>
			)}
			<button onClick={toggleAddRoom} className='sendButton '>
				Add Room
			</button>
			<div className='d-flex justify-content-between h-100'>
				<div>
					{list &&
						list.map((item, indx) => (
							<div className='d-flex flex-row' key={item._id}>
								<Link to={`/channels/chat-room/${item.name}`} style={{ textDecoration: 'none' }}>
									<div
										className={`border-bottom pt-3 ${item?.isNewMsg ? 'text-danger' : ''}`}
										onClick={() => setChannel(item.name)}
									>
										<h6>
											{item.name}
											{item?.newMsgCount > 0 && (
												<span className='badge badge-secondary bg-primary'>
													{item?.newMsgCount}
												</span>
											)}
										</h6>
									</div>
								</Link>
								<div className='mt-3'>
									<Dropdown>
										<Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
										<Dropdown.Menu size='sm' title=''>
											<Dropdown.Item onClick={() => deleteChat(item)}>Delete</Dropdown.Item>
											<Dropdown.Item onClick={() => addMember(item)}>Add Member</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							</div>
						))}
				</div>
				<Switch>
				<Route path={Routes.path}>
          <Routes.component socket={socket} />
        </Route>
        <Route component={Poster} />
				</Switch>
			</div>
		</div>
	);
}

export default ChannelList;
