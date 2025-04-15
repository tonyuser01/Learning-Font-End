// Define an interface for the structure of a Course object
export interface Course {
    id: number;
    title: string;
    instructor: string;
    topic: string;
    difficulty: string;
    description: string;
    image: string;
    date: string;
}

let allCourses: Course[] = [];

// DOM Element References
const galleryContainer = document.getElementById('gallery-container') as HTMLElement | null;
const searchInput = document.getElementById('search-bar') as HTMLInputElement | null;
const filterButtons = document.querySelectorAll('.filter-button');
const paginationControls = document.getElementById('pagination-controls') as HTMLElement | null;

// Remove the unused allButton variable
// const allButton = document.querySelector('.filter-button[data-filter="ALL"]');

// Pagination variables
let currentPage = 1;
const coursesPerPage = 10;
let initialItemsShown = 5;
const itemsToLoadPerClick = 5;

filterButtons.forEach(button => {
    button.addEventListener('click', async () => {
        try {
            const filterValue = button.getAttribute('data-filter');
            currentPage = 1;
            await filterAndDisplayCourses(filterValue || undefined, currentPage);
        } catch (error) {
            console.error('Error in filter button click:', error);
        }
    });
});

async function fetchCourses(): Promise<Course[]> {
    try {
        const response = await fetch('../data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Could not fetch courses:', error);
        return [];
    }
}


import { profileManager } from './profile.js';

function showCourseDetails(course: Course) {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        console.error('Modal container not found!');
        return;
    }

    // Clear any existing modal content
    modalContainer.innerHTML = '';

    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Add this line to create modalContent
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'Close';
    
    // Modify close button functionality
    closeButton.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });

    // Add click event to modal container to close when clicking outside
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    const enrollButton = document.createElement('button');
    enrollButton.classList.add('primary-button');
    enrollButton.textContent = 'Enroll Now';
    enrollButton.addEventListener('click', () => {
        profileManager.enrollCourse({
            id: course.id,
            title: course.title,
            date: new Date().toISOString().split('T')[0]
        });
        window.alert(`Successfully enrolled in ${course.title}!`);
        modalContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    const courseImage = document.createElement('img');
    courseImage.src = `../images/${course.image}`; // Updated path
    courseImage.alt = course.title;
    courseImage.classList.add('modal-image');

    const courseTitle = document.createElement('h3');
    courseTitle.textContent = course.title;

    const courseInstructor = document.createElement('p');
    courseInstructor.textContent = `Instructor: ${course.instructor}`;

    const courseTopic = document.createElement('p');
    courseTopic.textContent = `Topic: ${course.topic}`;

    const courseDifficulty = document.createElement('p');
    courseDifficulty.textContent = `Difficulty: ${course.difficulty}`;

    const courseDescription = document.createElement('p');
    courseDescription.textContent = course.description;

    const courseDate = document.createElement('p');
    courseDate.textContent = `Date: ${course.date}`;

    // Assemble modal content
    modalContent.appendChild(closeButton);
    modalContent.appendChild(courseImage);
    modalContent.appendChild(courseTitle);
    modalContent.appendChild(courseInstructor);
    modalContent.appendChild(courseTopic);
    modalContent.appendChild(courseDifficulty);
    modalContent.appendChild(courseDescription);
    modalContent.appendChild(courseDate);
    modalContent.appendChild(enrollButton);

    modal.appendChild(modalContent);
    modalContainer.appendChild(modal);
     // Log appending

    // Show the modal
    modalContainer.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}


function createCourseCard(course: Course): HTMLElement {
    const article = document.createElement('article');
    article.classList.add('course-card');

    // Add badge for advanced courses
    if (course.difficulty === 'Advanced') {
        const badge = document.createElement('div');
        badge.classList.add('card-badge');
        badge.textContent = 'Advanced';
        article.appendChild(badge);
    }

    // Add course image
    const img = document.createElement('img');
    img.src = `../images/${course.image}`;
    img.alt = course.title;
    article.appendChild(img);

    // Create card content container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('card-content');

    // Add course title
    const title = document.createElement('h3');
    title.textContent = course.title;
    contentDiv.appendChild(title);

    // Add instructor info
    const instructor = document.createElement('p');
    instructor.classList.add('card-instructor');
    instructor.textContent = `Instructor: ${course.instructor}`;
    contentDiv.appendChild(instructor);

    // Add details (difficulty and rating)
    const details = document.createElement('div');
    details.classList.add('card-details');
    
    const difficulty = document.createElement('span');
    difficulty.classList.add('difficulty');
    difficulty.textContent = course.difficulty;
    
    const rating = document.createElement('span');
    rating.classList.add('rating');
    rating.textContent = '⭐ 4.8';
    
    details.appendChild(difficulty);
    details.appendChild(rating);
    contentDiv.appendChild(details);

    // Add description
    const description = document.createElement('p');
    description.classList.add('card-description');
    description.textContent = course.description;
    contentDiv.appendChild(description);

    // Add view details button
    const button = document.createElement('button');
    button.classList.add('view-details-button');
    button.textContent = 'View Details';
    button.dataset.courseId = course.id.toString();
    button.addEventListener('click', () => showCourseDetails(course));
    contentDiv.appendChild(button);

    article.appendChild(contentDiv);
    return article;
}

async function displayCourses(courses: Course[], container: HTMLElement, page: number): Promise<void> {
    try {
        container.innerHTML = '';
        const startIndex = (page - 1) * coursesPerPage;
        const endIndex = Math.min(startIndex + initialItemsShown, courses.length);
        
        for (const course of courses.slice(startIndex, endIndex)) {
            const card = createCourseCard(course);
            container.appendChild(card);
        }

        if (endIndex < courses.length) {
            const showMoreButton = document.createElement('button');
            showMoreButton.id = 'show-more-button';
            showMoreButton.textContent = 'Show More';
            showMoreButton.addEventListener('click', async () => {
                try {
                    initialItemsShown += itemsToLoadPerClick;
                    await displayCourses(courses, container, page);
                } catch (error) {
                    console.error('Error loading more courses:', error);
                }
            });
            container.appendChild(showMoreButton);
        }
    } catch (error) {
        console.error('Error in displayCourses:', error);
    }
}

async function filterAndDisplayCourses(filter?: string, page: number = 1): Promise<void> {
    try {
        let filteredCourses = [...allCourses];
        
        if (filter && filter !== 'ALL') {
            filteredCourses = filteredCourses.filter(course => 
                course.topic.toUpperCase() === filter.toUpperCase()
            );
        }

        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filteredCourses = filteredCourses.filter(course =>
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
            );
        }

        if (galleryContainer) {
            await displayCourses(filteredCourses, galleryContainer, page);
            updatePaginationControls(Math.ceil(filteredCourses.length / coursesPerPage), page);
        }
    } catch (error) {
        console.error('Error in filterAndDisplayCourses:', error);
    }
}

