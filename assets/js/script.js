$(document).ready(function () {
    
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Close mobile menu when clicking on a link
    $('.navbar ul li a').click(function() {
        if ($(window).width() <= 768) {
            $('#menu').removeClass('fa-times');
            $('.navbar').removeClass('nav-toggle');
        }
    });

    // Close mobile menu when clicking outside
    $(document).click(function(event) {
        if ($(window).width() <= 768) {
            if (!$(event.target).closest('.navbar, #menu').length) {
                $('#menu').removeClass('fa-times');
                $('.navbar').removeClass('nav-toggle');
            }
        }
    });

    $(window).on('scroll load', function () {
        // Close mobile menu on scroll (only on mobile)
        if ($(window).width() <= 768) {
            $('#menu').removeClass('fa-times');
            $('.navbar').removeClass('nav-toggle');
        }

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy with adjusted offset
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 100; // Adjusted to match scroll offset
            let top = $(window).scrollTop();
            let id = $(this).attr('id');
            let windowHeight = $(window).height();
            let documentHeight = $(document).height();

            // Special handling for the last section (contact)
            if (id === 'contact' && top + windowHeight >= documentHeight - 50) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
            // Normal scroll spy logic for other sections
            else if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling with 100px offset
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100,
            }, 500, 'linear')
        }
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("4-PJnJXdiyTZ9i-zN"); // Replace with your EmailJS public key

        emailjs.sendForm('service_xhqg7zs', 'template_bvvou4r', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Message sent successfully! Thank you for contacting me.");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Failed to send message. Please try again or contact me directly.");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->
    // Experience modal functionality
    let experienceData = null
    fetchData("experience").then(data => {
    experienceData = data;});
    // Modal functionality
    const modal = document.getElementById('experienceModal');
    const modalCompanyName = document.getElementById('modalCompanyName');
    const modalPosition = document.getElementById('modalPosition');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close');

    // Add click event listeners to experience containers
    document.querySelectorAll('.experience .container').forEach(container => {
        container.addEventListener('click', function() {
            const company = this.getAttribute('data-company');
            const data = experienceData[company];
            
            if (data) {
                modalCompanyName.textContent = data.company;
                modalPosition.textContent = `${data.position} | ${data.period}`;
                
                let modalContent = '';
                if (data.reports.length > 0) {
                    const report = data.reports[0]; // Get the first (and only) report
                    modalContent += `
                        <a href="${report.link}" target="_blank" class="report-section-button">
                            <div class="report-section">
                                <h3>
                                    View Report
                                    <i class="fas fa-external-link-alt"></i>
                                </h3>
                            </div>
                        </a>
                    `;
                }
                if (data.achievements.length > 0) {
                    modalContent += '<div class="achievement-section">';
                    modalContent += '<h3>Achievements</h3>';
                    data.achievements.forEach(achievement => {
                        modalContent += `
                            <div class="achievement-item">
                                <h4>${achievement.title}</h4>
                                <p>${achievement.description}</p>
                            </div>
                        `;
                    });
                    modalContent += '</div>';
                }
                
                
                
                modalBody.innerHTML = modalContent;
                modal.style.display = 'block';
            }
        });
    });

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // Single Image Gallery with Scroll Navigation
    const galleryImage = document.getElementById('gallery-image');
    const progressBar = document.querySelector('.gallery-progress-bar');
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Image sources array - Add your actual image paths here
    const imageSources = [
        './assets/images/profile/profile1.jpeg',
        './assets/images/profile/profile2.JPG',
    ];
    
    let currentImageIndex = 0;
    let isScrolling = false;
    
    if (galleryImage && galleryContainer) {
        // Update image function with GSAP animation
        function updateImage(index) {
            if (index === currentImageIndex || isScrolling) return;
            
            isScrolling = true;
            galleryContainer.classList.add('changing');
            
            // Animate image change
            gsap.to(galleryImage, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    // Change image source
                    galleryImage.src = imageSources[index];
                    galleryImage.alt = `Sam Nguyen - Profile ${index + 1}`;
                    
                    // Animate back in
                    gsap.to(galleryImage, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.2)",
                        onComplete: () => {
                            galleryContainer.classList.remove('changing');
                            isScrolling = false;
                        }
                    });
                }
            });
            
            currentImageIndex = index;
            updateProgressBar(index);
        }
        
        function nextImage() {
            const nextIndex = (currentImageIndex + 1) % imageSources.length;
            updateImage(nextIndex);
        }
        
        function prevImage() {
            const prevIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            updateImage(prevIndex);
        }
        
        function updateProgressBar(index) {
            const progress = ((index + 1) / imageSources.length) * 100;
            gsap.to(progressBar, {
                width: `${progress}%`,
                duration: 0.5,
                ease: "power2.out"
            });
        }
        
        // Initialize
        updateProgressBar(0);
        
        // Mouse wheel scroll over image
        galleryContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (isScrolling) return;
            
            // Throttle scroll events
            if (galleryContainer.dataset.scrollThrottle) return;
            galleryContainer.dataset.scrollThrottle = 'true';
            
            setTimeout(() => {
                delete galleryContainer.dataset.scrollThrottle;
            }, 300);
            
            if (e.deltaY > 0) {
                nextImage(); // Scroll down - next image
            } else {
                prevImage(); // Scroll up - previous image
            }
        }, { passive: false });
        
        // Touch/swipe support
        let startY = 0;
        let startX = 0;
        let currentY = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        galleryContainer.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            currentY = startY;
            currentX = startX;
            startTime = Date.now();
            isDragging = true;
        });
        
        galleryContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            currentX = e.touches[0].clientX;
            
            e.preventDefault();
        }, { passive: false });
        
        galleryContainer.addEventListener('touchend', (e) => {
            if (!isDragging || isScrolling) return;
            
            const diffY = startY - currentY;
            const diffX = startX - currentX;
            const diffTime = Date.now() - startTime;
            
            // Determine if it's a vertical or horizontal swipe
            const isVerticalSwipe = Math.abs(diffY) > Math.abs(diffX);
            const velocity = Math.abs(isVerticalSwipe ? diffY : diffX) / diffTime;
            
            // Minimum threshold for swipe
            const threshold = velocity > 0.3 ? 30 : 60;
            
            if (isVerticalSwipe && Math.abs(diffY) > threshold) {
                if (diffY > 0) {
                    nextImage(); // Swipe up - next image
                } else {
                    prevImage(); // Swipe down - previous image
                }
            } else if (!isVerticalSwipe && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextImage(); // Swipe left - next image
                } else {
                    prevImage(); // Swipe right - previous image
                }
            }
            
            isDragging = false;
        });
        
        // Auto-play functionality (optional)
        let autoPlayInterval;
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (!isScrolling) {
                    nextImage();
                }
            }, 4000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Auto-play controls
        galleryContainer.addEventListener('mouseenter', stopAutoPlay);
        galleryContainer.addEventListener('mouseleave', startAutoPlay);
        galleryContainer.addEventListener('touchstart', stopAutoPlay);
        
        // Start auto-play
        startAutoPlay();
    }

});




// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Student", "backend developer","web developer"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(name = "skills") {
  try {
    const response = await fetch(`${name}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${name}.json`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return null;
  }
}




function showSkills(skills) {
    // This function handles skills display - currently skills are handled in HTML directly
    // but keeping this function to prevent JavaScript errors
    console.log('Skills loaded:', skills);
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#project .box-container");
    let projectHTML = "";
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        projectHTML += `
        <div class="box tilt">
      <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
      <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.code}" class="btn" target="_blank">Learn More  <i class="fas fa-code"></i></a>
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.project .box', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects/projects").then(data => {
    showProjects(data);
});

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

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}




/* ===== SCROLL REVEAL ANIMATION ===== */
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


/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });



/* SCROLL PROJECTS */
srtop.reveal('.project .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });