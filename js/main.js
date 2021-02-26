const headerNavBtn  = document.querySelector('.nav-btn');
const headerNavList = document.querySelector('.nav-list');
const headerContent = document.querySelector('header-content');

headerNavBtn.addEventListener('click', ()=>{
  let expanded = headerNavBtn.getAttribute('aria-expanded') === 'true' || 'false';
  headerNavBtn.setAttribute('aria-expanded', !expanded);
  headerNavBtn.classList.toggle('nav-btn__open');
  headerNavList.classList.toggle('nav-list__open');
});



