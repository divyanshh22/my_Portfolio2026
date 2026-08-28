$(document).ready(function(){

    $('#menu').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if(window.scrollY>60){
            document.querySelector('#scroll-top').classList.add('active');
        }else{
            document.querySelector('#scroll-top').classList.remove('active');
        }
    });
});

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL CERTIFICATES */
srtop.reveal('.certificates .box',{interval: 200});

// Tawk.to Live Chat removed

document.addEventListener('visibilitychange',
function(){
    if(document.visibilityState === "visible"){
        document.title = "Certificates | Portfolio Divyansh Singh";
        $("#favicon").attr("href","../assets/images/favhand.png");
    }
    else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href","../assets/images/favhand.png");
    }
});
