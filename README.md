# Quipp: Surveying for Campuses!

This is a web-based survey application built with Next.js, TypeScript and Firebase, oriented specifically for college students across the US. The application allows users to create, manage, and participate in surveys in their campus or nationally.

### Live [here!](https://quipp.vercel.app/)

## Features

- **User Authentication**: Manage user accounts with features like user creation and deletion.
- **Survey Management**: Create, fetch, manage surveys.
- **Dynamic Forms**: Support for multiple question types, including text, multiple-choice, and more. Generated quickly without effort using Gemini's capabilities. No more wasting time on creating a survey if you have a tough assignment!
- **Filtering and moderation**: AI-based filtering of troll responses and moderation of violent/inappropriate content. 

### Key Directories

- **`src/app`**: Contains application-specific pages and components.
- **`src/components`**: Contains specific, broader components across application pages
- **`src/features`**: Contains the bulk logic of features and back-end implementation
- **`src/shared`**: Contains shared functions and components from across the app
- **`public`**: Static assets like images and icons.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alejo742/hackdart25.git
   cd hackdart25
   ```
2. Local Server Host:
In your terminal, install dependencies and run the server
    ```bash
    npm install
    npm run dev
    ```
    Now you should be good to go!

**NOTE:** you might lack the .env file necessary for running the project locally. Email at <alejandro.s.manrique.nunez.28.dartmouth.edu> if you need it.

## Contributors
Alisha Ahmad Qureshi <alisha.ahmad.qureshi.28@dartmouth.edu>
Alejandro Manrique Nunez <alejandro.s.manrique.nunez.28@dartmouth.edu>
Tina Pan <tina.pan.28@dartmouth.edu>
Vishal Powell <Vishal.J.Powell.28@dartmouth.edu>

## Disclaimers
- We did use AI in the making of this project for generating some front-end code and debugging.
- Image upload is broken since the end of the hackathon. Our Firestore database transitioned back to the free plan and therefore lost the capacity to store custom images.