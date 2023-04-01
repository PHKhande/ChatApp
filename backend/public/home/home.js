//Sidebar opening and closing
const homeHamburgerMenu = document.querySelector('.hamburger-menu');
const sideHamburgerMenu = document.getElementById("sideHam");
const sidebar = document.querySelector(".sidebar");
const homeBody = document.getElementById('homeBody')

homeHamburgerMenu.addEventListener("click", openSB);
sideHamburgerMenu.addEventListener("click", closeSB);

function openSB() {
    sidebar.classList.add("active-sidebar");
    homeHamburgerMenu.classList.add('active-homeHam');
    homeBody.classList.toggle('show-sidebar');
}

function closeSB() {
    sidebar.classList.remove("active-sidebar");
    homeHamburgerMenu.classList.remove('active-homeHam');
}