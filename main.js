$(document).ready(function() {
// Menu 
  $("#menuFooter").html($("#menuHeader").html());

  function setActive(index) {
    $("#menuHeader div, #menuFooter div").removeClass("active");
    $("#menuHeader div").eq(index).addClass("active");
    $("#menuFooter div").eq(index).addClass("active");
  }

  $("#menuHeader, #menuFooter").on("click", "div", function() {
    const index = $(this).index();
    setActive(index);
  });

  // ===========================
  //  NEWS COLLAPSE
  // ===========================
  $('.news h2').click(function() {
    const parent = $(this).parent('.news');
    parent.toggleClass('open');
    parent.find('p').slideToggle(200);
  });

  // ===========================
  //  DRAG and DROP NEWS (sidebar)
  // ===========================
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

  //  BOX ITEMS
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

  $('.add-button').click(function() {
    const $selected = $('.chosen-item option:selected');
    const emoji = $selected.val();
    const name = $selected.text(); 
    $grid.append(createItem({ emoji, name }));
  });

  //  DRAG & DROP ITEMS 
  let $draggingItem = null;
  let $placeholder = $('<div class="placeholder"></div>');
  let isDraggingItem = false;

  $grid.on('mousedown', '.item', function(e) {
    e.preventDefault();
    $draggingItem = $(this);
    isDraggingItem = true;

    $placeholder = $('<div class="placeholder"></div>');

    $draggingItem.after($placeholder);
    $draggingItem.css({
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
      width: $draggingItem.outerWidth(),
    });
  });
  $(document).on('mousemove', function(e) {
    if (!isDraggingItem || !$draggingItem) return;

    $draggingItem.css({
      top: e.pageY - $draggingItem.outerHeight() / 2,
      left: e.pageX - $draggingItem.outerWidth() / 2,
    });

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const $target = $(elemBelow).closest('.item');

    if ($target.length && !$target.is($draggingItem)) {
      if ($target.index() > $placeholder.index()) {
        $target.after($placeholder);
      } else {
        $target.before($placeholder);
      }
    }
  });
  $(document).on('mouseup', function() {
    if (!isDraggingItem || !$draggingItem) return;

    $draggingItem.removeAttr('style');
    $placeholder.replaceWith($draggingItem);

    $draggingItem = null;
    isDraggingItem = false;
  });

// process text layout settings
  $('#toggleFormat').on('click', function() {
    $(this).closest('.settings').find('.format-settings').slideToggle(200);
  });

//color text sample 
  $('#text-color').on('input', function() {
    const colortext = $(this).val();
    $('.result-settings').css('color', colortext );
  });

// sample text highlight
function highlightSampletext() {
  const isBold = $('#ckb-bold').is(':checked');
  const isItalic = $('#ckb-italic').is(':checked');
  const isUnderline = $('#ckb-underline').is(':checked');
  const bgColor = $('#bg-color').val();

  $('.result-settings').css({
    'font-weight': isBold ? 'bold' : 'normal',
    'font-style': isItalic ? 'italic' : 'normal',
    'text-decoration': isUnderline ? 'underline' : 'none',
    'background-color': bgColor
  });
  $('.color-sample').css('background-color', bgColor);
}
$('#ckb-bold, #ckb-italic, #ckb-underline, #bg-color').on('change input', highlightSampletext);

// Highlight text
$('.button:contains("Highlight")').on('click', function() {
  const pattern = $('.input-text').val();
  if(!pattern) return;
  const isBold = $('#ckb-bold').is(':checked');
  const isItalic = $('#ckb-italic').is(':checked');
  const isUnderline = $('#ckb-underline').is(':checked');
  const bgColor = $('#bg-color').val();
  const textcolor = $('#text-color').val();
  const $output = $('.output-area');


  let highlightstyle = "";
  if(isBold) highlightstyle += "font-weight:bold;";
  if(isItalic) highlightstyle += "font-style:italic;";
  if(isUnderline) highlightstyle += "text-decoration:underline;";
  if(textcolor) highlightstyle += `color:${textcolor};`;
  if(bgColor) highlightstyle += `background-color:${bgColor};`;

  const safePattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safePattern})`, 'gi');
  
  const original = $output.text();
  const highlighted = original.replace(regex, `<span style="${highlightstyle}">$1</span>`);
  $output.html(highlighted);
});

});