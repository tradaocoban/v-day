const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const khôngMessages = [
    "Không",
    "Ui bấm lộn ròi kìa 😦",
    "Chắc chuaa 😾",
    "Hoi mà huhu" ,
    "Chọn lại đi nà 🙆",
    "Ok đi mò 🥹",
    "Lại lần nữa ii",
    "Cơ hội cuối cùng 😾",
    "Đố mẹ bắt được em 😜"
]

const okTeasePokes = [
    "Thử nhấn ok đi, con biết mẹ muốn vậy mà 😺",
    "Hoi mà thử đi 👀",
    "Bực chưa 😈",
    "Bấm đi mò có bất ngờ á 😏"
]

let okTeasedCount = 0

let khôngClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const okBtn = document.getElementById('yes-btn')
const khôngBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try Không first
        const msg = okTeasePokes[Math.min(okTeasedCount, okTeasePokes.length - 1)]
        okTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'ok.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handlekhôngClick() {
    khôngClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(khôngClickCount, khôngMessages.length - 1)
    khôngBtn.textContent = khôngMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(okBtn).fontSize)
    okBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + khôngClickCount * 5, 60)
    const padX = Math.min(45 + khôngClickCount * 10, 120)
    okBtn.style.padding = `${padY}px ${padX}px`

    // Shrink Không button to contrast
    if (khôngClickCount >= 2) {
        const khôngSize = parseFloat(window.getComputedStyle(khôngBtn).fontSize)
        khôngBtn.style.fontSize = `${Math.max(khôngSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(khôngClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (khôngClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    khôngBtn.addEventListener('mouseover', runAway)
    khôngBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = khôngBtn.offsetWidth
    const btnH = khôngBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    khôngBtn.style.position = 'fixed'
    khôngBtn.style.left = `${randomX}px`
    khôngBtn.style.top = `${randomY}px`
    khôngBtn.style.zIndex = '50'
}
