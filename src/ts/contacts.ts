// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name') as string;
            const email = formData.get('email') as string;
            const message = formData.get('message') as string;

            // Basic validation
            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields';
                formMessage.style.color = 'red';
                return;
            }

            // Show both alert and success message
            window.alert('Thank you for your message! We have received your response.');
            formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            formMessage.style.color = 'green';

            // Clear the form
            contactForm.reset();
        });
    }
});

