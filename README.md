NOTE! I am currently restructuring the files in order to get rid of the error messages so the app might not work correctly at all times. Thank you for your patience!

## Features

Store and create the recipes of your favorite foods and share them with others!

It's a simple recipe app where you can add, update and delete recipes. Login with email or Google account.
Add images and write down instructions. Browse your own recipes or publicly available recipes. Check what others have added.

You can toggle between public and private recipes and change the publicity status at any time. You can hide the extra options panel. When you do, a CSS animation starts where strawberry icons move around on top of the background image.

You can test the website via link. Note that if you want to use it in your working directory and test all the functionalities, you need to set up the correct Firebase configuration with database and storage and use your own keys for backend. You also might have to fix the file paths, because I have different file paths in my local environment for deployment.

![recipe_app](https://github.com/user-attachments/assets/f6ebab43-c52e-4ac4-a37c-e29e19e3a48e)

![recipe_app2](https://github.com/user-attachments/assets/d82ddaef-50de-4e86-9fe5-eebe6731d7da)

![recipe_app3](https://github.com/user-attachments/assets/9946ff85-6e4f-49c3-8577-3261233b9296)

## Improvement ideas

* Better styles and fixes to horrible UI
* Recipe search filter
* Download recipes to pdf
* Navbar for navigation
* Comments field
* Abort controllers
* Mobile support

## What I learned

This project was my first bigger JavaScript project that I made, without instructions. Firebase v. 11 was used for backend. I was a fool and put all the JS in two separate files at the start of the project. I wasn't sure about the proper file structure. I didn't know how all the imports and exports worked with ES6 modules so I did what I could. I restructured the JS files because they were causing error messages on console. Errors were caused by the fact that event listeners were listening when the DOM content was not loaded so I reorganized the files. Restructuring can be a huge pain but getting rid of the errors is more important to me.

The app itself doesn't look that good, but it works quite well.
