// Import the Course interface and profileManager from existing files
import { Course } from './gallery.js';
import { profileManager } from './profile.js';

document.addEventListener('DOMContentLoaded', () => {
    const courseContainer = document.querySelector('.course-grid');
    
    async function fetchDataScienceCourses(): Promise<Course[]> {
        try {
            const response = await fetch('../data/courses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const courses: Course[] = await response.json();
            return courses.filter(course => course.topic === 'Data Science');
        } catch (error) {
            console.error('Could not fetch courses:', error);
            return [];
        }
    }

    function createCourseCard(course: Course): string {
        return `
            <article class="course-card">
                ${course.difficulty === 'Advanced' ? '<div class="card-badge">Advanced</div>' : ''}
                <img src="../images/${course.image}" alt="${course.title}">
                <div class="card-content">
                    <h3>${course.title}</h3>
                    <p class="card-instructor">Instructor: ${course.instructor}</p>
                    <div class="card-details">
                        <span class="difficulty">${course.difficulty}</span>
                        <span class="rating">⭐ 4.8</span>
                    </div>
                    <p class="card-description">${course.description}</p>
                    <button class="view-details-button" data-course-id="${course.id}">View Details</button>
                </div>
            </article>
        `;
    }

    function showCourseDetails(course: Course): void {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        const modalContent = `
            <div class="modal">
                <div class="modal-content">
                    <img src="../images/${course.image}" alt="${course.title}">
                    <h2>${course.title}</h2>
                    <p class="instructor">Instructor: ${course.instructor}</p>
                    <p class="difficulty">Difficulty: ${course.difficulty}</p>
                    <p class="description">${course.description}</p>
                    <button class="enroll-button" data-course-id="${course.id}">Enroll Now</button>
                    <button class="close-modal">Close</button>
                </div>
            </div>
        `;
        modalContainer.innerHTML = modalContent;
        modalContainer.classList.add('show');

        // Add event listeners for the modal buttons
        const closeButton = modalContainer.querySelector('.close-modal');
        const enrollButton = modalContainer.querySelector('.enroll-button');
        // Remove the unused modal variable
        // const modal = modalContainer.querySelector('.modal');

        // Close modal when clicking the close button
        closeButton?.addEventListener('click', () => {
            modalContainer.classList.remove('show');
        });

        // Close modal when clicking outside the modal
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.remove('show');
            }
        });

        // Handle enrollment
        enrollButton?.addEventListener('click', () => {
            profileManager.enrollCourse(course);
            window.alert(`Successfully enrolled in ${course.title}!`);
            modalContainer.classList.remove('show');
        });
    }

    async function initializeDataSciencePage(): Promise<void> {
        if (!courseContainer) {
            console.error('Course container not found!');
            return;
        }

        const dataScienceCourses = await fetchDataScienceCourses();
        
        if (dataScienceCourses.length === 0) {
            courseContainer.innerHTML = '<p>No data science courses available at the moment.</p>';
            return;
        }

        courseContainer.innerHTML = dataScienceCourses
            .map(course => createCourseCard(course))
            .join('');

        // Add event listeners to all "View Details" buttons
        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', () => {
                const courseId = parseInt((button as HTMLElement).dataset.courseId || '0');
                const course = dataScienceCourses.find(c => c.id === courseId);
                if (course) {
                    showCourseDetails(course);
                }
            });
        });
    }

    initializeDataSciencePage();
});








