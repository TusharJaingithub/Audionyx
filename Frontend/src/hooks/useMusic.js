import { useContext } from "react";
import { MusicContext } from "../context/MusicContext";

export function useMusic() {
  return useContext(MusicContext);
}