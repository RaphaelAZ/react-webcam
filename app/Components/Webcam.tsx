"use client";

import { useEffect, useRef, useState } from "react";

export default function Webcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function initCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true })

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch(e) {
               console.log(e)
            }
        }

        initCamera()

        return () => {
            if( stream ) {
                stream.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    function takeSnapshot(): void {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            return;
        }

        const width = video.videoWidth;
        const height = video.videoHeight;

        if (!width || !height) {
            return;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            setPhoto(canvas.toDataURL("image/png"));
            setSaveMessage(null);
        }
    }

    async function savePhoto(): Promise<void> {
        if (!photo) {
            setSaveMessage("Prends d'abord une photo.");
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const response = await fetch("/api/photos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: photo }),
            });

            const payload: { message?: string; fileName?: string; error?: string } = await response.json();

            if (!response.ok) {
                throw new Error(payload.error ?? "Impossible de sauvegarder la photo.");
            }

            setSaveMessage(payload.fileName ? `Photo sauvegardée: ${payload.fileName}` : payload.message ?? "Photo sauvegardée.");
        } catch (error) {
            setSaveMessage(error instanceof Error ? error.message : "Impossible de sauvegarder la photo.");
        } finally {
            setIsSaving(false);
        }
    }


    return (
        <div>
            <video ref={videoRef} autoPlay playsInline />

            <button type="button" onClick={takeSnapshot}>
                Cheese
            </button>

            <button type="button" onClick={savePhoto} disabled={!photo || isSaving}>
                {isSaving ? "Sauvegarde..." : "Save photo"}
            </button>

            {photo && (
                <div>
                    <h2>La photo</h2>
                    <img src={photo} alt="Photo capturée depuis la webcam" />
                </div>
            )}

            {saveMessage && <p>{saveMessage}</p>}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    )
}