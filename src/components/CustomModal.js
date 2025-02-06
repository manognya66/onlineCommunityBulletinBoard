import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#f4f4f9',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '8px',
  border: 'none',
  outline: 'none',
  fontFamily: '"Open Sans", sans-serif',
};

function CustomModal({ showModal, onClose, message }) {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}
        >
          {message}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={onClose}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

CustomModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default CustomModal;
