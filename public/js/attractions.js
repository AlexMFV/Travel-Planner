function loadImageURL(){
    //get url from input
    var url = document.getElementById("imageURL").value;
    //set image source to url
    document.getElementById("attractImage").src = url;
}