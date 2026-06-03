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

  const playNext = useCallback(() => {
    if (queue.length <= 1) {
      return;
    }

    const nextIndex = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : currentIndex >= queue.length - 1
        ? 0
        : currentIndex + 1;

    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
  }, [currentIndex, isShuffle, queue]);

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
      hasNext: queue.length > 1,
      hasPrevious: queue.length > 1,
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
