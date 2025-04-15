// Import the Course interface and profileManager from existing files
import { Course } from './gallery.js';
import { profileManager } from './profile.js';

document.addEventListener('DOMContentLoaded', () => {
    const courseContainer = document.querySelector('.course-grid');
    
    async function fetchWebDevelopmentCourses(): Promise<Course[]> {
        try {
            const response = await fetch('../data/courses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const courses: Course[] = await response.json();
            return courses.filter(course => course.topic === 'Web Development');
        } catch (error) {
            console.error('Could not fetch courses:', error);
            return [];
        }
    }

    function showCourseDetails(course: Course): void {
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

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'Close';

        const courseImage = document.createElement('img');
        courseImage.src = `../images/${course.image}`; // Updated path
        courseImage.alt = course.title;

        const courseTitle = document.createElement('h2');
        courseTitle.textContent = course.title;

        const courseInstructor = document.createElement('p');
        courseInstructor.classList.add('instructor');
        courseInstructor.textContent = `Instructor: ${course.instructor}`;

        const courseTopic = document.createElement('p');
        courseTopic.textContent = `Topic: ${course.topic}`;

        const courseDifficulty = document.createElement('p');
        courseDifficulty.classList.add('difficulty');
        courseDifficulty.textContent = `Difficulty: ${course.difficulty}`;

        const courseDescription = document.createElement('p');
        courseDescription.classList.add('description');
        courseDescription.textContent = course.description;

        const courseDate = document.createElement('p');
        courseDate.textContent = `Date: ${course.date}`;

        const enrollButton = document.createElement('button');
        enrollButton.classList.add('primary-button');
        enrollButton.textContent = 'Enroll Now';

        // Add event listeners
        closeButton.addEventListener('click', () => {
            modalContainer.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalContainer.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

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

        // Show the modal
        modalContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
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

    async function initializeWebDevelopmentPage(): Promise<void> {
        if (!courseContainer) {
            console.error('Course container not found!');
            return;
        }

        const webDevCourses = await fetchWebDevelopmentCourses();
        
        if (webDevCourses.length === 0) {
            courseContainer.innerHTML = '<p>No web development courses available at the moment.</p>';
            return;
        }

        courseContainer.innerHTML = webDevCourses
            .map(course => createCourseCard(course))
            .join('');

        // Add event listeners to all "View Details" buttons
        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', () => {
                const courseId = parseInt((button as HTMLElement).dataset.courseId || '0');
                const course = webDevCourses.find(c => c.id === courseId);
                if (course) {
                    showCourseDetails(course);
                }
            });
        });
    }

    initializeWebDevelopmentPage();
});











