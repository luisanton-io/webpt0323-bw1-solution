window.onload = function () {
    const proceedBtn = document.querySelector("#proceed")

    proceedBtn.disabled = true

    const checkbox = document.querySelector("#agree")

    checkbox.addEventListener("change", function (event) {
        proceedBtn.disabled = !event.target.checked
    })
}

function handleProceed() {
    window.location.href = "/test.html"
}