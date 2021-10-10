import React from 'react';
import PropTypes from 'prop-types';
import { confirmable, createConfirmation } from 'react-confirm';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Confirmation = props => {
	const { title, confirmation, proceedLabel, cancelLabel, show, proceed, enableEscape } = props;

	return (
		<Modal
			show={show}
			onHide={() => proceed(false)}
			backdrop={enableEscape ? true : 'static'}
			keyboard={enableEscape}
		>
			<Modal.Header>
				<Modal.Title style={{ textTransform: 'capitalize' }}>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{confirmation}</Modal.Body>
			<Modal.Footer>
				<Button variant='danger' onClick={() => proceed(false)}>
					{cancelLabel}
				</Button>
				<Button variant='primary' onClick={() => proceed(true)}>
					{proceedLabel}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

Confirmation.propTypes = {
	title: PropTypes.string,
	confirmation: PropTypes.string,
	proceedLabel: PropTypes.string,
	cancelLabel: PropTypes.string,
	show: PropTypes.bool,
	proceed: PropTypes.func,
	enableEscape: PropTypes.bool,
};

export const confirm = (
	title,
	confirmation,
	proceedLabel = 'Okay',
	cancelLabel = 'Cancel',
	enableEscape = true
) =>
	createConfirmation(confirmable(Confirmation))({
		title,
		confirmation,
		proceedLabel,
		cancelLabel,
		enableEscape,
	});
