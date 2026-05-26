/* ============================================================
   curriculum-sidebar.js
   Renders a fixed left-sidebar on DP and MYP curriculum pages.

   Usage: add to <body>:
     data-curr-type="dp"   (or "myp")
     data-curr-page="b1.1" (the page's topic/unit ID)
   ============================================================ */

(function () {
  'use strict';

  /* ── DP TOPIC DATA ──────────────────────────────────────── */
  var DP_GROUPS = [
    {
      id: 'A', label: 'Topic A', color: '#2c5f6e',
      topics: [
        { id: 'a1.1',  code: 'A1.1', title: 'Ergonomics',              href: '/curriculum/dp/a1.1-ergonomics.html' },
        { id: 'a2.1',  code: 'A2.1', title: 'User-centred Research',   href: '/curriculum/dp/a2.1-user-centred-research.html' },
        { id: 'a2.2',  code: 'A2.2', title: 'Prototyping Techniques',  href: '/curriculum/dp/a2.2-prototyping-techniques.html' },
        { id: 'a3.1',  code: 'A3.1', title: 'Material Classification', href: '/curriculum/dp/a3.1-material-classification.html' },
        { id: 'a3.2',  code: 'A3.2', title: 'Structural Systems',      href: '/curriculum/dp/a3.2-structural-systems.html' },
        { id: 'a3.3',  code: 'A3.3', title: 'Mechanical Systems',      href: '/curriculum/dp/a3.3-mechanical-systems.html' },
        { id: 'a3.4',  code: 'A3.4', title: 'Electronic Systems',      href: '/curriculum/dp/a3.4-electronic-systems.html' },
        { id: 'a4.1',  code: 'A4.1', title: 'Manufacturing Tech.',     href: '/curriculum/dp/a4.1-manufacturing-techniques.html' }
      ]
    },
    {
      id: 'B', label: 'Topic B', color: '#1a5cb8',
      topics: [
        { id: 'b1.1',  code: 'B1.1', title: 'User-centred Design',    href: '/curriculum/dp/b1.1-user-centred-design.html' },
        { id: 'b2.1',  code: 'B2.1', title: 'Design Process',         href: '/curriculum/dp/b2.1-design-process.html' },
        { id: 'b2.2',  code: 'B2.2', title: 'Modelling & Prototyping',href: '/curriculum/dp/b2.2-modelling-prototyping.html' },
        { id: 'b3.1',  code: 'B3.1', title: 'Material Selection',     href: '/curriculum/dp/b3.1-material-selection.html' },
        { id: 'b3.2',  code: 'B3.2', title: 'Structural Systems',     href: '/curriculum/dp/b3.2-structural-systems-application.html' },
        { id: 'b3.3',  code: 'B3.3', title: 'Mechanical Systems',     href: '/curriculum/dp/b3.3-mechanical-systems-application.html' },
        { id: 'b3.4',  code: 'B3.4', title: 'Electronic Systems',     href: '/curriculum/dp/b3.4-electronic-systems-application.html' },
        { id: 'b4.1',  code: 'B4.1', title: 'Production Systems',     href: '/curriculum/dp/b4.1-production-systems.html' }
      ]
    },
    {
      id: 'C', label: 'Topic C', color: '#3d6b4a',
      topics: [
        { id: 'c1.1',  code: 'C1.1', title: 'Responsibility of Designer', href: '/curriculum/dp/c1.1-responsibility-of-designer.html' },
        { id: 'c1.2',  code: 'C1.2', title: 'Inclusive Design',       href: '/curriculum/dp/c1.2-inclusive-design.html' },
        { id: 'c1.3',  code: 'C1.3', title: 'Beyond Usability',       href: '/curriculum/dp/c1.3-beyond-usability.html' },
        { id: 'c2.1',  code: 'C2.1', title: 'Design for Sustainability',href:'/curriculum/dp/c2.1-design-for-sustainability.html' },
        { id: 'c2.2',  code: 'C2.2', title: 'Circular Economy',       href: '/curriculum/dp/c2.2-circular-economy.html' },
        { id: 'c3.1',  code: 'C3.1', title: 'Product Analysis',       href: '/curriculum/dp/c3.1-product-analysis.html' },
        { id: 'c3.2',  code: 'C3.2', title: 'Life Cycle Analysis',    href: '/curriculum/dp/c3.2-life-cycle-analysis.html' },
        { id: 'c4.1',  code: 'C4.1', title: 'Design for Manufacture', href: '/curriculum/dp/c4.1-design-for-manufacture.html' }
      ]
    }
  ];

  /* ── MYP UNIT DATA ──────────────────────────────────────── */
  var MYP_GRADES = [
    {
      id: 'g6', label: 'Grade 6', color: '#7c3aed',
      units: [
        { id: 'g6-lego-designers', code: 'G6', title: 'Lego Designers', href: '/curriculum/myp/g6-lego-designers.html' }
      ]
    },
    {
      id: 'g7', label: 'Grade 7', color: '#7c3aed',
      units: [
        { id: 'g7-lego-engineers', code: 'G7', title: 'Lego Engineers', href: '/curriculum/myp/g7-lego-engineers.html' }
      ]
    },
    {
      id: 'g8', label: 'Grade 8', color: '#7c3aed',
      units: [
        { id: 'g8-bridge-designers', code: 'G8', title: 'Bridge Designers', href: '/curriculum/myp/g8-bridge-designers.html' },
        { id: 'g8-3d-modeling',      code: 'G8', title: '3D Modeling',       href: '/curriculum/myp/g8-3d-modeling.html' }
      ]
    },
    {
      id: 'g9', label: 'Grade 9', color: '#7c3aed',
      units: [
        { id: 'g9-toy-design',  code: 'G9', title: 'Toy Design',  href: '/curriculum/myp/g9-toy-design.html' },
        { id: 'g9-electronics', code: 'G9', title: 'Electronics', href: '/curriculum/myp/g9-electronics.html' }
      ]
    },
    {
      id: 'g10', label: 'Grade 10', color: '#7c3aed',
      units: [
        { id: 'g10-product-design', code: 'G10', title: 'Product Design', href: '/curriculum/myp/g10-product-design.html' },
        { id: 'g10-studio-project', code: 'G10', title: 'Studio Project', href: '/curriculum/myp/g10-studio-project.html' }
      ]
    }
  ];

  /* ── RENDER ─────────────────────────────────────────────── */

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildDPSidebar(currentId) {
    var html = '<div class="csb-inner">';
    html += '<a href="/curriculum/dp/" class="csb-home">← DP Design</a>';
    DP_GROUPS.forEach(function (group) {
      html += '<div class="csb-group">';
      html += '<div class="csb-group-label" style="--csb-color:' + group.color + '">' + escHtml(group.label) + '</div>';
      html += '<ul class="csb-list">';
      group.topics.forEach(function (topic) {
        var isCurrent = topic.id === currentId;
        html += '<li class="csb-item' + (isCurrent ? ' csb-current' : '') + '">';
        html += '<a href="' + escHtml(topic.href) + '" class="csb-link"' + (isCurrent ? ' aria-current="page"' : '') + '>';
        html += '<span class="csb-code">' + escHtml(topic.code) + '</span>';
        html += '<span class="csb-title">' + escHtml(topic.title) + '</span>';
        html += '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '</div>';
    return html;
  }

  function buildMYPSidebar(currentId) {
    var html = '<div class="csb-inner">';
    html += '<a href="/curriculum/myp/" class="csb-home">← MYP Design</a>';
    MYP_GRADES.forEach(function (grade) {
      html += '<div class="csb-group">';
      html += '<div class="csb-group-label" style="--csb-color:' + grade.color + '">' + escHtml(grade.label) + '</div>';
      html += '<ul class="csb-list">';
      grade.units.forEach(function (unit) {
        var isCurrent = unit.id === currentId;
        html += '<li class="csb-item' + (isCurrent ? ' csb-current' : '') + '">';
        html += '<a href="' + escHtml(unit.href) + '" class="csb-link"' + (isCurrent ? ' aria-current="page"' : '') + '>';
        html += '<span class="csb-code">' + escHtml(unit.code) + '</span>';
        html += '<span class="csb-title">' + escHtml(unit.title) + '</span>';
        html += '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '</div>';
    return html;
  }

  function init() {
    var pageId = document.body.getAttribute('data-curr-page');
    var type   = document.body.getAttribute('data-curr-type') || 'dp';
    if (!pageId) return;

    var sidebar = document.createElement('aside');
    sidebar.className = 'curr-sidebar';
    sidebar.id = 'curr-sidebar';
    sidebar.setAttribute('aria-label', type === 'dp' ? 'DP Design topics' : 'MYP Design units');

    sidebar.innerHTML = (type === 'dp')
      ? buildDPSidebar(pageId)
      : buildMYPSidebar(pageId);

    /* Insert right after <header> */
    var header = document.querySelector('.site-header');
    if (header && header.nextSibling) {
      document.body.insertBefore(sidebar, header.nextSibling);
    } else {
      document.body.appendChild(sidebar);
    }

    document.body.classList.add('has-sidebar');

    /* Scroll current item into view within the sidebar */
    var current = sidebar.querySelector('.csb-current .csb-link');
    if (current) {
      setTimeout(function () { current.scrollIntoView({ block: 'nearest' }); }, 120);
    }
  }

  /* Run as soon as the DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
