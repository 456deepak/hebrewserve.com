import React from 'react'
import { Button, Modal } from 'react-bootstrap'

function CommonModal(props) {
  const { show, handleClose, title, id, children } = props
  return (
    <Modal show={show} onHide={handleClose} id={id} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  )
}

export default CommonModal
