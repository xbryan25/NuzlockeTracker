const supportedGamesButton = document.querySelector('.js-supported-games');
const popUpExitButton = document.querySelector('.js-close-btn');

supportedGamesButton.addEventListener('click', () => {
    document.getElementById("js-popup-1").classList.toggle("active");
});

popUpExitButton.addEventListener('click', () => {
    document.getElementById("js-popup-1").classList.toggle("active");
    // alert('pressed');
})