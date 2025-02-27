import { signInWithPopup, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Importing the necessary functions
import { toggleEmailSignUp, emailSignUp } from './auth.js';
;

import { auth, provider } from './auth.js';

// Call these functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
   toggleEmailSignUp(); // Handle the email sign-in button click
});

document.addEventListener('DOMContentLoaded', () => {
   const logOutBtn = document.getElementById('logOutBtn');

   if (logOutBtn) {
       logOutBtn.addEventListener('click', logOut);
   }
});


// // Rate limiter

// const today = new Date();
// const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

// const userRecipesRef = collection(db, 'reseptit');

// // Ensure the user is authenticated
// if (auth.currentUser) {
//     const querySnapshot = await query(
//         userRecipesRef,
//         where('author', '==', auth.currentUser.uid),  // Filter recipes by the current user
//         where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startOfToday))  // Only count today's entries
//     ).get();

//     const updateCount = querySnapshot.size;

//     if (updateCount >= 5) {
//         showAlert('Rate limit exceeded. Please try again later.');
//         return;
//     }

//     // Proceed with the recipe upload or modification
// } else {
//     console.log("User not authenticated");
//     return;
// }


// Check if the user is already logged in
document.addEventListener('DOMContentLoaded', function () {
   if (localStorage.getItem('redirected') === 'true') {
       return; // If already redirected, do nothing
   }

   onAuthStateChanged(auth, (user) => {
       if (user) {
           console.log("User is already logged in");
           if (window.location.pathname !== '/src/dashboard.html') {
               localStorage.setItem('redirected', 'true'); // Prevent future redirects
               window.location.href = '/src/dashboard.html';
           }
       } else {
           console.log("No user signed in.");
           emailSignUp();
       }
   });
});

// Sign in with Google

const googleSignInButton = document.getElementById('googleSignIn');
if (googleSignInButton) {
   googleSignInButton.addEventListener('click', signInWithGoogle);
}

export function signInWithGoogle() {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user; // Google User Object
        console.log(user, "is logged in");
        // Signed in:
        window.location.href = '/dashboard.html';
    })
    .catch((error) => {
        console.log("Error signing in with Google:", error);
    });
};

// Functions to fire loading overlay

function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Logic to load recipes
export function loadRecipes() {
    const collectionRef = collection(db, "Reseptit");
    const q = query(collectionRef);
    onSnapshot(q, (querySnapshot) => {
        const recipeList = document.getElementById('recipelist');
        recipeList.innerHTML = '';
        if (querySnapshot.empty) {
            const noRecipesMessage = document.createElement('div');
            noRecipesMessage.textContent = 'Welcome! There are no added recipes in your personal recipe collection. Add some or check what others have added!';
            recipeList.appendChild(noRecipesMessage);
        } else {
            querySnapshot.forEach((doc) => {
                const recipe = doc.data();
            });
        }
    });
}

let recipes = [];

function fetchRecipes() {
    const collectionRef = collection(db, "Reseptit");
    const q = query(collectionRef);
    onSnapshot(q, (querySnapshot) => {
        recipes = [];
        querySnapshot.forEach((doc) => {
            const recipeData = doc.data();
            recipeData.id = doc.id;
            recipes.push(recipeData);
        });
        showRecipeList(recipes, false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        fetchRecipes();
    }, );
});

// Default to showing private recipes
let showingPublicRecipes = false;

const toggleButton = document.getElementById('toggle-recipes-btn');
const statusText = document.getElementById('desc');

// Toggle between showing public and private recipes
toggleButton.addEventListener('click', () => {
    showingPublicRecipes = !showingPublicRecipes;
    // Update the recipe list

    if (showingPublicRecipes) {
        toggleButton.textContent = 'Show Private Recipes';
        statusText.textContent = 'Showing all recipes';
    } else {
        toggleButton.textContent = 'Show Public Recipes';
        statusText.textContent = 'Showing private recipes';
    }

    // By default this sends recipe list and value 'false' to showRecipeList
    showRecipeList(recipes, showingPublicRecipes);
});

// Function to show all the recipes in the list with a button

const showAllRecipesButton = document.getElementById('show-all-recipes-btn');
showAllRecipesButton.addEventListener('click', () => {
    showRecipeList(recipes, null, true);
});


// Show recipe list function that takes a list of recipes and a boolean value for args

