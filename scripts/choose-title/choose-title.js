const fireredPic = document.querySelector('.js-firered-pic');
const leafgreenPic = document.querySelector('.js-leafgreen-pic');

const platinumPic = document.querySelector('.js-platinum-pic');
const emeraldPic = document.querySelector('.js-emerald-pic');

export let userDecision = '';

fireredPic.addEventListener('click', () => {
    userDecision = 'Fire Red';
    saveDataAndGoToNewTab(userDecision);
    
});

leafgreenPic.addEventListener('click', () => {
    userDecision = 'Leaf Green';
    saveDataAndGoToNewTab(userDecision);
    
});

platinumPic.addEventListener('click', () => {
    userDecision = 'Platinum';
    saveDataAndGoToNewTab(userDecision);
    
});

emeraldPic.addEventListener('click', () => {
    userDecision = 'Emerald';
    saveDataAndGoToNewTab(userDecision);
});

function saveDataAndGoToNewTab(userDecision){
    window.location.href = '../../html/track.html';
    localStorage.setItem('userDecision', userDecision);
}