

const intro_audio = new Audio('./assets/audio/intro.mp3');
intro_audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
intro_audio.play();

const sentences = [
    'Excitement replaced fear until the final moment.',
    'The changing of down comforters to cotton bedspreads always meant the squirrels had returned.',
    'The blinking lights of the antenna tower came into focus just as I heard a loud snap.',
    'Courage and stupidity were all he had.',
    'The fence was confused about whether it was supposed to keep things in or keep things out.',
    'Strawberries must be the one food that doesnt go well with this brand of paint.',
    'He embraced his new life as an eggplant.',
    'Barking dogs and screaming toddlers have the unique ability to turn friendly neighbors into cranky enemies.',
    'Henry couldnt decide if he was an auto mechanic or a priest.',
    'She felt that chill that makes the hairs on the back of your neck when he walked into the room.',
    'Potato wedges probably are not best for relationships.',
]

// shuffle sentences
sentences.sort(function (a, b) {
    return Math.random() - 0.5;
})

const typingArea = document.querySelector('#typing-area')
const timerCount = document.querySelector('#timer-count')
const wpmCount = document.querySelector('#wpm-count')
let startedTyping = false
let timer;
let level = 1
let errors = 0
let wordsTyped = 0
let timeElapsed = 0;
let startTime;

function calculateWPM(wordsTyped, timeTaken) {
    const time = (wordsTyped / 5) / (timeTaken / 60)
    if (timeTaken === 0 || timeTaken < 0.001) return 0
    else return time
}

typingArea.addEventListener('input', (event) => {
    // start timer when type for the first time
    if (!startedTyping) {
        startedTyping = true;
        timer = setInterval(function () {
            timerCount.innerText++
        }, 1000);
        startTime = new Date().getTime();
    }

    const typedChars = event.target.value

    let currentTime = new Date().getTime();
    timeElapsed = (currentTime - startTime) / 1000;
    wordsTyped = typedChars.split(' ').length

    // count errors
    errors = 0

    let html = ''

    // iterate on original sentence characters and compare it with typed characters
    for (let i = 0; i < sentences[level].length; i++) {
        let char = sentences[level][i]

        // default values
        let charColor = 'grey'
        let textDecoration = 'none'

        // check if character at index i exist
        if (typedChars[i] !== undefined) {
            // check if characters at index i matches sentence character at that index
            if (typedChars[i] === char) {
                charColor = 'green'
            }
            else {
                charColor = 'red'

                // check if character is space
                if (char === ' ') {
                    textDecoration = 'underline'
                    char = '_'
                }

                errors++
            }
        }

        html += `<span style="color: ${charColor}; text-decoration: ${textDecoration}">${char}</span>`
    }

    document.querySelector('#words-area').innerHTML = html

    // update errors
    document.querySelector('#errors-count').innerText = errors

    // check if finished word
    if (typedChars.length === sentences[level].length && !errors) {
        // show next button
        showNextButton(true)
        // stop timer
        clearInterval(timer);
        // disable typing area
        typingArea.setAttribute('disabled', 'disabled')
    }


    wpmCount.innerHTML = Math.round(calculateWPM(wordsTyped, timeElapsed));
})


// start playing button
const startPlayingBtn = document.querySelector('button#start-playing')
startPlayingBtn.addEventListener('click', () => {
    // remove intro div
    document.querySelector('div#intro').remove()
    // show game div
    document.querySelector('div#game').style.display = 'block'
    // load first sentence
    document.querySelector('#words-area').innerHTML = sentences[level]
})


// next level button
const nextButton = document.querySelector('#game button#next-level')
nextButton.addEventListener('click', () => {
    startedTyping = false
    level++
    // load next sentence
    if (sentences[level] === undefined) {
        level = 0
        // shuffle sentences
        sentences.sort(function (a, b) {
            return Math.random() - 0.5;
        })
    }
    document.querySelector('#words-area').innerHTML = sentences[level]
    // clear typing area
    typingArea.value = ''
    // hide next button
    showNextButton(false)
    // enable typing area
    typingArea.removeAttribute('disabled')
    // reset timer
    timer = 0
    timerCount.innerText = timer
    // reset WPM
    wpmCount.innerText = 0
})
function showNextButton(_option) {
    if (_option) nextButton.style.display = 'inline'
    else nextButton.style.display = 'none'
}