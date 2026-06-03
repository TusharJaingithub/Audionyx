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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/70 bg-zinc-950/95 backdrop-blur-xl px-4 py-3 shadow-[0_-20px_60px_-35px_rgba(0,0,0,0.75)]">
      <div className="mx-auto flex max-w-xs flex-col gap-3 md:grid md:grid-cols-[1.2fr_1fr_0.95fr] md:items-center md:max-w-2xl lg:max-w-4xl">
        {/* Left: Album art and song info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
            <img
              src={currentSong.coverImage || "/default-cover.svg"}
              alt={currentSong.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/90">
              Now playing
            </p>
            <h3 className="text-white text-sm md:text-base font-semibold truncate">
              {currentSong.title}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm truncate">
              {currentSong.artistName || "Unknown artist"}
            </p>
          </div>
        </div>

        {/* Center: Play controls and progress */}
        <div className="flex flex-col items-center gap-2">
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

          <div className="flex w-full max-w-sm flex-col gap-1.5">
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

            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-zinc-500">
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

        {/* Right: Volume and spacebar hint */}
        <div className="flex flex-col items-end justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-zinc-900/95 border border-zinc-800 px-3 py-2 shadow-[0_10px_35px_-30px_rgba(0,0,0,0.55)]">
            <button
              title="Mute / Unmute"
              onClick={() => setMuted((m) => !m)}
              className="rounded-full bg-zinc-950/90 p-2 text-emerald-300 hover:text-white hover:bg-emerald-500/10 transition"
            >
              {muted || volume === 0 ? (
                <FaVolumeMute className="h-4 w-4" />
              ) : volume > 0.5 ? (
                <FaVolumeUp className="h-4 w-4" />
              ) : (
                <FaVolumeDown className="h-4 w-4" />
              )}
            </button>

            <div className="flex w-24 md:w-28 lg:w-32 items-center rounded-full bg-zinc-950/80 px-2 py-1 border border-zinc-800">
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
          </div>

          <div className="hidden md:inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-400 shadow-[0_4px_24px_-18px_rgba(16,185,129,0.35)]">
            <span className="flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-1 text-[11px] tracking-[0.32em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              SPACE
            </span>
            <span className="text-[10px] tracking-[0.18em] text-zinc-400">
              play / pause
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
