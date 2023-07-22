// COSTANTI

// Il contenuto di questi elementi saranno modificati dinamicamente, 
// ma i rispettivi riferimenti nel DOM, non cambiando mai, possono essere salvati 
// in queste costanti globali

const mainContainer = document.querySelector('main')
const questionContainer = document.querySelector('#question-container')
const answerContainer = document.querySelector('#answer-container')
const progressContainer = document.querySelector('#progress-container')
const proceedButton = document.querySelector('#next')
const timerProgress = document.querySelector("#timer-progress")
const countdown = document.querySelector("#timer span")

// VARIABILI

let currentQuestion = 0
let userScore = 0
let userQuestions = null
let currentInterval = null

// FUNZIONI

// Andiamo a recuperare una funzione per rimescolare un array.
// Ci servirà sia per mostrare sia le domande sia le risposte sempre in ordine diverso
// Vedi questa risposta su StackOverflow: https://stackoverflow.com/a/12646864/11783958
function shuffleArray(array) {
    // Questo crea una copia dell'array originale, così da non modificarlo direttamente
    const shuffledArray = array.slice()

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // restituiamo ora la copia modificata
    return shuffledArray
}

function handleNext() {
    // Gestiamo il timer
    handleTimer()

    // Verifichiamo se la risposta è corretta
    checkAnswer()

    // Se possibile mostriamo la prossima domanda
    if (currentQuestion < questions.length - 1) {
        currentQuestion++
        showQuestion()
    } else { // Altrimenti terminiamo il test
        endTest()
    }
}

function checkAnswer() {
    // Andiamo a recuperare il riferimento alla risposta selezionata
    const selectedAnswer = document.querySelector('input[name="answer"]:checked')

    // Se 
    // 1. c'è una risposta selezionata (ovvero selectedAnswer è truthy)
    // AND
    // 2. la risposta selezionata corrisponde alla risposta corretta
    if (selectedAnswer && selectedAnswer.value === userQuestions[currentQuestion].correct_answer) {
        //...allora incrementiamo il punteggio
        userScore++
    } // altrimenti nulla
}

function showQuestion() {
    // Recuperiamo la domanda corrente dall'array userQuestions (che contiene le domande rimescolate)
    const questionData = userQuestions[currentQuestion]

    // Mostriamo la domanda
    questionContainer.innerHTML = questionData.question

    // Creiamo un array di risposte rimescolate
    const allAnswers = questionData.incorrect_answers.concat(questionData.correct_answer)
    const answers = shuffleArray(allAnswers)

    // Svuotiamo il container delle risposte, che contiene le risposte precedenti
    answerContainer.innerHTML = ''

    // Per ognuna delle risposte:
    for (const answer of answers) {
        // Andiamo a inserire un input di tipo radio che gestisce la selezione della risposta
        const answerInput = document.createElement('input')
        answerInput.type = 'radio'
        answerInput.name = 'answer'
        answerInput.value = answer
        answerInput.id = answer

        // Creiamo un label che contiene il testo della risposta
        const answerLabel = document.createElement('label')
        answerLabel.innerText = answer
        answerLabel.htmlFor = answer

        // Aggiungiamo i due elementi al container
        answerContainer.appendChild(answerInput)
        answerContainer.appendChild(answerLabel)
    }

    // Aggiorniamo il counter delle domande
    progressContainer.innerHTML = `Question ${currentQuestion + 1}<span>/${questions.length}</span>`
}

function startTest() {
    // Rimescoliamo le domande restituendo un nuovo array da salvare in una variabile globale
    userQuestions = shuffleArray(questions)
    currentQuestion = 0
    handleTimer()
    showQuestion()
}

const TIME_LIMIT = 30
const MAX_STROKE = 565.48

function handleTimer() {

    // Se c'è un timer già in esecuzione, lo fermiamo
    clearInterval(currentInterval)

    // In JavaScript, possiamo concatenare gli assegnamenti così:
    let timeLeft = countdown.innerHTML = TIME_LIMIT // sintassi valida, assegna TIME_LIMIT a countdown.innerHTML e a una nuova variabile chiamata timeLeft che ci servirà

    // Ripristiniamo il cerchio del timer
    timerProgress.style.strokeDashoffset = 0

    // Creiamo un nuovo interval e lo assegniamo a currentTimer
    currentInterval = setInterval(function () {

        // Se il tempo è scaduto, passiamo alla prossima domanda
        if (timeLeft === 0) {
            handleNext()
            return // usciamo dalla funzione
        }

        // Ogni secondo, decrementiamo il tempo rimasto
        countdown.innerHTML = String(--timeLeft).padStart(2, '0')
        // Commento su questo one-liner:
        // --timeLeft è equivalente a timeLeft--, ma viene eseguito prima di assegnare il valore
        // .padStart è un metodo per aggiungere caratteri all'inizio della stringa, in questo caso uno zero,
        // fino a che la stringa non è lunga un certo numero di caratteri, in questo caso 2.

        // Calcoliamo la percentuale di tempo rimasto
        const timePercent = (timeLeft / TIME_LIMIT) * 100

        // console.table({ timeLeft, timePercent, offset: MAX_STROKE - (timePercent * MAX_STROKE / 100) })

        // Aggiorniamo il valore del dashoffset del cerchio:
        // quando il valore è MAX_STROKE il cerchio è vuoto, quando è 0 è pieno
        timerProgress.style.strokeDashoffset = MAX_STROKE - (timePercent * MAX_STROKE / 100)

    }, 1000)
}

function endTest() {
    // Fine del test
    mainContainer.innerHTML = `<h2>Test is over.</h2><p>You scored ${userScore} out of ${questions.length}.</p>`
    document.querySelector("#timer").remove()
    clearInterval(currentInterval)
}

// EVENTI

// Assegniamo la funzione startTest all'evento onload della pagina

// Virtualmente potremmo scrivere:

// window.onload = function () {
//     startTest()
// }

// oppure, siccome altro non facciamo che eseguire startTest(), anzichè creare una nuova funzione 
// possiamo assegnare direttamente il riferimento alla funzione startTest all'evento onload della pagina

window.onload = startTest
