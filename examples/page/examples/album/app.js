const images = Array.from({ length: 32 }, (_, i) => `https://picsum.photos/200/300?random=${i + 1}`);


var perPage = 6
  , prev = document.querySelector('#prev')
  , next = document.querySelector('#next');

page('/', '/photos/0');
page('/photos/:page', photos)
page('*', notfound);
page();

function photos(ctx) {
  var page = ~~ctx.params.page; // :page parametresini alıyor
  var from = page * perPage;
  var to = from + perPage;
  console.log('showing page %s : %s..%s', from, to);
  console.log({page})
  var photos = images.slice(from, to);

  var prev = true;
  var next = true;
  if (to > images.length) {
    next = false;
  }
  if (page == 0) {
    prev = false;
  }

  display(photos);
  adjustPager(prev, next, page);
}

function notfound() {
  document.querySelector('p')
    .textContent = 'not found';
}

function display(photos) {
  var el = document.querySelector('#photos');
  el.innerHTML = '';
  photos.forEach(function(photo){
    var img = document.createElement('img');
    img.src = photo;
    el.appendChild(img);
  });
}

function adjustPager(prev, next, page) {
  if (prev) {
    document.querySelector("#prev").style.display = 'inline-block';
    document.querySelector("#prev").setAttribute('href', 'photos/' + (page - 1));
  }
  else {
    document.querySelector("#prev").style.display = 'none';
  }

  if (next) {
    document.querySelector("#next").setAttribute('href', 'photos/' + (page + 1));
  }
  else {
    document.querySelector("#next").style.display = 'none';
  }
}

