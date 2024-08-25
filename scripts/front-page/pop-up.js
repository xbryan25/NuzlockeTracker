const supportedGamesButton = document.querySelector('.js-supported-games');
const popUpExitButton = document.querySelector('.js-close-btn');

supportedGamesButton.addEventListener('click', () => {
    // set .active to on
    document.getElementById("js-popup-1").classList.add("active");
});

popUpExitButton.addEventListener('click', () => {
    // set .active to off
    document.getElementById("js-popup-1").classList.remove("active");
})