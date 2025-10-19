$(document).ready(function() {
    // MENU
  $("#menuFooter").html($("#menuHeader").html());

  function setActive(index) {
    $("#menuHeader div, #menuFooter div").removeClass("active");
    $("#menuHeader div").eq(index).addClass("active");
    $("#menuFooter div").eq(index).addClass("active");
  }

  $("#menuHeader, #menuFooter").on("click", "div", function(){
    const index = $(this).index();
    setActive(index);
  });

  // NEWS
  $('.news h2').click(function() {
    const parent = $(this).parent('.news');
    parent.toggleClass('open');
    parent.find('p').slideToggle(200);
  });

  // DRAG and DROP NEWS
  let dragging = null, ghost = null, isDragging = false;
  let offsetY = 0, offsetX = 0;

  $('.drag-handle').on('mousedown', function(e) {
    e.preventDefault();
    dragging = $(this).closest('.news');
    const offset = dragging.offset();
    offsetY = e.clientY - offset.top;
    offsetX = e.clientX - offset.left;
    ghost = dragging.clone()
      .addClass('ghost')
      .css({
        position: 'absolute',
        top: offset.top,
        left: offset.left,
        width: dragging.outerWidth(),
        opacity: 0.7,
        pointerEvents: 'none',
        transform: 'scale(1.02)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: 1000
      })
      .appendTo('body');
    isDragging = true;
  });

  $(document).on('mousemove', function(e) {
    if (!isDragging || !ghost) return;

    ghost.css({
      top: e.clientY - offsetY,
      left: e.clientX - offsetX
    });

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const $target = $(elemBelow).closest('.news');

    $('.news').removeClass('hover-target');
    if ($target.length && !$target.is(dragging)) {
      $target.addClass('hover-target');
    }
  });

  $(document).on('mouseup', function(e) {
    if (!isDragging || !dragging) return;

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const $target = $(elemBelow).closest('.news');

    if ($target.length && !$target.is(dragging)) {
      const $dragNext = dragging.next();
      const $targetNext = $target.next();

      if ($dragNext.is($target)) {
        $target.after(dragging);
      } else if ($targetNext.is(dragging)) {
        dragging.after($target);
      } else {
        $target.after(dragging);
        if ($dragNext.length) $dragNext.before($target);
        else $('.sidebar').append($target);
      }
    }

    ghost.remove();
    ghost = null;
    dragging = null;
    isDragging = false;
    $('.news').removeClass('hover-target');
  });

  // BOX ITEMS 
  const initialItems = [
    { emoji: '🐁', name: 'Mouse' },
    { emoji: '🐃', name: 'Buffalo' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐈', name: 'Cat' },
    { emoji: '🐉', name: 'Dragon' },
    { emoji: '🐍', name: 'Snake' },
    { emoji: '🐎', name: 'Horse' },
    { emoji: '🐐', name: 'Goat' },
    { emoji: '🐒', name: 'Monkey' },
    { emoji: '🐔', name: 'Rooster' },
    { emoji: '🐕', name: 'Dog' },
    { emoji: '🐖', name: 'Pig' }
  ];

  const $grid = $('.box-items');

  function createItem(item) {
    return $(`
      <div class="item">
        <div class="emoji-box">${item.emoji}</div>
        <div class="name">${item.name}</div>
      </div>
    `);
  }
  initialItems.forEach(it => $grid.append(createItem(it)));
  // add new item
  $('.add-button').click(function() {
    const $selected = $('.chosen-item option:selected');
    const emoji = $selected.val();
    const name = $selected.attr('name');
    $grid.append(createItem({ emoji, name }));
  });

  // DRAG and DROP BOX ITEMS
$(function() {
  let $dragging = null;
  let $placeholder = $('<div class="placeholder"></div>');
  let startIndex = null;
  let isDragging = false;
  const $grid = $('.box-items');

  $grid.on('mousedown', '.item', function(e) {
    e.preventDefault();
    $dragging = $(this);
    startIndex = $dragging.index();
    isDragging = true;

    $placeholder = $('<div class="placeholder"></div>');
    $dragging.after($placeholder);
    $dragging.css({
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
      width: $dragging.outerWidth(),
    });
  });

  
});

});
