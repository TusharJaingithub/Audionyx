import { useEffect, useRef, useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
} from "react-icons/fa6";
import {
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
} from "react-icons/fa";
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
    hasNext,
    hasPrevious,
  } = useMusic();

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("audionyx_volume");
    return saved ? Number(saved) : 1;
  });
  const [muted, setMuted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
    localStorage.setItem("audionyx_volume", String(volume));
  }, [volume, muted]);

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
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950 px-3 ${isCompact ? "py-1 md:py-2" : "py-2 md:py-3"}`}>
      <div className="mx-auto flex max-w-full flex-col gap-1.5 items-center md:flex-row md:items-center md:justify-between md:max-w-6xl">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="h-12 w-12 overflow-hidden rounded-xl bg-zinc-900">
            <img
              src={currentSong.coverImage || "/default-cover.svg"}
              alt={currentSong.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {currentSong.title}
            </p>
            <p className="text-xs text-zinc-400 leading-tight truncate">
              {currentSong.artistName || "Unknown artist"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:flex-1">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={playPrevious}
              disabled={!hasPrevious}
              className="rounded-full p-2 text-zinc-300 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed"
              title="Previous"
            >
              <FaBackwardStep className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-black"
              title="Play / Pause"
            >
              {isPlaying ? <FaPause className="h-4 w-4" /> : <FaPlay className="h-4 w-4" />}
            </button>

            <button
              onClick={playNext}
              disabled={!hasNext}
              className="rounded-full p-2 text-zinc-300 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed"
              title="Next"
            >
              <FaForwardStep className="h-4 w-4" />
            </button>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-1">
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

            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
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
            volume={volume}
            muted={muted}
            className="hidden"
          >
            <source
              src={currentSong.uri}
              type="audio/mpeg"
            />
          </audio>
        </div>

        <div className="hidden sm:flex items-center gap-2 justify-end self-center">
          <button
            title="Mute / Unmute"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full p-2 text-zinc-300 hover:text-white"
          >
            {muted || volume === 0 ? (
              <FaVolumeMute className="h-4 w-4" />
            ) : volume > 0.5 ? (
              <FaVolumeUp className="h-4 w-4" />
            ) : (
              <FaVolumeDown className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (v === 0) setMuted(true);
              else setMuted(false);
            }}
            className="player-range w-24"
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
