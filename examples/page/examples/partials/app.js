  var cache = {};

  function get (url, cb) {
    if (cache[url]) return cb(cache[url]);
    $.ajax({
      url: url,
      success: function(data) {
        cache[url] = data;
        cb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      },
      dataType: 'text'
    });
  }

  // public api

  window.init = {
    ctx: function (ctx, next) {
      ctx.data = {};
      ctx.partials = {};
      next();
    }
  };

  window.route = {
    home: function (ctx, next) {
      get('views/home.html', function (html) {
        ctx.data.index = 0;
        ctx.partials.content = html;
        next();
      });
    },
    portfolio: function (ctx, next) {
      get('views/portfolio.html', function (html) {
        ctx.data.index = 1;
        ctx.partials.content = html;
        next();
      });
    },
    about: function (ctx, next) {
      get('views/about.html', function (html) {
        ctx.data.index = 2;
        ctx.partials.content = html;
        next();
      });
    },
    test: function (ctx, next) {
      window.location.href = './test';
    },
    examples: function (ctx, next) {
      window.location.href = '../';
    }
  };

  window.render = {
    content: function (ctx, next) {
      get('views/content.html', function (html) {
        var template = Hogan.compile(html),
          content = template.render(ctx.data, ctx.partials);
        //
        $('#content').empty().append(content);
        changeActive(ctx.data.index);
        if (typeof done === 'function') done(ctx.data.index);
      });
    }
  };

  window.done = null;

  var navLinks = $('#navigation li');

  $('#navigation a').on('click', function (e) {	
    changeActive(navLinks.index(this));
  });

  window.changeActive = function (index) {
    navLinks.removeClass('active').eq(index).addClass('active');
  }  


// page.base(location.pathname.replace('/partials/', ''));
page('*', init.ctx);
page('/home', route.home);
page('/', "/home");
page('/portfolio', route.portfolio);
page('/about', route.about);
page('/test', route.test);
page('/examples', route.examples);
page('*', render.content);
page();
