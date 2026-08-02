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

    switchPage(page);

    const activeLink = document.querySelector(`nav a[href="#${page}"]`);

    links.forEach(link => link.classList.remove("active"));

    if (activeLink) {
        activeLink.classList.add("active");
        moveIndicator(activeLink);

        nav.style.opacity = "1";
        nav.style.pointerEvents = "auto";
        nav.style.transform = "translateX(-50%) translateY(0)";
    } else {
        nav.style.opacity = ".2";
        nav.style.pointerEvents = "none";
        nav.style.transform = "translateX(-50%) translateY(-80px)";
    }
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

function openBlogPost(id) {
    window.location.hash = id;
}

// skill bars

function playSkillBars() {
    const bars = document.querySelectorAll(".skill-bar-fill");
 
    bars.forEach((bar) => {
        bar.style.transition = "none";
        bar.style.width = "0%";
    });
 
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            bars.forEach((bar) => {
                bar.style.transition = "";
                bar.style.width = `${bar.dataset.percent || 0}%`;
            });
        });
    });
}
 
function checkLanguagesTab() {
    if (window.location.hash === "#languages") {
        playSkillBars();
    }
}

window.addEventListener("hashchange", checkLanguagesTab);
 
document.addEventListener("DOMContentLoaded", checkLanguagesTab);
 