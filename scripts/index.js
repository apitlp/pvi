if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./serviceWorker.js")
            .then((reg) => {
                console.log("Service worker: Registered")
            })
            .catch(err => {
                console.log(`Service worker: Error: ${err}`);
            })
    })
}