let audioPlayer;

function initAudio() {
    audioPlayer = document.getElementById('inTheEnd');
    const savedTime = localStorage.getItem('audioTime');
    
    if (savedTime) {
        audioPlayer.currentTime = parseFloat(savedTime);
    }
    
    audioPlayer.volume = 0.3;
    audioPlayer.loop = true;

    // Intenta reproducir después de cualquier clic en la página
    document.addEventListener('click', function iniciarReproduccion() {
        audioPlayer.play();
        document.removeEventListener('click', iniciarReproduccion);
    }, { once: true });

    // Intenta reproducir después de presionar cualquier tecla
    document.addEventListener('keydown', function iniciarReproduccion() {
        audioPlayer.play();
        document.removeEventListener('keydown', iniciarReproduccion);
    }, { once: true });

    audioPlayer.play().catch(error => {
        console.log("Reproducción automática impedida:", error);
    });

    // Guarda el tiempo de audio periódicamente
    setInterval(() => {
        if (!audioPlayer.paused) {
            localStorage.setItem('audioTime', audioPlayer.currentTime);
        }
    }, 1000);

    // Inicialización de la API de YouTube
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Maneja los videos de YouTube
    window.onYouTubeIframeAPIReady = function() {
        let iframes = document.getElementsByTagName('iframe');
        for(let i = 0; i < iframes.length; i++) {
            new YT.Player(iframes[i], {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }

    function onPlayerStateChange(event) {
        // Solo pausa la música cuando el video comienza a reproducirse (estado 1)
        if (event.data == YT.PlayerState.PLAYING) {
            localStorage.setItem('wasPlaying', !audioPlayer.paused);
            audioPlayer.pause();
        }
        // Reanuda la música cuando el video está en pausa (estado 2) o terminado (estado 0)
        if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
            if (localStorage.getItem('wasPlaying') === 'true') {
                audioPlayer.play();
            }
        }
    }

    audioPlayer.addEventListener('play', () => {
        localStorage.setItem('isPlaying', 'true');
    });

    audioPlayer.addEventListener('pause', () => {
        localStorage.setItem('isPlaying', 'false');
    });
}

window.addEventListener('load', initAudio);