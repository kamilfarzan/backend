window.onscroll = () => makeHeaderBlack();
window.onload = () => makeHeaderBlack();
const header = document.querySelector("header");
const detectSticky = header.offsetTop;

function makeHeaderBlack() {
  window.pageYOffset > detectSticky
    ? header.classList.add("black-bg")
    : header.classList.remove("black-bg");
}

const menu_btn = document.querySelector(".hamburger");
const mobile_menu = document.querySelector(".mobile-nav");

menu_btn.addEventListener("click", function () {
  menu_btn.classList.toggle("is-active");
  mobile_menu.classList.toggle("is-active");
});

let button = document.querySelector(".light-check");

button.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-mode");

  document.querySelectorAll(".inverted").forEach((result) => {
    result.classList.toggle("invert");
  });
});

{
  AOS.init({
    duration: 3000,
    once: true,
  });
}
