$(document).ready(function () {

    // hamburger menu toggle
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });

    // Only smooth scroll for same-page anchors (not /#home style links)
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this).attr('href');
        if (target.length > 1 && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top,
            }, 500, 'linear');
        }
    });
});


document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Portfolio Divyansh Singh";
            $("#favicon").attr("href", "../assets/images/favhand.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "../assets/images/favhand.png");
        }
    });


// fetch projects start
function getProjects() {
    return fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            return data
        });
}


function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    if (!projectsContainer) return;

    let projectsHTML = "";
    projects.forEach(project => {
        const categoryLabel = {
            "mern": "Full Stack",
            "lamp": "LAMP Stack",
            "gui": "GUI App"
        }[project.category] || project.category;

        projectsHTML += `
        <div class="grid-item ${project.category}">
          <div class="project-card">
            <div class="card-img">
              <img draggable="false" src="../assets/images/projects/${project.image}.png" alt="${project.name}" />
              <div class="card-overlay">
                <a href="${project.links.view}" class="overlay-btn" target="_blank"><i class="fas fa-eye"></i> Live</a>
                <a href="${project.links.code}" class="overlay-btn" target="_blank"><i class="fas fa-code"></i> Code</a>
              </div>
            </div>
            <div class="card-body">
              <span class="category-badge ${project.category}">${categoryLabel}</span>
              <h3 class="card-title">${project.name}</h3>
              <p class="card-desc">${project.desc}</p>
            </div>
          </div>
        </div>`;
    });

    projectsContainer.innerHTML = projectsHTML || '<p class="no-projects">No projects available yet.</p>';

    // isotope filter
    var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
}


getProjects().then(data => {
    showProjects(data);
})
// fetch projects end

