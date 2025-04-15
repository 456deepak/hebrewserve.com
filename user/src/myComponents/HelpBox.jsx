import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

import ReactPlayer from "react-player";
import { Container, CloseButton } from "react-bootstrap";
import { ModalClose } from '@mui/joy';
import { Grid } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 1,
};

export default function HelpingModal(props) {

    const [isClient, setIsClient] = useState(false);
    const videoRef = useRef();

    useEffect(() => setIsClient(true), []);

    return <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.show}
        onClose={() => props?.setHelpBox({ status: false, url: null })}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
            backdrop: {
                timeout: 500,
            }
        }}
    >
        {/* <ModalClose /> */}
        <Fade in={props.show}>
            <Box sx={style}>
                {isClient && (
                    <>
                        <ReactPlayer
                            width={"100%"}
                            height={"100%"}
                            className="rounded"
                            ref={videoRef}
                            url={props?.url}
                            controls={true}
                            playing={true}
                        />
                    </>
                )}
            </Box>
        </Fade>
    </Modal>
}