const nav = document.querySelector("nav");
const indicator = document.querySelector(".nav-indicator");
const links = document.querySelectorAll("nav a");

function moveIndicator(link) {
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    indicator.style.width = `${linkRect.width}px`;
    indicator.style.left = `${linkRect.left - navRect.left}px`;
}

function switchPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
    }
}

function loadFromHash() {
    let page = window.location.hash.slice(1);

    if (!page) {
        page = "home";
        window.location.hash = "#home";
    }

    const activeLink = document.querySelector(`nav a[href="#${page}"]`);

    if (!activeLink) {
        window.location.hash = "#home";
        return;
    }

    links.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");

    moveIndicator(activeLink);
    switchPage(page);
}

links.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        if (link.classList.contains("active")) return;

        window.location.hash = link.getAttribute("href");
    });
});

window.addEventListener("hashchange", loadFromHash);

window.addEventListener("load", loadFromHash);

window.addEventListener("resize", () => {
    const active = document.querySelector("nav a.active");
    if (active) {
        moveIndicator(active);
    }
});