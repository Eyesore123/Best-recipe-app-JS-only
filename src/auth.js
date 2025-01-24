// auth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export functions

export function logOut() {
    auth.signOut()
        .then(() => {
            console.log('User signed out');
            window.location.href = 'landingpage.html';
        })
        .catch((error) => {
            console.error('Sign out error: ', error);
        });
}

export function toggleEmailSignUp() {
    
    document.getElementById('emailSignIn').addEventListener('click', () => {
        document.getElementById('emailSignUpContainer').style.display = 'block';
        document.getElementById('whitecontainer').style.display = 'block';
        document.getElementById('auth-options').style.display = 'none';
        document.getElementById('h1container').style.display = 'none';
    });
}

// If this isn't here, sign in doesn't work:

document.addEventListener('DOMContentLoaded', function () {
    emailSignUp();
});

// const emailSignUpButton = document.getElementById('emailSignUpButton');

export function emailSignUp() {
    const form = document.getElementById('emailSignUpForm');
    if (form) {
        form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the default form submit behavior
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const isSignUp = document.getElementById('signUpRadio').checked; // Check if sign-up or login

        if (isSignUp) {
            // Sign up new user
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User signed up:", userCredential.user);

                    // Remove the event listener from the sign-up button

                    window.location.href = 'dashboard.html'; // Redirect to dashboard after successful sign-up
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.error("Email is already in use");
                        alert("This email is already registered. Please use a different email.");
                    } else {
                        console.error("Error signing up:", error);
                        alert("There was an error signing up. Please try again later.");
                    }
                });
        } else {
            // Log in existing user
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("User logged in:", userCredential.user);
                    window.location.href = 'dashboard.html'; // Redirect to dashboard after successful login
                })
                .catch((error) => {
                    console.error("Error logging in:", error);
                    alert("Invalid credentials. Please check your email and password.");
                });
        }

        // Reset the form
        form.reset();
         });
    }
}

export { firebaseConfig };
