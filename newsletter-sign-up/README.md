# Frontend Mentor - Newsletter sign-up form with success message solution

This is a solution to the [Newsletter sign-up form with success message challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/newsletter-signup-form-with-success-message-3FC1AZbNrv). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Add their email and submit the form
- See a success message with their email after successfully submitting the form
- See form validation messages if:
  - The field is left empty
  - The email address is not formatted correctly
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./screenshot.png)

### Links

- Solution URL: [https://github.com/jotaprojects/frontend-mentor/tree/master/newsletter-sign-up](https://github.com/jotaprojects/frontend-mentor/tree/master/newsletter-sign-up)
- Live Site URL: [https://jotaprojects.github.io/frontend-mentor/newsletter-sign-up/](https://jotaprojects.github.io/frontend-mentor/newsletter-sign-up/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
- [Sass](https://sass-lang.com/) - For development 
- [Vite](https://vitejs.dev/) - For development
- [Stylelint](https://stylelint.io/) - Linter for css, scss

### What I learned

From this challenge I learned that I need to take more time with the designs to find common components. 
For example for both of the views (start, success) in this challenge the main wrapper has a white background and border-radius. 

I also took sometime to read up on form validation as I am used with it being only js validation. 
The browsers nowadays has aldready good validation on the client side with new attributes to the input element. I did do some custom JavaScript in this challenge, mainly for the error message placement in the design. But I still used the Constraint Validation API that exists in the browser. 
I did some research on other used the API in their solutions. 
The JavaScript needs a specific structure otherwise it won't work so it can be more flexible if I compare to Pristine validation library. 

For this challenge I don't agree with the placement of the error message. I think it will be too tight between the label and the error message. I feel it would be better to have the error message below the input. 

### Continued development

- aria/accessibility
- grid

**ToDos**
- Add validation when the user is changing the input.
- Fix the `validateField` function regarding parent element. This should not return true when parent element doesn't exists. 

### Useful resources

- [Mdn web docs](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) - Validation API Docs
- [Pristine](https://github.com/sha256/Pristine) - JavaScript validation library. Used this for how to connect input to label and also the placement of error messages.
- [Sitepoint](https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/) - Can be outdated but still useful. 

## Author

- Website - [jotaprojects](https://jotaprojects.se)
- Frontend Mentor - [@jotaprojects](https://www.frontendmentor.io/profile/jotaprojects)

## Acknowledgments

- Previous co-worker 
- [Elaine](https://github.com/elaineleung) - I really like how she structured her solutions for Frontend Mentor. 
