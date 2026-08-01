function updateTitle() {
    const hash = window.location.hash.slice(1);

    if (!hash) {
        document.title = "zay's portfolio";
        return;
    }

    const page = hash.charAt(0).toLowerCase() + hash.slice(1);

    document.title = `zay's portfolio - ${page}`;
}

window.addEventListener("hashchange", updateTitle);
window.addEventListener("load", updateTitle);