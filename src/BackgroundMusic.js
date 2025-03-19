import { useEffect, useRef } from "react";

function BackgroundMusic() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(process.env.PUBLIC_URL + "/audio/ambient-background.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audio.muted = false;
    audioRef.current = audio;

    const handleUserInteraction = () => {
      audio
        .play()
        .then(() => {
          console.log("Background music started.");
        })
        .catch((error) => {
          console.log("Audio playback was prevented:", error);
        });

      // Remove the event listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    // Wait for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      // Clean up event listeners and audio
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}

export default BackgroundMusic;
