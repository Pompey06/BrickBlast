const subLists = document.querySelectorAll('.sub-list');
let activeSubList = null;
const isMobile = window.innerWidth <= 1150;

subLists.forEach((subList) => {
  subList.addEventListener('click', () => {
    activeSubList = subList;
    if (!subList.classList.contains('_active') && !isMobile) subLists.forEach((el) => el.classList.remove('_active'))
    subList.classList.toggle('_active');
  });

  subList.addEventListener('mouseenter', () => {
    if (isMobile) return;
    
    if (subList !== activeSubList) subLists.forEach((el) => el.classList.remove("_active"));
  });
});