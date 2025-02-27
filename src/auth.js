// auth.js
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const auth = getAuth(app);
const db = getFirestore(app);
console.log(db);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Function to toggle between email sign-in and sign-up forms
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


// Email sign-up/sign-in logic
export function emailSignUp() {
    const form = document.getElementById('emailSignUpForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const isSignUp = document.getElementById('signUpRadio').checked;

            if (isSignUp) {
                // Sign up new user
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("User signed up:", userCredential.user);
                        window.location.href = '/src/dashboard.html';
                    })
                    .catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            alert("Email is already registered. Please use a different email.");
                        } else {
                            console.error("Error signing up:", error);
                            alert("Error signing up. Try again later.");
                        }
                    });
            } else {
                // Log in existing user
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("User logged in:", userCredential.user);
                        window.location.href = '/src/dashboard.html';
                    })
                    .catch((error) => {
                        alert("Invalid credentials. Please check your email and password.");
                    });
            }

            form.reset(); // Reset form after submission
        });
    }
}
export function logOut() {
    signOut(auth)
    .then(() => {
    console.log('User signed out');
    window.location.href = '/src//index.html';
    })
    .catch((error) => {
        console.error('Error signing out:', error);
        });
}


export { db, auth, storage, provider };