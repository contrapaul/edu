/* b2.2.js — activity scripts for B2.2 Modelling and Prototyping */
(function () {
  'use strict';

  /* Image lightbox — enlarge captioned photos in-page instead of a new tab */
  var lightbox = document.getElementById('case-lightbox');
  if (!lightbox) return;
  var lightboxImg = lightbox.querySelector('img');

  document.querySelectorAll('.case-photo > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var img = link.querySelector('img');
      lightboxImg.src = link.getAttribute('href');
      lightboxImg.alt = img ? img.alt : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
