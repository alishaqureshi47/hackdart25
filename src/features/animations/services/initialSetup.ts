// Purpose: Initial tasks for the landing page. This includes handling the preloader, smooth scrolling, and setting the size of the announcement heading based on characters.  

import AnimationsRepository from "../repositories/animation.repository";
export default function initialSetup() {
    /**
     * Function to handle the initial tasks when the document is loaded
     */
    function initialDocumentTasks() {
        const preloader: HTMLElement | null = document.querySelector('.preloader');
        const landing: HTMLElement | null = document.querySelector('.general-wrapper');
        preloader?.classList.add('loaded');
        setTimeout(() => {
            preloader!.style.display = "none";
            landing!.classList.add('loaded');
            AnimationsRepository.handleAnims();
        }, 500);
    }

    // check whether the document is loaded or not
    if(document.readyState === "loading") {
        window.addEventListener('load', () => {
            initialDocumentTasks();
        });
    }
    else {
        setTimeout(() => {
            initialDocumentTasks();
        }, 300)
    }
}