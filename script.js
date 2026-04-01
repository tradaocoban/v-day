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

const KhôngMessages = [
    "Không",
    "Ui bấm lộn ròi kìa",
    "Chắc chuaa 😾",
    "Hoi mò huhu",
    "Chọn lại đi nà 🙆",
    "Ok đi mò 🥹",
    "Lại lần nữa nhâ",
    "Cơ hội cuối cùng 😾🫵 ",
    "Đố mẹ bắt được em 😜"
]

const OkTeasePokes = [
    "Thử nói không ii có bất ngờ á 😉",
    "Thử đi mò 👀",
    "Thoi mò tiền khó kiếm lém",
    "Bấm không đi, thách ó 😏"
]

let OkTeasedCount = 0

let KhôngClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const OkBtn = document.getElementById('Ok-btn')
const KhôngBtn = document.getElementById('Không-btn')
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

function handleOkClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = OkTeasePokes[Math.min(OkTeasedCount, OkTeasePokes.length - 1)]
        OkTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'Ok.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleKhôngClick() {
    KhôngClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(KhôngClickCount, KhôngMessages.length - 1)
    KhôngBtn.textContent = KhôngMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(OkBtn).fontSize)
    OkBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    OkBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (KhôngClickCount >= 2) {
        const KhôngSize = parseFloat(window.getComputedStyle(KhôngBtn).fontSize)
        KhôngBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(KhôngClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (KhôngClickCount >= 5 && !runawayEnabled) {
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
    KhôngBtn.addEventListener('mouseover', runAway)
    KhôngBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = KhôngBtn.offsetWidth
    const btnH = KhôngBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    KhôngBtn.style.position = 'fixed'
    KhôngBtn.style.left = `${randomX}px`
    KhôngBtn.style.top = `${randomY}px`
    KhôngBtn.style.zIndex = '50'
}
