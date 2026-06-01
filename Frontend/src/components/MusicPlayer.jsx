import { useEffect, useRef, useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaShuffle,
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
    isShuffle,
    toggleShuffle,
    hasNext,
    hasPrevious,
  } = useMusic();

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("audionyx_volume");
    return saved ? Number(saved) : 1;
  });
  const [muted, setMuted] = useState(false);

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-3 py-2 shadow-[0_-18px_55px_-40px_rgba(15,23,42,0.95)] grid grid-cols-1 gap-2 md:grid-cols-[1.3fr_auto_0.9fr] items-center">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-2xl overflow-hidden bg-zinc-900 shadow-lg">
          <img
            src={currentSong.coverImage || "/default-cover.svg"}
            alt={currentSong.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-white text-sm font-semibold truncate">
            {currentSong.title}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm truncate">
            {currentSong.artistName || "Unknown artist"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 px-1 py-1">
        <div className="flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-800 px-2 py-2 shadow-[0_10px_40px_-30px_rgba(0,0,0,0.65)]">
          <button
            onClick={playPrevious}
            disabled={!hasPrevious}
            className="rounded-full p-2 text-gray-300 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition"
            title="Previous"
          >
            <FaBackwardStep className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-black shadow-lg shadow-emerald-400/20 transition hover:scale-105"
            title="Play / Pause"
          >
            {isPlaying ? <FaPause className="h-4 w-4" /> : <FaPlay className="h-4 w-4" />}
          </button>

          <button
            onClick={playNext}
            disabled={!hasNext}
            className="rounded-full p-2 text-gray-300 hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition"
            title="Next"
          >
            <FaForwardStep className="h-4 w-4" />
          </button>

          <button
            onClick={toggleShuffle}
            className={`rounded-full p-2 transition ${
              isShuffle
                ? "bg-emerald-500/15 text-emerald-300"
                : "text-gray-300 hover:text-white"
            }`}
            title="Shuffle"
          >
            <FaShuffle className="h-4 w-4" />
          </button>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span className="h-1.5 flex-1 rounded-full bg-zinc-800">
              <span
                className="block h-1.5 rounded-full bg-emerald-400"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span>{formatTime(duration)}</span>
          </div>

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

      <div className="flex flex-col items-center justify-center gap-2 md:items-end md:justify-end">
        <div className="flex items-center gap-2 rounded-full bg-zinc-900/95 border border-emerald-500/20 px-2 py-2 shadow-[0_14px_45px_-30px_rgba(16,185,129,0.25)]">
          <button
            title="Mute / Unmute"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full bg-emerald-500/10 p-2 text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition"
          >
            {muted || volume === 0 ? (
              <FaVolumeMute className="h-4 w-4" />
            ) : volume > 0.5 ? (
              <FaVolumeUp className="h-4 w-4" />
            ) : (
              <FaVolumeDown className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => setVolume((v) => Math.max(0, +(v - 0.1).toFixed(2)))}
            className="rounded-full bg-zinc-950/80 border border-emerald-500/20 p-2 text-emerald-300 hover:text-white hover:bg-emerald-500/10 transition"
            title="Volume down"
          >
            <FaVolumeDown className="h-4 w-4" />
          </button>

          <div className="flex w-24 md:w-28 lg:w-32 items-center rounded-full bg-zinc-950/75 px-2 py-1 border border-zinc-800">
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
              className="player-range w-full"
            />
          </div>

          <button
            onClick={() => setVolume((v) => Math.min(1, +(v + 0.1).toFixed(2)))}
            className="rounded-full bg-zinc-950/80 border border-emerald-500/20 p-2 text-emerald-300 hover:text-white hover:bg-emerald-500/10 transition"
            title="Volume up"
          >
            <FaVolumeUp className="h-4 w-4" />
          </button>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-zinc-900/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-emerald-300 shadow-[0_4px_24px_-18px_rgba(16,185,129,0.4)]">
          <span className="rounded-lg bg-zinc-950/95 px-2 py-1 text-[10px] tracking-[0.3em] text-white shadow-sm shadow-black/20">
            SPACE
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            play / pause
          </span>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
