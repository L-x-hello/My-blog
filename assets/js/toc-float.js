// 目录悬浮与联动定位
(function() {
  var toc = document.querySelector('.toc');
  if (!toc) return;
  var tocInner = toc.querySelector('.inner');
  var links = tocInner ? tocInner.querySelectorAll('a[href^="#"]') : [];
  if (!links.length) return;

  // 1. 悬浮与移动端折叠
  function handleTocPosition() {
    if (window.innerWidth < 900) {
      toc.classList.add('toc-mobile');
    } else {
      toc.classList.remove('toc-mobile');
    }
  }
  window.addEventListener('resize', handleTocPosition);
  handleTocPosition();

  // 2. 平滑滚动
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 兼容移动端收起目录
        if (toc.classList.contains('toc-mobile')) {
          toc.classList.remove('open');
        }
      }
    });
  });

  // 3. 联动高亮
  var headingSelector = 'h2[id],h3[id]';
  var headings = Array.prototype.slice.call(document.querySelectorAll(headingSelector));
  function onScroll() {
    var scrollPos = window.scrollY || window.pageYOffset;
    var offset = 80; // 头部高度适配
    var activeIndex = -1;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top + window.scrollY - offset <= scrollPos) {
        activeIndex = i;
      } else {
        break;
      }
    }
    links.forEach(function(link, idx) {
      link.classList.remove('active');
    });
    if (activeIndex >= 0) {
      var id = headings[activeIndex].id;
      var activeLink = tocInner.querySelector('a[href="#' + CSS.escape(id) + '"]');
      if (activeLink) activeLink.classList.add('active');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 4. 移动端展开/收起
  if (toc.classList.contains('toc-mobile')) {
    toc.addEventListener('click', function(e) {
      if (e.target.closest('summary')) {
        toc.classList.toggle('open');
      }
    });
  }
})();