function showRecipeList(recipes, publicity, showAll) {
    const recipeList = document.getElementById('recipelist');
    console.log(auth.currentUser.email);
    
    let filteredRecipes;

    if (showAll) {
        // Show all recipes (public and private)
        filteredRecipes = recipes.filter(recipe => recipe.public || recipe.author === auth.currentUser.email);
    } else if (showingPublicRecipes === true) {
        // Show only public recipes
        filteredRecipes = recipes.filter(recipe => recipe.public);
    } else if (showingPublicRecipes === false) {
        // Show only private recipes created by the current user
        filteredRecipes = recipes.filter(recipe => !recipe.public && recipe.author === auth.currentUser.email);
    } else {
        // Default to showing no recipes if no proper flag is set
        filteredRecipes = [];
    }

    // Clear the recipe list before adding new recipes
    recipeList.innerHTML = '';

    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');
            recipeItem.style.zoom = "90%";

            const imageElement = document.createElement('img');
            imageElement.classList.add('fullscreen-image');
            imageElement.src = recipe.imageUrl || 'default.jpeg';
            imageElement.width = 150;
            recipeItem.appendChild(imageElement);

            recipeItem.innerHTML += `
                <h3 class="recipe-name" data-id="${recipe.id}">${recipe.name}</h3>
                <p style="font-size: 12px;"><strong>ID:</strong> ${recipe.id}</p>
                <p style="font-size: 15px;"><strong>Created by:</strong> ${recipe.author}</p>
                <p style="font-size: 15px;"><strong>Added:</strong> ${recipe.date}</p>
                <p class="publicity" style="font-size: 15px;"><strong>Status:</strong> ${recipe.public ? 'Public' : 'Private'}</p>
                ${recipe.imageUrl !== 'default.jpeg' ? '<button style="padding: 4px; margin: 6px" class="fullscreen-image-button">Zoom image</button>' : ''}
                <span><button style="padding: 4px; margin: 6px" id="deleteRecipeButton-${recipe.id}" class="delete-button">Delete</button><button class="update-recipe-btn" data-recipe-id="${recipe.id}" style="padding: 4px; margin: 6px">Update Recipe</button></span>
            <br>
            `;

            recipeItem.addEventListener('click', () => {
                showRecipeDetails(recipe.id);
            });

            const deleteButton = recipeItem.querySelector(`#deleteRecipeButton-${recipe.id}`);
            deleteButton.addEventListener('click', () => deleteRecipeById(recipe.id));

            const fullscreenImageButton = recipeItem.querySelector('.fullscreen-image-button');
            if (fullscreenImageButton) {
                fullscreenImageButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    showFullscreenImage(imageElement);
                });
            }

            recipeList.appendChild(recipeItem);
        });
    } else {
        const noRecipesMessage = document.createElement('div');
        noRecipesMessage.textContent = 'Welcome! There are no added recipes in your personal recipe collection. Add some or check what others have added!';
        recipeList.appendChild(noRecipesMessage);
    }
}

function showFullscreenImage(imageElement) {

    
    const fullscreenImage = document.createElement('img');
    fullscreenImage.src = imageElement.src;
    fullscreenImage.classList.add('fullscreen-image');
  
    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.classList.add('fullscreen-container');
    fullscreenContainer.appendChild(fullscreenImage);
  
    document.body.appendChild(fullscreenContainer);
  
    fullscreenContainer.addEventListener('click', () => {
      fullscreenContainer.remove();
    });
  }
    
// Show recipe details in right panel after clinking the recipe in the left panel

function showRecipeDetails(recipeId) {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    if (recipe) {
        const addRecipeFormName = document.getElementById('recipeName');
        const addRecipeFormIngredients = document.getElementById('ingredients');
        const addRecipeFormInstructions = document.getElementById('instructions');
        addRecipeFormName.value = recipe.name;
        addRecipeFormIngredients.value = recipe.ingredients;
        addRecipeFormInstructions.value = recipe.instructions;
    }
}

// Delete recipe, only when the current user has made the recipe
function deleteRecipeById(recipeId) {
    console.log('Attempting to delete recipe with ID:', recipeId);
    if (auth.currentUser.email !== recipes.find((recipe) => recipe.id === recipeId).author) {
        console.log('User is not authorized to delete this recipe (someone else made it).');
        showAlert("You are not authorized to delete this recipe (someone else made it).");
        return;
    }
    
    if (confirm("Are you sure you want to delete this recipe?")) {
       deleteDoc(doc(db, "Reseptit", recipeId))
            .then(() => {
                console.log('Recipe successfully deleted!');
                showRecipeList(recipes, showingPublicRecipes, false);
            })
            .catch((error) => {
                console.error('Error removing recipe: ', error);
            });       
    } 
}

