import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const MusicContext =
  createContext();

export function MusicProvider({
  children,
}) {
  const [currentSong, setCurrentSong] =
    useState(() => {
      const savedSong = localStorage.getItem(
        "audionyx_current_song"
      );

      try {
        return savedSong
          ? JSON.parse(savedSong)
          : null;
      } catch {
        return null;
      }
    });
  const [queue, setQueue] = useState(() =>
    currentSong ? [currentSong] : []
  );
  const [currentIndex, setCurrentIndex] =
    useState(() => (currentSong ? 0 : -1));
  const [isShuffle, setIsShuffle] =
    useState(false);
  const [repeatMode, setRepeatMode] =
    useState("off");

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem(
        "audionyx_current_song",
        JSON.stringify(currentSong)
      );
    } else {
      localStorage.removeItem(
        "audionyx_current_song"
      );
    }
  }, [currentSong]);

  const playSong = useCallback((song, songs = []) => {
    const nextQueue =
      songs.length > 0 ? songs : [song];
    const songIndex = nextQueue.findIndex(
      (item) => item._id === song._id
    );

    setQueue(nextQueue);
    setCurrentIndex(
      songIndex === -1 ? 0 : songIndex
    );
    setCurrentSong(song);
  }, []);

  const playNext = useCallback((options = {}) => {
    if (queue.length <= 1) {
      return false;
    }

    const isAuto = options.auto === true;
    const isAtLast = currentIndex >= queue.length - 1;

    if (isAuto && !isShuffle && isAtLast && repeatMode !== "all") {
      return false;
    }

    const nextIndex = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : isAtLast
        ? 0
        : currentIndex + 1;

    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    return true;
  }, [currentIndex, isShuffle, queue, repeatMode]);

  const playPrevious = useCallback(() => {
    if (queue.length <= 1) {
      return;
    }

    const previousIndex =
      currentIndex <= 0
        ? queue.length - 1
        : currentIndex - 1;

    setCurrentIndex(previousIndex);
    setCurrentSong(queue[previousIndex]);
  }, [currentIndex, queue]);

  const clearPlayer = useCallback(() => {
    setCurrentSong(null);
    setQueue([]);
    setCurrentIndex(-1);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((value) => !value);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((mode) => {
      if (mode === "off") {
        return "all";
      }

      if (mode === "all") {
        return "one";
      }

      return "off";
    });
  }, []);

  const hasAutoNext =
    queue.length > 1 &&
    (isShuffle ||
      repeatMode === "all" ||
      currentIndex < queue.length - 1);

  const value = useMemo(
    () => ({
      currentSong,
      setCurrentSong,
      queue,
      currentIndex,
      playSong,
      playNext,
      playPrevious,
      clearPlayer,
      isShuffle,
      toggleShuffle,
      repeatMode,
      toggleRepeat,
      hasNext: queue.length > 1,
      hasPrevious: queue.length > 1,
      hasAutoNext,
    }),
    [
      currentSong,
      queue,
      currentIndex,
      playSong,
      playNext,
      playPrevious,
      clearPlayer,
      isShuffle,
      toggleShuffle,
      repeatMode,
      toggleRepeat,
      hasAutoNext,
    ]
  );

  return (
    <MusicContext.Provider
      value={value}
    >
      {children}
    </MusicContext.Provider>
  );
}
