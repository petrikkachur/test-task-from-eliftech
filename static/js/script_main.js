
window.onscroll = function () {
    let nav = document.querySelector(".navbar")
    if (window.pageYOffset > nav.offsetHeight) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled')
    }

}
