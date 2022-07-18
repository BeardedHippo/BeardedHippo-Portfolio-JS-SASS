// Navbar control

//Op basis van de dataset bepaal ik of het de exit knop is of een section. Dan wordt er naar de section gescrolled en de nav block gesloten
document.querySelector(".mobile-nav__navblock").addEventListener("click", function(event) {
    if (event.target.dataset.nav === "s_exit") {
        toggleNav();

        return
    }

    let destinationElement = "." + event.target.dataset.nav;
    let scrollDestination = document.querySelector(destinationElement).offsetTop;

    toggleNav();
    window.scrollTo(0, scrollDestination);
});

document.querySelector(".navbar-desktop__container").addEventListener("click", function(event) {
    let destinationElement = "." + event.target.dataset.nav;
    let scrollDestination = document.querySelector(destinationElement).offsetTop;

    window.scrollTo(0, scrollDestination);
});

//Deze functie opent of sluit de nav block
function toggleNav() {
    let navElement = document.querySelector(".mobile-nav");
    let bodyElement = document.querySelector("body");

    if (navElement.classList.contains("mobile-nav--active")) {
        bodyElement.style.overflow = "";
        navElement.classList.remove("mobile-nav--active");
    } else {
        bodyElement.style.overflow = "hidden";
        navElement.classList.add("mobile-nav--active");
    }
}




// Swiper carousel

const swiper = new Swiper(".mywork-carousel__carousel", {
    slidesPerView: "auto",
    spaceBetween: 10,
    loop: true,
    loopedSlides: 5,
    centeredSlides: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

// Swiper-carousel button direction control

function controlWork(direction) {
    if (direction === 'left') {
        swiper.slidePrev();
    } else {
        swiper.slideNext();
    }
}

// Deze event listeners verzorgen de mouse-over effect als er over de actieve slide gehoverd wordt
document.querySelector('.swiper-wrapper').addEventListener('mouseover', (event) => {
    // Beetje bijzonder, maar omdat swiper niet een eigen hover had, en de animatie op basis van de wrapper is gebouwd, heb ik het op deze manier moeten bouwen
    let target = event.target.parentElement.parentElement.parentElement.parentElement;
    if (target.classList.contains('swiper-slide-active')) {
        document.querySelector('.swiper-slide-active .swiper-slide__content').classList.add('swiper-slide__content--hover');
    }
})

document.querySelector('.swiper-wrapper').addEventListener('mouseout', (event) => {
    let target = event.target.parentElement.parentElement.parentElement.parentElement;
    if (target.classList.contains('swiper-slide-active')) {
        document.querySelector('.swiper-slide__content--hover').classList.remove('swiper-slide__content--hover');
    }
})

// Socials

// Deze functie hjaalt alle streepjes weg zodat alleen de onderdelen van de links overblijven
function createSocial(...args) {
    let newString = "";

    args.forEach((stringArray) => {
        let i = 0;
        let stringLength = stringArray.length;

        while (i < stringLength) {
            newString = newString + stringArray[i];
            i = i + 2;
        }
    })
    return newString
}

let p1 = "P-a-t-r-i-c-k".split("");
let p2 = "@-B-e-a-r-d-e-d-H-i-p-p-o".split("");
let p3 = ".-n-l".split("");
let p4 = "/-i-n-/-P-a-t-r-i-c-k-d-e-G-r-e-a-t".split("");
let p5 = "0-6- --- -2-2- -9-5- -7-5- -0-1".split("");
let p6 = "0-6-2-2-9-5-7-5-0-1".split("");

// Hier worden de onderdelen van de links gemaakt en vervolgens in de dom geinjecteerd. Zodat bots mijn gegevens niet zomaar kunnen pikken
let firstSocialItem = createSocial(p1, p2, p3);
let secondSocialItem = createSocial(p4);
let thirdSocialItem = createSocial(p5);
let fourthSocialItem = createSocial(p6);

document.querySelector(".socials__info__email").innerHTML = `<a href="mailto:${firstSocialItem}" class="social-link">${firstSocialItem}</a>`;
document.querySelector(".socials__info__linkedin").innerHTML = `<a href="https://linkedin.com/${secondSocialItem}" class="social-link" target="_blank">${secondSocialItem}</a>`;
document.querySelector(".socials__info__phone").innerHTML = `<a href="tel:${fourthSocialItem}" class="social-link">${thirdSocialItem}</a>`;


// Form validation
document.querySelector(".contact-form").addEventListener('submit', event => {
    event.preventDefault();

    function getInputValue(element) {
        return document.getElementById(element).value
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function formValidation() {
        let validation = 'valid' // Dit is altijd valid, tenzij één van de checks hier invalid van maakt. De PHP mailer heeft ook zijn eigen validators ingebouwd natuurlijk.

        document.querySelectorAll(".contact-form__input").forEach((input) => {
            if (input.value.length < 1) {
                input.parentElement.classList.add('input-error');
                validation = 'invalid';
            } else if(input.id && input.id === 'contact-form__field--email' && !validateEmail(input.value)) {
                validation = 'invalid';
                input.parentElement.classList.add('invalid-email');
            } else {
                input.parentElement.classList.remove('input-error');

                if (input.parentElement.classList.contains('invalid-email')) {
                    input.parentElement.classList.remove('invalid-email');
                }
            }
        })



        if (validation === 'valid') {
            return true
        } else {
            return false
        }
    }

    if (formValidation()) {
        grecaptcha.ready(function() { // Google Captcha V3
            grecaptcha.execute('6Lf-B-4gAAAAADzl5yQ2JfJbMN-u1Fyz6WCTmTrk', {action: 'submit'}).then(function(token) {
                var url = './sendmail.php';
                var formData = new FormData(); // Formdata wordt gemaakt op basis van alle appendings

                formData.append('token', token);
                formData.append('post-name', getInputValue("contact-form__field--name"));
                formData.append('post-mail', getInputValue("contact-form__field--email"));
                formData.append('post-subject', getInputValue("contact-form__field--subject"));
                formData.append('post-body', getInputValue("contact-form__field--message"));


                fetch(url, { method: 'POST', body: formData }) // Wordt d.m.v. de fetch api naar sendmail.php gestuurd voor de server-side afhandeling
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (body) {
                        if (body === 'succes') { // Bij een succesvolle response komt er een notificatie in de front-end
                            document.querySelector(".mail-form__thankyou").classList.add('mail-form__thankyou--visible');
                            document.querySelector(".contact-form").classList.add('contact-form--reset');

                            setTimeout(() => {
                                document.querySelector(".mail-form__thankyou").classList.remove('mail-form__thankyou--visible');
                                document.querySelector(".contact-form").classList.remove('contact-form--reset');
                                document.querySelector(".contact-form").reset();
                            }, 5000)
                        }
                    });
            });
        });
    }
});