"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamRecorder() {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current?.video?.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", blob, "interview.mp4");

      try {
        const res = await axios.post("http://localhost:8000/api/upload", formData);
        setFeedback(res.data.feedback);
      } catch (err) {
        console.error("Error uploading video:", err);
        setFeedback("Failed to analyze.");
      }

      setVideoChunks([]);
    };
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="my-4 flex flex-col gap-2">
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        className="rounded-lg"
      />
      <div className="flex gap-4 mt-2">
        <button
          onClick={startRecording}
          className="bg-green-600 text-white px-3 py-1 rounded"
          disabled={recording}
        >
          Start
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-600 text-white px-3 py-1 rounded"
          disabled={!recording}
        >
          Stop & Analyze
        </button>
      </div>
      {feedback && (
        <div className="mt-2 p-2 bg-gray-100 text-gray-800 rounded">
          <strong>Body Language Feedback:</strong> {feedback}
        </div>
      )}
    </div>
  );
}
