const platinumPic = document.querySelector('.js-platinum-pic');
const emeraldPic = document.querySelector('.js-emerald-pic');

export let userDecision = '';

platinumPic.addEventListener('click', () => {
    userDecision = 'platinum';
    window.location.href = '../../html/track.html';
})

emeraldPic.addEventListener('click', () => {
    userDecision = 'emerald';
    alert(userDecision)
})