"use client";
import React, { useRef, useEffect } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from "@/components/Utilities";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Initialize TensorFlow.js backend
    const initTF = async () => {
      await tf.ready();
      console.log("TensorFlow.js backend ready");
    };
    initTF();
  }, []);

  const runHandPose = async () => {
    const net = await handpose.load();
    setInterval(async () => {
      detectHandPose(net);
    }, 100);
    console.log("Handpose loaded");
  }
  const detectHandPose = async (net: any) => {
    if(webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoHeight = webcamRef.current.video.videoHeight;
      const videoWidth = webcamRef.current.video.videoWidth;
      
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      if (canvasRef.current) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }

      const predictions = await net.estimateHands(video);
      const ctx = canvasRef.current?.getContext("2d");
      if(ctx) {
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        drawHand(predictions, ctx);
      }
    }}
  runHandPose();
  return (
    <div>
      <Webcam 
      ref={webcamRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        width: 640,
        height: 480,
      }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
}
