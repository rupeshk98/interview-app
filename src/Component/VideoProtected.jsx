import React, { useState, useRef, useEffect } from "react";
import { Camera, AlertTriangle, Check } from "lucide-react";

const videoProtected = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [cheatProbability, setCheatProbability] = useState(0);
  const [isCheating, setIsCheating] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Simulated cheat detection logic
  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        // Simulate cheat probability calculation
        const randomCheatFactor = Math.random();
        const newCheatProbability = Math.min(
          1,
          cheatProbability + randomCheatFactor * 0.1
        );
        setCheatProbability(newCheatProbability);

        // Cheating threshold
        if (newCheatProbability > 0.6) {
          setIsCheating(true);
        }
      }, 2000);
    }
    return () => clearInterval(intervalId);
  }, [isRecording, cheatProbability]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setCheatProbability(0);
      setIsCheating(false);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();

      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      videoRef.current.srcObject = null;
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Interview Cheating Detection System
        </h1>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {/* Cheat Probability Overlay */}
          <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded">
            Cheat Probability: {(cheatProbability * 100).toFixed(2)}%
          </div>

          {/* Cheating Alert */}
          {isCheating && (
            <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
              <div className="text-white text-2xl font-bold flex items-center">
                <AlertTriangle className="mr-2" size={48} />
                CHEATING DETECTED
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <Camera className="mr-2" />
              Start Interview Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Stop Recording
            </button>
          )}
        </div>

        {/* Detection Status */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center">
            {isCheating ? (
              <AlertTriangle className="text-red-500 mr-2" />
            ) : (
              <Check className="text-green-500 mr-2" />
            )}
            <span className={isCheating ? "text-red-500" : "text-green-500"}>
              {isCheating ? "Cheating Detected" : "No Suspicious Activity"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default videoProtected;