// Function to update the recipe, allow only the user who made the recipe to update it
async function updateRecipe(e) {
    const recipeId = e.target.dataset.recipeId;
    if (!recipeId) {
        console.error('Recipe ID is undefined or not set');
        alert('Error: Recipe ID is missing!');
        return;
    } if (auth.currentUser.email !== recipes.find((recipe) => recipe.id === recipeId).author) {
        console.log('User is not authorized to update this recipe (someone else made it).');
        showAlert("You are not authorized to update this recipe (someone else made it).");
        return;
    }

    console.log('Updating Recipe with ID:', recipeId);

    // Get updated values from the form
    const updatedTitle = document.getElementById('updateRecipeName').value;
    const updatedIngredients = document.getElementById('updateIngredients').value;
    const updatedInstructions = document.getElementById('updateInstructions').value;
    const publicityCheckbox = document.getElementById('updatePublicCheckbox');
    const imageFile = document.getElementById('updateRecipeImage').files[0]; // Image file

    console.log('Updated Title:', updatedTitle);
    console.log('Updated Ingredients:', updatedIngredients);
    console.log('Updated Instructions:', updatedInstructions);

    const updatedData = {
        name: updatedTitle,
        ingredients: updatedIngredients,
        instructions: updatedInstructions,
        date: "Modified on " + new Date().toLocaleDateString('fi-FI'),
        public: publicityCheckbox.checked ? true : false
    };

    if (confirm("Are you sure you want to update this recipe? (recipe.id: " + recipeId + ")")) {
        showLoadingOverlay();
        try {
            if (imageFile) {
                const uploadedImageUrl = await uploadRecipeImage(imageFile); // Handle image upload
                if (uploadedImageUrl) {
                    updatedData.imageUrl = uploadedImageUrl; // Only update image URL if a new image was uploaded
                }
            }

            console.log('Updated data being sent:', updatedData);
            await updateDoc(doc(db, "Reseptit", recipeId), updatedData);

            // Optionally, refresh the recipe list here
            showRecipeList(recipes, showingPublicRecipes, false);

            // Clear the form
            document.getElementById('updateRecipeName').value = '';
            document.getElementById('updateIngredients').value = '';
            document.getElementById('updateInstructions').value = '';
            document.getElementById('updatePublicCheckbox').checked = false;
            document.getElementById('updateRecipeImage').value = '';
            showAlert("Recipe updated successfully!");
        
        } catch (error) {
            console.error("Error updating recipe: ", error);
            alert("There was an error updating the recipe.");
        } finally {
            hideLoadingOverlay();
        }
    } else {
        console.log("Update canceled by user.");
    }
}

// Function to populate the update form with the current recipe data
async function populateFormWithRecipe(recipeId) {
   
    const recipe = recipes.find((recipe) => recipe.id === recipeId); // 
    
    if (recipe) {
        document.getElementById('updateRecipeName').value = recipe.name;
        document.getElementById('updateIngredients').value = recipe.ingredients;
        document.getElementById('updateInstructions').value = recipe.instructions;
        document.getElementById('updatePublicCheckbox').checked = recipe.public;

        document.getElementById('updaterecipebutton').dataset.recipeId = recipeId; // Store the recipeId in the button

        const updateButton = document.getElementById('updaterecipebutton');
        updateButton.dataset.recipeId = recipeId;
        console.log('Recipe ID set on button:', updateButton.dataset.recipeId);
        
    } else {
        alert("Recipe not found.");
    }
}

// Attach event listener for the update button

const updateButton = document.getElementById('updaterecipebutton');
updateButton.addEventListener('click', updateRecipe);

// Attach event listener to buttons for opening the form and updating the recipe
document.addEventListener('click', async (e) => {
    if (e.target && e.target.classList.contains('update-recipe-btn')) {
        console.log('Button clicked:', e.target);
        const recipeId = e.target.getAttribute('data-recipe-id'); // Get the recipe ID from the button
        console.log('Recipe ID:', recipeId);
        if (recipeId) {
            await populateFormWithRecipe(recipeId); // Populate the form with the recipe data
        } else {
            console.error('Recipe ID is undefined or not set');
            alert('Error: Recipe ID is missing!');
        }
    }
});

// Attach event listener to the update button
document.getElementById('updaterecipebutton').addEventListener('click', updateRecipe);

function uploadRecipeImage() {
    const fileInput = document.getElementById('recipeImage');
    return new Promise((resolve, reject) => {
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            console.log("Selected file:", file);
            const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
            showLoadingOverlay();

            if (file.size > maxFileSize) {
                showAlert("Image size exceeds the maximum allowed size of 5MB.");
                fileInput.value = ''; // Clear the file input
                resolve(null); // Resolve with no image
                hideLoadingOverlay();
            } else {
                const storageRef = ref(storage, 'Reseptit/' + file.name);

                uploadBytes(storageRef, file).then((snapshot) => {
                    console.log("Image uploaded!");
                    getDownloadURL(storageRef).then((imageUrl) => {
                        console.log("Image URL:", imageUrl);
                        resolve(imageUrl); // Resolve with the image URL
                        hideLoadingOverlay();
                    }).catch((error) => {
                        console.error("Error getting download URL:", error);
                        reject(error); // Reject with error
                        hideLoadingOverlay();
                    });
                }).catch((error) => {
                    console.error("Error uploading image:", error);
                    reject(error); // Reject with error
                    hideLoadingOverlay();
                });
            }
        } else {
            console.log("No image uploaded. Proceeding without image.");
            resolve(null); // Resolve with no image
            return;
        }
    });
}

