import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './NotFound.scss';

const NotFound = () => (
	<div className='NotFound'>
		<Button as={Link} to='/' className='mb-4'>
			Go To Home Page
		</Button>
	</div>
);

export default NotFound;
