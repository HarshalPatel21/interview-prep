"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

// const WebcamStreamer = forwardRef((props, ref) => {
//   const webcamRef = useRef<Webcam>(null);
//   const socket = useRef<WebSocket | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [recording, setRecording] = useState(false);

//   useEffect(() => {
//     socket.current = new WebSocket("ws://localhost:8000/ws");
//     socket.current.onopen = () => console.log("WebSocket connected");
//     socket.current.onclose = () => console.log("WebSocket disconnected");
//     return () => socket.current?.close();
//   }, []);

//   const startStreaming = () => {
//     setRecording(true);
//     const stream = webcamRef.current?.video?.srcObject as MediaStream;
//     const mediaRecorder = new MediaRecorder(stream, {
//       mimeType: "video/webm; codecs=vp8",
//     });

//     mediaRecorderRef.current = mediaRecorder;

//     mediaRecorder.ondataavailable = (e) => {
//       if (e.data.size > 0 && socket.current?.readyState === WebSocket.OPEN) {
//         e.data.arrayBuffer().then((buffer) => {
//           socket.current?.send(buffer);
//         });
//       }
//     };

//     mediaRecorder.start(200); // Send data every 200ms
//   };

//   const stopStreaming = () => {
//     setRecording(false);
//     mediaRecorderRef.current?.stop();
//   };

//   return (
//     <div className="my-4">
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         videoConstraints={videoConstraints}
//         className="rounded-lg"
//       />
//       {/* <div className="mt-2 flex gap-4">
//         <button
//           onClick={startStreaming}
//           disabled={recording}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Start Streaming
//         </button>
//         <button
//           onClick={stopStreaming}
//           disabled={!recording}
//           className="bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Stop Streaming
//         </button>
//       </div> */}
//     </div>
//   );
// })
const WebcamStreamer = forwardRef((props, ref) => {
    const webcamRef = useRef<Webcam>(null);
    const socket = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [recording, setRecording] = useState(false);

    // 🔧 Expose functions to parent
    useImperativeHandle(ref, () => ({
        startStreaming,
        stopStreaming,
    }));

    useEffect(() => {
        socket.current = new WebSocket("ws://localhost:8000/ws");
        socket.current.onopen = () => console.log("WebSocket connected");
        socket.current.onclose = () => console.log("WebSocket disconnected");
        return () => socket.current?.close();
    }, []);

    const startStreaming = () => {
        console.log("start streaming");
        setRecording(true);
        const stream = webcamRef.current?.video?.srcObject as MediaStream;
        const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8",
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0 && socket.current?.readyState === WebSocket.OPEN) {
            e.data.arrayBuffer().then((buffer) => {
            socket.current?.send(buffer);
            });
        }
        };

        mediaRecorder.start(200); // Send data every 200ms
    };

    const stopStreaming = () => {
        console.log("stop streaming");
        
        setRecording(false);
        mediaRecorderRef.current?.stop();
    };

    return (
        <div className="my-4">
        <Webcam
            audio={false}
            ref={webcamRef}
            videoConstraints={videoConstraints}
            className="rounded-lg"
        />
        </div>
    );
});

WebcamStreamer.displayName = "WebcamStreamer";

export default WebcamStreamer;