async function addRecipeWithImage(imageUrl) {
    showLoadingOverlay();

    const recipeName = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;
    const author = auth.currentUser.email;
    const publicityCheckbox = document.getElementById('publicCheckbox');

    const recipeData = {
        name: recipeName,
        imageUrl: imageUrl || 'default.jpeg',
        ingredients: ingredients,
        instructions: instructions,
        author: author,
        date: new Date().toLocaleDateString('fi-FI'),
        public: publicityCheckbox.checked ? true : false
    };

    try {
        await addDoc(collection(db, "Reseptit"), recipeData);
        console.log('Recipe added');
        showAlert('Recipe added successfully!');
    } catch (error) {
        console.error("Error adding recipe:", error);
        throw error;
    } finally {
        hideLoadingOverlay();
    }
}



// This is the actual part where the form is submitted

document.getElementById('addRecipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const imageUrl = await uploadRecipeImage(); // Wait for the image to be uploaded
        await addRecipeWithImage(imageUrl);
        document.getElementById('addRecipeForm').reset();
    } catch (error) {
        console.error("Error during submission:", error);
        showAlert('Error submitting recipe: ' + error.message);
    }
});


loadRecipes(); // Ensure recipes are loaded when the page is ready

// Clear fields with clear button

const clearFieldsButton = document.getElementById('clearfields');
clearFieldsButton.addEventListener('click', () => {
    document.getElementById('recipeName').value = '';
    document.getElementById('ingredients').value = '';
    document.getElementById('instructions').value = '';
    document.getElementById('recipeImage').value = '';
    document.getElementById('publicCheckbox').checked = false;
});

// Clear fields with another clear button

const clearFieldsButton2 = document.getElementById('clearfields2');
clearFieldsButton2.addEventListener('click', () => {
    document.getElementById('updateRecipeName').value = '';
    document.getElementById('updateIngredients').value = '';
    document.getElementById('updateInstructions').value = '';
    document.getElementById('updateRecipeImage').value = '';
    document.getElementById('updatePublicCheckbox').checked = false;
});

function showAlert(message) {

    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;

    // Class and style additions:

    alertDiv.classList.add("alert");
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "40%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    alertDiv.style.zIndex = "9999";
    alertDiv.style.padding = "100px";
    alertDiv.style.fontSize = "30px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.boxShadow = "0px 4px 6px rgba(245, 247, 243, 0.1)";
    alertDiv.style.backgroundColor = "rgba(255, 255, 255, 1)";
    alertDiv.style.border = "1px solid #ccc";

    document.getElementById('body').appendChild(alertDiv);

    // Remove the alert after 3 seconds:        
    setTimeout(() => {  
        document.body.removeChild(alertDiv);
    }, 3000);
}

// Extra options etc:

const extraOptionsButton = document.getElementById('extraOptionsButton');
const extraOptionsContainer = document.getElementById('extraOptionsContainer');
const optionButtonContainer = document.getElementById('optionBtnContainer');
const berryContainer = document.getElementById('berrycontainer');
let storedBerryContainer;
let storedOptionButtonContainer;

extraOptionsButton.addEventListener('click', () => {
    storedBerryContainer = berryContainer;
    storedOptionButtonContainer = optionButtonContainer;
    berryContainer.remove();
    optionButtonContainer.remove();
    extraOptionsContainer.style.display = 'flex';
});

const hideOptionsButton = document.getElementById('hide-options-btn');

hideOptionsButton.addEventListener('click', () => {
    console.log("Hide options button clicked");
    if (storedBerryContainer && storedOptionButtonContainer && extraOptionsContainer) {
        console.log("Elements exist");
        const parentElement = extraOptionsContainer.parentNode;
        if (parentElement) {
            console.log("Parent element exists");
            parentElement.insertBefore(storedBerryContainer, extraOptionsContainer);
            parentElement.insertBefore(storedOptionButtonContainer, extraOptionsContainer.previousSibling);
            extraOptionsContainer.style.display = 'none';
        } else {
            console.error("Parent element does not exist");
        }
    } else {
        console.error("Elements do not exist");
    }
});
