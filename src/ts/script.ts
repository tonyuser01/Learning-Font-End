// script.ts

// Define interface for course data
interface Course {
    title: string;
    topic: string;
}

// Function to fetch course titles from courses.json
async function fetchCourseData(): Promise<Course[]> {
    try {
        const response = await fetch('../data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.map((course: Course) => ({ 
            title: course.title, 
            topic: course.topic 
        }));
    } catch (error) {
        console.error('Error fetching course data:', error);
        return [];
    }
}

// Function to display autocomplete suggestions
function displayAutocomplete(input: string, courseData: Course[]): void {  
    const autocompleteList = document.getElementById('autocomplete-list');
    if (!autocompleteList) return;

    autocompleteList.innerHTML = '';
    if (!input) return;

    const matchingData = courseData.filter(item => 
        item.title.toLowerCase().includes(input.toLowerCase()) ||
        item.topic.toLowerCase().includes(input.toLowerCase())
    );

    matchingData.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('autocomplete-item');
        div.innerHTML = `
            <strong>${item.title}</strong><br>
            <span class="topic-text">Topic: ${item.topic}</span>
        `;
        div.addEventListener('click', () => {
            const topicUrl = getTopicUrl(item.topic);
            if (topicUrl) {
                window.location.href = topicUrl;
            }
        });
        autocompleteList.appendChild(div);
    });
}

// Helper function to get the correct URL based on topic
function getTopicUrl(topic: string): string {
    const topicMap: { [key: string]: string } = {
        'Web Development': './web-development.html',
        'Data Science': './data-science.html',
        'Design': './design.html',
        'Marketing': './marketing.html'
    };
    
    return topicMap[topic] || './gallery.html'; // Default to gallery if topic not found
}

// Function to initialize autocomplete
async function initAutocomplete() {
    const searchInput = document.getElementById('search-bar') as HTMLInputElement;
    const courseData = await fetchCourseData();

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            displayAutocomplete(searchInput.value, courseData);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Toggle Code (Existing) ---
    const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
    const mainNav = document.querySelector('.main-nav') as HTMLElement | null;
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', (!isExpanded).toString());
            mainNav.classList.toggle('is-open');
        });
    }

    // --- Image Slider Code ---
    const sliderContainer = document.querySelector('.slider-container') as HTMLElement;
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-control.prev') as HTMLButtonElement;
    const nextButton = document.querySelector('.slider-control.next') as HTMLButtonElement;

    if (sliderContainer && slides.length > 0 && prevButton && nextButton) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        // Initialize buttons state
        prevButton.disabled = true;

        function updateSliderPosition() {
            const offset = currentIndex * -100;
            sliderContainer.style.transform = `translateX(${offset}%)`;
            
            // Update button states
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === totalSlides - 1;
        }

        function goToNextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateSliderPosition();
            }
        }

        function goToPrevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        }

        // Add event listeners
        nextButton.addEventListener('click', goToNextSlide);
        prevButton.addEventListener('click', goToPrevSlide);

        // Optional: Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') goToNextSlide();
            if (e.key === 'ArrowLeft') goToPrevSlide();
        });

        // Optional: Add touch support
        let touchStartX = 0;
        let touchEndX = 0;

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    goToNextSlide();
                } else {
                    goToPrevSlide();
                }
            }
        });
    }

    // Initialize Autocomplete
    initAutocomplete();
});
