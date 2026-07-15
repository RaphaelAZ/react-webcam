"use client";

import { useEffect, useRef, useState } from "react";

export default function Webcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [photo, setPhoto] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function initCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error: unknown) {
                console.error("Error accessing webcam:", error);
            }
        }

        initCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    function takePhoto() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");

        if (context) {
            context.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    setPhoto(blob);
                    setPreviewUrl(URL.createObjectURL(blob));
                }
            },"image/png");

        }
    }

    async function savePhoto(){
        if(!photo){
            return;
        }

        const formData = new FormData();
        formData.append("photo", photo, "photo.png");

        await fetch("/api/save-photo", {
            method: "POST",
            body: formData,
        });
    }

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />
            <button onClick={takePhoto}>Take Photo</button>
            <button onClick={savePhoto}>Save Photo</button>
            {photo && (
                <div>
                    <h2>Captured Photo:</h2>
                    <img src={previewUrl || ""} alt="Captured" />
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
            />

        </div>
    );
}