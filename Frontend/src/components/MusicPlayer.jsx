import { useEffect, useRef, useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaShuffle,
} from "react-icons/fa6";
import { useMusic } from "../hooks/useMusic";

function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] =
    useState(false);
  const [currentTime, setCurrentTime] =
    useState(0);
  const [duration, setDuration] = useState(0);
  const {
    currentSong,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    hasNext,
    hasPrevious,
  } = useMusic();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) =>
          console.log(err)
        );
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log(err));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName =
        document.activeElement?.tagName;
      const isTyping =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        document.activeElement?.isContentEditable;

      if (
        (e.code === "Space" || e.key === " ") &&
        !isTyping &&
        currentSong
      ) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [currentSong, isPlaying]);

  const formatTime = (time) => {
    if (!time) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e) => {
    const nextTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }

    setCurrentTime(nextTime);
  };

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 px-3 py-2 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={currentSong.coverImage || "/default-cover.svg"}
          alt={currentSong.title}
          className="h-11 w-11 md:h-12 md:w-12 rounded object-cover bg-zinc-800"
        />

        <div className="min-w-0">
          <h3 className="text-white text-sm md:text-base font-semibold truncate">
          {currentSong.title}
        </h3>

        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={playPrevious}
            disabled={!hasPrevious}
            className="cursor-pointer text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            <FaBackwardStep />
          </button>

          <button
            onClick={togglePlay}
            className="cursor-pointer h-9 w-9 md:h-10 md:w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button
            onClick={playNext}
            disabled={!hasNext}
            className="cursor-pointer text-gray-300 hover:text-white disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            <FaForwardStep />
          </button>

          <button
            onClick={toggleShuffle}
            className={`cursor-pointer ${
              isShuffle
                ? "text-green-500"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <FaShuffle />
          </button>
        </div>

        <div className="flex items-center gap-2 w-[270px] sm:w-[420px] md:w-[520px]">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{
              background: `linear-gradient(to right, #22c55e ${progress}%, #3f3f46 ${progress}%)`,
            }}
            className="player-range w-full"
          />

          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        <audio
          ref={audioRef}
          onEnded={playNext}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) =>
            setCurrentTime(e.currentTarget.currentTime)
          }
          onLoadedMetadata={(e) =>
            setDuration(e.currentTarget.duration)
          }
        >
          <source
            src={currentSong.uri}
            type="audio/mpeg"
          />
        </audio>
      </div>

      <div className="hidden md:block"></div>
    </div>
  );
}

export default MusicPlayer;
