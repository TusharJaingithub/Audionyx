console.log("Lets write Java script");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let parser = new DOMParser();
  let doc = parser.parseFromString(response, "text/html");

  let links = doc.querySelectorAll("a");
  songs = [];
  links.forEach((link) => {
    let href = link.getAttribute("href");
    if (href.endsWith(".mp3")) {
      songs.push(href.split(`/${folder}/`)[1]);
    }
  });
    let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = ""; // reset list before appending
  for (const song of songs) {
    let cleanName = decodeURIComponent(song).replace(".mp3", "");
    let parts = cleanName.split("-");
    let songName = parts[0].trim();
    let singerName =
      parts.length > 1 ? parts.slice(1).join("-").trim() : "Unknown Artist";

    songUL.innerHTML += `
      <li>
        <img class=" invert musicSvg" src="img/music.svg" alt="">
        <div class="info">
          <div>${songName}</div>
          <div>${singerName}</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  }

  // ✅ Add click listeners to play songs
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(
    (li, index) => {
      li.addEventListener("click", () => {
        playMusic(songs[index]);
      });
    }
  );
   return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  // ✅ Clean song name + artist
  let cleanName = decodeURIComponent(track).replace(".mp3", "");
  let parts = cleanName.split("-");
  let songName = parts[0].trim();
  let singerName =
    parts.length > 1 ? parts.slice(1).join("-").trim() : "Unknown Artist";

  document.querySelector(
    ".songInfo"
  ).innerHTML = `<b>${songName}</b><br><small>${singerName}</small>`;
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

 
 // ✅ Highlight active song as per your theme
let lis = document.querySelectorAll(".songList li");
lis.forEach((li, i) => {
  // Reset
  li.style.background = "";
  li.style.color = "";
  li.querySelector(".info div:first-child").style.fontWeight = "normal";
  li.querySelector(".info div:first-child").style.color = "#fff";
  li.querySelector(".info div:last-child").style.color = "#888";

  // If current song matches
  if (decodeURIComponent(songs[i]) === decodeURIComponent(track)) {
    li.style.background = "#6c6c6cff"; // dark background
    li.querySelector(".info div:first-child").style.color = "#00e0ff"; // neon blue song
    li.querySelector(".info div:first-child").style.fontWeight = "bold";
    li.querySelector(".info div:last-child").style.color = "#00e0ff"; // artist blue song
  }
});

};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let parser = new DOMParser();
  let doc = parser.parseFromString(response, "text/html");
  let links = doc.querySelectorAll("a");

  let cardContainer = document.querySelector(".cardContainer");
    for(let i=0;i<links.length;i++){
      const link=links[i];
    
    let href = link.getAttribute("href");
    if (href.startsWith("/songs/") && !href.includes(".htaccess")) {
      let folder = href.split("/").slice(-1)[0];
    
    //Get the meta data from the folder
     let a = await fetch(`/songs/${folder}/info.json`);
  let response = await a.json();

       cardContainer.innerHTML+=`<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 20V4L19 12L5 20Z"
                    stroke="#141B34"
                    fill="#000"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <img
                class="card-img-top"
                src="/songs/${folder}/${response.image}"
                alt="Title"
              />
              <div class="card-body">
                <h4 class="card-title">${response.title}</h4>
                <p class="card-text">
                 ${response.description}
                </p>
              </div>
            </div>`
    }
  }
  
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach( e=>{
    e.addEventListener("click",async item=>{ 
      song= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0]); // start paused with first song info
    })
  })
 
}
async function main() {
 

// Display all the albums / playlists
   await displayAlbums()

   // Automatically pick the first card's folder (if available)
  const firstCard = document.querySelector(".card");
  if (firstCard) {
    let firstFolder = firstCard.dataset.folder;
    songs = await getSongs(`songs/${firstFolder}`);
    playMusic(songs[0], true); // start paused with first song info
  }

  // ✅ Play / Pause toggle
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // ✅ Time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".seekbar .circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // ✅ Seekbar click
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // ✅ Hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  // ✅ Previous
  previous.addEventListener("click", () => {
    let currentFile = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentFile);
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  // ✅ Next
  next.addEventListener("click", () => {
    let currentFile = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentFile);
    if (index !== -1 && index < songs.length - 1) {
            playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  // ✅ Auto play next when song ends
currentSong.addEventListener("ended", () => {
  let currentFile = currentSong.src.split("/").slice(-1)[0];
  let index = songs.indexOf(currentFile);

  if (index !== -1 && index < songs.length - 1) {
    playMusic(songs[index + 1]); // play next song
  } else {
    playMusic(songs[0]); // loop back to first
  }
});



  // ✅ Volume
  vol.addEventListener("input", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  
    // Add event listener to mute the track
    
    // Select elements
const volumeIcon = document.querySelector(".volume img");
const volumeRange = document.querySelector(".volume .range input");

// 🎵 Your <audio> element
let audio = currentSong;

// Default volume
audio.volume = 0.5;
volumeRange.value = audio.volume * 100;

// Click on icon (toggle mute/unmute)
volumeIcon.addEventListener("click", () => {
    if (audio.volume > 0) {
        // mute
        audio.volume = 0;
        volumeRange.value = 0;
        volumeIcon.src = "img/mute.svg";
    } else {
        // unmute (set a default value like 50%)
        audio.volume = 0.5;
        volumeRange.value = 50;
        volumeIcon.src = "img/volume.svg";
    }
});

// Range input (adjust volume + update icon)
let warnedHighVolume = false; // flag to track if warning shown
volumeRange.addEventListener("input", () => {
    let value = volumeRange.value;
    audio.volume = value / 100;

    if (value == 0) {
        volumeIcon.src = "img/mute.svg";
    } else {
        volumeIcon.src = "img/volume.svg";
    }
    if (value > 80 && !warnedHighVolume) {
  alert("⚠️ High volume can damage your ears if using earphones!");
  warnedHighVolume = true;
} else if (value <= 80) {
  warnedHighVolume = false; // reset when volume is safe
}

});



}

main();
