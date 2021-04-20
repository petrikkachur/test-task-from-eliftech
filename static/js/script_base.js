document.querySelector('.navbar__burger').onclick = function (event) {
    let navbar = document.querySelector('.navbar__menu')
    if (this.classList.contains('active')) {
        navbar.classList.remove('active')
        this.classList.remove('active')
        document.body.style.overflow = 'auto'


    } else {
        this.classList.add('active')
        navbar.classList.add('active')
        document.body.style.overflow = 'hidden'
    }
}

let navbar__item = document.querySelectorAll('.navbar__item');
for (const iterator of navbar__item) {
    iterator.onclick = function (event) {
        let navbar__menu = document.querySelector('.navbar__menu')
        if (this.classList.contains('closed') && navbar__menu.classList.contains('active') && (this.children[1].style.display == '' || this.children[1].style.display == 'none')) {
            this.children[1].style.display = 'block'
            return
        }
        if (this.classList.contains('closed') && navbar__menu.classList.contains('active') && this.children[1].style.display == 'block') {
            this.children[1].style.display = 'none'

        }
    }
}

