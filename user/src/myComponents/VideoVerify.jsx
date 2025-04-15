import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button, Container, Modal, CloseButton } from "react-bootstrap";

export default function VideoVerify(props) {
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
    };
    props.onHide(params);
  };

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

  return (
    <>
      {props.show && (
        <Modal
          show={props.show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="position-absolute bg-transparent popUpModal"

          style={{ backgroud: "transparent !important" }}
        >
          <Modal.Body>
            <CloseButton
              className="position-absolute top-0 end-0 py-2 fw-bold "
              onClick={handleClose}
              type="button"
              variant="white"
            />
            <Container>
              {isClient && (
                <ReactPlayer
                  width={"100%"}
                  className="rounded"
                  ref={videoRef}
                  url={props?.url}
                  controls={true}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                />
              )}
            </Container>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
