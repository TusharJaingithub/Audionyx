import { useEffect, useRef, useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaRepeat,
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
    hasNext,
    hasPrevious,
    hasAutoNext,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
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
      setCurrentTime(0);
      setDuration(0);
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

  const handleEnded = () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log(err));
      return;
    }

    if (hasAutoNext) {
      playNext({ auto: true });
      return;
    }

    setIsPlaying(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const tagName = activeElement?.tagName;
      const isTyping =
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        activeElement?.isContentEditable;

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
  }, [currentSong]);

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
  const volumeProgress = muted ? 0 : volume * 100;

  if (!currentSong) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800/90 bg-[#181818]/95 px-2 shadow-[0_-12px_30px_rgba(0,0,0,0.32)] backdrop-blur sm:px-3 ${isCompact ? "py-1" : "py-1.5 md:py-2"}`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 md:grid-cols-[minmax(0,1fr)_minmax(320px,1.35fr)_minmax(160px,1fr)] md:gap-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-900 shadow-md md:h-12 md:w-12">
            <img
              src={currentSong.coverImage || "/default-cover.svg"}
              alt={currentSong.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-xs font-semibold leading-tight text-white md:text-sm">
              {currentSong.title}
            </p>
            <p className="truncate text-[11px] leading-tight text-zinc-400 md:text-xs">
              {currentSong.artistName || "Unknown artist"}
            </p>
          </div>
        </div>

        <div className="contents md:flex md:min-w-0 md:flex-col md:items-center md:gap-1">
          <div className="flex h-8 items-center justify-end gap-1.5 md:h-9 md:justify-center md:gap-3">
            <button
              onClick={toggleShuffle}
              className={`rounded-full p-1.5 transition md:p-2 ${isShuffle ? "text-[#1db954]" : "text-zinc-400 hover:text-white"}`}
              title={isShuffle ? "Shuffle on" : "Shuffle off"}
            >
              <FaShuffle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>

            <button
              onClick={playPrevious}
              disabled={!hasPrevious}
              className="hidden rounded-full p-2 text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700 sm:block"
              title="Previous"
            >
              <FaBackwardStep className="h-4 w-4" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 md:h-9 md:w-9"
              title="Play / Pause"
            >
              {isPlaying ? (
                <FaPause className="h-3.5 w-3.5" />
              ) : (
                <FaPlay className="h-3.5 w-3.5 translate-x-px" />
              )}
            </button>

            <button
              onClick={playNext}
              disabled={!hasNext}
              className="hidden rounded-full p-2 text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700 sm:block"
              title="Next"
            >
              <FaForwardStep className="h-4 w-4" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`relative rounded-full p-1.5 transition md:p-2 ${repeatMode !== "off" ? "text-[#1db954]" : "text-zinc-400 hover:text-white"}`}
              title={
                repeatMode === "one"
                  ? "Repeat one"
                  : repeatMode === "all"
                    ? "Repeat all"
                    : "Repeat off"
              }
            >
              <FaRepeat className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {repeatMode === "one" && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#1db954] text-[8px] font-black leading-none text-black">
                  1
                </span>
              )}
            </button>
          </div>

          <div className="col-span-2 grid w-full grid-cols-[34px_minmax(0,1fr)_34px] items-center gap-1.5 md:col-span-1 md:grid-cols-[38px_minmax(0,1fr)_38px] md:gap-2">
            <span className="text-right text-[10px] tabular-nums leading-none text-zinc-400 md:text-[11px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              style={{
                "--range-progress": `${progress}%`,
              }}
              className="player-range w-full"
            />
            <span className="text-[10px] tabular-nums leading-none text-zinc-400 md:text-[11px]">
              {formatTime(duration)}
            </span>
          </div>

          <audio
            ref={audioRef}
            onEnded={handleEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) =>
              setCurrentTime(e.currentTarget.currentTime)
            }
            onLoadedMetadata={(e) =>
              setDuration(e.currentTarget.duration)
            }
            className="hidden"
          >
            <source
              src={currentSong.uri}
              type="audio/mpeg"
            />
          </audio>
        </div>

        <div className="hidden items-center justify-end gap-2 self-center sm:flex">
          <button
            title="Mute / Unmute"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full p-2 text-zinc-400 transition hover:text-white"
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
            style={{
              "--range-progress": `${volumeProgress}%`,
            }}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              if (v === 0) setMuted(true);
              else setMuted(false);
            }}
            className="player-range w-28"
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
