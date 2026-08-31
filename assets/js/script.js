$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // theme toggle dark/light mode
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';

    function applyTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', theme);
        if (typeof initParticles === 'function') {
            initParticles();
        }
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const isDark = document.body.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // background music toggle
    const bgMusic = document.getElementById('bg-music');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const savedMusic = localStorage.getItem('music');

    let musicEnabled = savedMusic !== null ? savedMusic === 'on' : true;
    let musicStarted = false;

    function setMusicIcon() {
        if (!soundIcon) return;
        soundIcon.className = musicEnabled ? 'fas fa-volume-up' : 'fas fa-volume-off';
    }

    function updateMusicUI() {
        if (!soundToggle) return;
        soundToggle.classList.toggle('playing', musicEnabled && musicStarted);
        setMusicIcon();
    }

    function startMusic() {
        if (!bgMusic || musicStarted || !musicEnabled) return;
        const p = bgMusic.play();
        if (p && p.then) {
            p.then(function () {
                musicStarted = true;
                updateMusicUI();
            }).catch(function () {
                musicStarted = false;
            });
        } else {
            musicStarted = false;
        }
    }

    function toggleMusic() {
        if (!bgMusic) return;
        if (musicEnabled && musicStarted) {
            bgMusic.pause();
            musicEnabled = false;
        } else {
            musicEnabled = true;
            const p = bgMusic.play();
            if (p && p.catch) p.catch(function () {});
            musicStarted = true;
        }
        localStorage.setItem('music', musicEnabled ? 'on' : 'off');
        updateMusicUI();
    }

    setMusicIcon();

    // browsers block autoplay with sound, so start on the first user interaction
    const startOnInteraction = function (e) {
        if (soundToggle && soundToggle.contains(e.target)) return;
        startMusic();
        ['click', 'keydown', 'touchstart'].forEach(function (evt) {
            document.removeEventListener(evt, startOnInteraction);
        });
    };
    ['click', 'keydown', 'touchstart'].forEach(function (evt) {
        document.addEventListener(evt, startOnInteraction);
    });

    if (soundToggle) {
        soundToggle.addEventListener('click', toggleMusic);
    }

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        const scrollTopEl = document.querySelector('#scroll-top');
        if (scrollTopEl) {
            if (window.scrollY > 60) {
                scrollTopEl.classList.add('active');
            } else {
                scrollTopEl.classList.remove('active');
            }
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("VPAUZ6fH6wWkN48pE");

        emailjs.sendForm('service_uh50vva', 'template_lp82llc', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Divyansh Singh";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
const typingElement = document.querySelector(".typing-text");
if (typingElement) {
    var typed = new Typed(".typing-text", {
        strings: ["Full-Stack Web Developer", "backend development", "Python Application Developer", "Django Application Developer"],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
    });
}
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    if (!skillsContainer) return;

    let skillHTML = "";
    skills.forEach(skill => {
        const isFontAwesome = skill.icon && !skill.icon.startsWith("http");
        skillHTML += `
        <div class="bar">
              <div class="info">
                ${isFontAwesome ? `<i class="${skill.icon}"></i>` : `<img src="${skill.icon}" alt="${skill.name} logo" />`}
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    if (!projectsContainer) return;

    const visibleProjects = projects.filter(project => project.category && project.category !== "android");
    let projectHTML = "";

    visibleProjects.forEach(project => {
        const tech = (project.tech && project.tech.length)
            ? project.tech.map(t => `<span class="tech">${t}</span>`).join("")
            : "";
        const techBlock = tech
            ? `<div class="tech-stack"><h4>Tech Stack</h4><div class="chips">${tech}</div></div>`
            : "";
        const dateLine = project.date ? `<h4 class="date">${project.date}</h4>` : "";
        projectHTML += `
        <div class="box tilt">
      <div class="image">
        <img draggable="false" src="assets/images/projects/${project.image}.png" alt="${project.name}" />
      </div>
      <div class="content">
        <h3>${project.name}</h3>
        ${dateLine}
        <p class="desc">${project.desc}</p>
        ${techBlock}
        <div class="btns">
          <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-eye"></i> View Project</a>
          <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer">GitHub Code <i class="fas fa-code"></i></a>
        </div>
      </div>
    </div>`
    });

    projectsContainer.innerHTML = projectHTML || '<p class="no-projects">No projects available yet.</p>';

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    if (window.innerWidth > 768) {
        const srtop = ScrollReveal({
            origin: 'top',
            distance: '80px',
            duration: 1000,
            reset: true
        });

        /* SCROLL PROJECTS */
        srtop.reveal('.work .box', { interval: 200 });
    }

}

if (document.getElementById("skillsContainer")) {
    fetchData().then(data => {
        showSkills(data);
    });
}

if (document.querySelector("#work .box-container")) {
    fetchData("projects").then(data => {
        showProjects(data);
    });
}

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end


/* ===== SCROLL REVEAL ANIMATION =====
   Only run the hide-then-reveal animation on larger (desktop) screens.
   On mobile/tablet ScrollReveal leaves content faint/invisible because the
   IntersectionObserver reveal does not fire reliably there (reset:true re-hides
   elements while scrolling). Keeping content always visible on small screens
   guarantees it is readable. Desktop behaviour is unchanged. */
if (window.innerWidth > 768) {
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL HOME */
    srtop.reveal('.home .content h3', { delay: 200 });
    srtop.reveal('.home .content p', { delay: 200 });
    srtop.reveal('.home .content .btn', { delay: 200 });

    srtop.reveal('.home .image', { delay: 400 });
    srtop.reveal('.home .linkedin', { interval: 600 });
    srtop.reveal('.home .github', { interval: 800 });
    srtop.reveal('.home .twitter', { interval: 1000 });
    srtop.reveal('.home .telegram', { interval: 600 });
    srtop.reveal('.home .instagram', { interval: 600 });
    srtop.reveal('.home .dev', { interval: 600 });

    /* SCROLL ABOUT */
    srtop.reveal('.about .content h3', { delay: 200 });
    srtop.reveal('.about .content .tag', { delay: 200 });
    srtop.reveal('.about .content p', { delay: 200 });
    srtop.reveal('.about .content .box-container', { delay: 200 });
    srtop.reveal('.about .content .resumebtn', { delay: 200 });

    /* SCROLL SKILLS */
    srtop.reveal('.skills .container', { interval: 200 });
    srtop.reveal('.skills .container .bar', { delay: 400 });

    /* SCROLL EDUCATION */
    srtop.reveal('.education .box', { interval: 200 });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

    /* SCROLL CERTIFICATES */
    srtop.reveal('.certificates .box', { interval: 200 });

    /* SCROLL CONTACT */
    srtop.reveal('.contact .container', { delay: 400 });
    srtop.reveal('.contact .container .form-group', { delay: 400 });
}

/* CERTIFICATES - Google Drive links (edit these two variables) */
const certificate1Link = "https://drive.google.com/file/d/1Ch-MuYka8R1TZ23NsIU7qyrpRl11k1Qv/view?usp=sharing";
const certificate2Link = "https://drive.google.com/file/d/1mFCeXFhneohwqckeUGJwGG3DvMYRI6fR/view?usp=sharing";

function initCertificateLinks() {
    const link1 = document.getElementById("certificate1Link");
    const link2 = document.getElementById("certificate2Link");
    if (link1) link1.href = certificate1Link || "#";
    if (link2) link2.href = certificate2Link || "#";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCertificateLinks);
} else {
    initCertificateLinks();
}
