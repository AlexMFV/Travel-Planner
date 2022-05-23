$(function () {
  //Load all the elements that are common to all pages
    var includes = $('[data-include]')
    $.each(includes, function () {
      var file = $(this).data('include') + '.html'
      $(this).load(file)
    })

    //Set the active page
    //$('#navbar-nav li').removeClass('active');
    //$('#navbar-nav li').addClass('active');
  })