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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    height: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    // p: 1,
};

export default function TransitionsModal(props) {

    const [isClient, setIsClient] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef();

    const handleClose = () => {
        setIsPlaying(false);
        const totalDuration = videoRef.current.getDuration();
        const params = {
            duration: parseInt(totalDuration).toFixed(0),
            elapsedTime: elapsedTime,
            setElapsedTime: setElapsedTime
        };
        props.onHide(params)
    };
    
    useEffect(() => {
        console.log(elapsedTime)
    }, [elapsedTime])

    const handlePlay = () => {
        console.log("playing");
        setIsPlaying(true);
    };

    const handlePause = () => {
        console.log("paused");
        setIsPlaying(false);
    };

    const handleEnded = () => {
        console.log("ended");
        setIsPlaying(false);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return <Modal
    
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.show}
        onClose={handleClose}
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
                    <ReactPlayer
                        width={"100%"}
                        height={"100%"}
                        className="rounded"
                        ref={videoRef}
                        url={props?.url}
                        controls={true}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleEnded}
                    />
                )}
            </Box>
        </Fade>
    </Modal>
}