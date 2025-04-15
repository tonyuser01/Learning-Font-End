interface EnrolledCourse {
    id: number;
    title: string;
    date: string;
}

class ProfileManager {
    private static instance: ProfileManager;
    private enrolledCourses: EnrolledCourse[] = [];

    private constructor() {
        this.loadEnrolledCourses();
    }

    static getInstance(): ProfileManager {
        if (!ProfileManager.instance) {
            ProfileManager.instance = new ProfileManager();
        }
        return ProfileManager.instance;
    }

    private loadEnrolledCourses(): void {
        const saved = typeof window !== 'undefined' ? window.localStorage.getItem('enrolledCourses') : null;
        this.enrolledCourses = saved ? JSON.parse(saved) : [];
    }

    private saveEnrolledCourses(): void {
        window.localStorage.setItem('enrolledCourses', JSON.stringify(this.enrolledCourses));
    }

    enrollCourse(course: EnrolledCourse): void {
        if (!this.enrolledCourses.some(c => c.id === course.id)) {
            this.enrolledCourses.push(course);
            this.saveEnrolledCourses();
        }
    }

    removeCourse(courseId: number): void {
        this.enrolledCourses = this.enrolledCourses.filter(c => c.id !== courseId);
        this.saveEnrolledCourses();
    }

    getEnrolledCourses(): EnrolledCourse[] {
        return [...this.enrolledCourses];
    }
}

// Initialize profile functionality
function initProfile(): void {
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    
    if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
            displayEnrolledCourses();
            profileModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Close modal when clicking outside
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Handle ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && profileModal) {
            profileModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

function displayEnrolledCourses(): void {
    const coursesList = document.getElementById('enrolled-courses-list');
    const profileManager = ProfileManager.getInstance();
    
    if (coursesList) {
        coursesList.innerHTML = '';
        const courses = profileManager.getEnrolledCourses();
        
        if (courses.length === 0) {
            coursesList.innerHTML = '<p>No courses enrolled yet.</p>';
            return;
        }

        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'enrolled-course-item';
            courseElement.innerHTML = `
                <div>
                    <h4>${course.title}</h4>
                    <p>Enrolled: ${course.date}</p>
                </div>
                <button class="remove-course" data-course-id="${course.id}">Remove</button>
            `;

            courseElement.querySelector('.remove-course')?.addEventListener('click', () => {
                profileManager.removeCourse(course.id);
                displayEnrolledCourses(); // Refresh the list
            });

            coursesList.appendChild(courseElement);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfile);

// Export the singleton instance
export const profileManager = ProfileManager.getInstance();




