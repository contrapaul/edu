/* ═══════════════════════════════════════════════════════════════════
   Choose Your Own Adventure — library shelf.
   Renders CYOA_BOOKS from books.js. Adding a book needs no edit here.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const shelf = document.getElementById('shelf');

  CYOA_BOOKS.forEach(function (book) {
    const item = document.createElement('li');
    item.className = 'shelf-item';

    // A finished book is a link to its own reader; an unfinished one is
    // the same cover, dimmed and inert.
    const frame = document.createElement(book.ready ? 'a' : 'div');
    frame.className = 'book-cover' + (book.ready ? '' : ' is-unready');
    if (book.ready) {
      frame.href = book.slug + '/';
    }

    const img = document.createElement('img');
    img.src = 'covers/' + book.slug + '.webp';
    // The artwork carries the title, so the alt text is the whole label.
    img.alt = book.ready ? book.title : book.title + ' (coming soon)';
    img.width = 400;
    img.height = 600;
    img.loading = 'lazy';
    img.decoding = 'async';

    frame.appendChild(img);
    item.appendChild(frame);
    shelf.appendChild(item);
  });
}());
