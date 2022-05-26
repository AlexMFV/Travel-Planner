window.addEventListener('DOMContentLoaded', loadIncludes);

function loadIncludes(){
  loadName();
  loadUsername(); 
}

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

function loadName() {
  const elemName = document.getElementById("tvl_name");

  if (elemName != null)
    elemName.innerHTML = getName();
}

function loadUsername(){
  const elemUsername = document.getElementById("tvl_username");

  if (elemUsername != null)
    elemUsername.innerHTML = getName();
}

function loadThings(){
  loadName();
  loadUsername();
}