function updatePaginationControls(totalPages: number, currentPage: number): void {
    if (!paginationControls) return;
    paginationControls.innerHTML = '';

    // Add "Page" text before the buttons
    const pageText = document.createElement('span');
    pageText.textContent = 'Page: ';
    pageText.classList.add('pagination-text');
    paginationControls.appendChild(pageText);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i.toString();
        pageButton.classList.add('pagination-button');
        // Add active class to current page
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            filterAndDisplayCourses(undefined, currentPage);
        });
        paginationControls.appendChild(pageButton);
    }
}

async function initGallery(): Promise<void> {
    if (!galleryContainer) {
        console.error('Gallery container not found!');
        return;
    }

    try {
        galleryContainer.innerHTML = '<p>Loading courses...</p>';
        allCourses = await fetchCourses();
        await filterAndDisplayCourses(undefined, currentPage);

        if (searchInput) {
            searchInput.addEventListener('input', async () => {
                try {
                    currentPage = 1;
                    await filterAndDisplayCourses(undefined, currentPage);
                } catch (error) {
                    console.error('Error handling search:', error);
                }
            });
        }

        const sortingDropdown = document.querySelector('.sorting-dropdown select');
        if (sortingDropdown) {
            sortingDropdown.addEventListener('change', async (event) => {
                try {
                    const sortingValue = (event.target as HTMLSelectElement).value;
                    await sortAndDisplayCourses(sortingValue);
                } catch (error) {
                    console.error('Error handling sort:', error);
                }
            });
        }

        // Add error handling for modal operations
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modalContainer = document.getElementById('modal-container');
                if (modalContainer) {
                    modalContainer.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });

    } catch (error) {
        console.error('Error initializing gallery:', error);
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
        }
    }
}

async function sortAndDisplayCourses(sortingValue: string): Promise<void> {
    try {
        if (!galleryContainer) return;

        const sortedCourses = [...allCourses];
        
        switch (sortingValue) {
            case 'alphabetical':
                sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date':
                sortedCourses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                break;
            default:
                console.warn(`Unknown sorting value: ${sortingValue}`);
                return;
        }

        await displayCourses(sortedCourses, galleryContainer, 1);
        updatePaginationControls(Math.ceil(sortedCourses.length / coursesPerPage), 1);
    } catch (error) {
        console.error('Error in sortAndDisplayCourses:', error);
    }
}

// Initialize the gallery
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initGallery();
    } catch (error) {
        console.error('Failed to initialize gallery:', error);
    }
});
