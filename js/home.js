const titlenames = [
    "hola! i'm zay!",
    "hi! i'm zay!",
    "hey! i'm zay!",
    "greetings! i'm zay!",
    "good to see you! i'm zay!",
    "what's up? i'm zay!",
    "nice to meet you! i'm zay!",
    "welcome! i'm zay!",
    "bonjour! i'm zay!"
];


const homepagetitle = document.getElementById("hometitle");

function changeHomeTitle() {
    const randomIndex = Math.floor(Math.random() * Object.keys(titlenames).length);
    homepagetitle.textContent = titlenames[Object.keys(titlenames)[randomIndex]];
}

changeHomeTitle();
