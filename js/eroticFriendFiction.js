var imageSearch;
var googleReady = true;
var activeCaption = "";

var counter = 0; // to keep track of current slide
var items = []; //array of slides
var numItems = 0; //number of slides
var activeSlide = null;

function OnLoad() {
    // Include the required Google branding
    google.search.Search.getBranding('branding');
}
google.setOnLoadCallback(OnLoad);
google.load('search', '1');

//This function is called when a google image search is complete.
//It adds the result image to the slideshow.
function searchComplete() {
    // Check that we got results
    if (imageSearch.results && imageSearch.results.length > 0) {

	var result = imageSearch.results[0];
	var newImg = document.createElement('img');
	newImg.src = result.url;
	newImg.style.width = '500px';
	
	var imgContainer = document.createElement('figure');
	imgContainer.className = "show";
	imgContainer.appendChild(newImg);

	var imgCaption = document.createElement('figcaption');
	imgCaption.innerHTML = activeCaption;

	var newDiv = document.createElement('div');
	newDiv.appendChild(imgCaption);
	newDiv.appendChild(imgContainer);

	items.push(newDiv);

	updateItemList();
    }
    //clear busy flag
    googleReady = true;
}

//Process a google search for str search string.
//searchComplete is called on completion.
function processSearch(str, caption) {
    if(!googleReady){
	setTimeout(function(){
	    processSearch(str, caption);
	},100);
    }
    else{
	googleReady = false;	
	activeCaption = caption;
	console.log("search: " + str);
	imageSearch = new google.search.ImageSearch();
	//IMAGESIZE_SMALL IMAGESIZE_MEDIUM IMAGESIZE_LARGE IMAGESIZE_EXTRA_LARGE
	imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch.IMAGESIZE_MEDIUM);
	imageSearch.setSearchCompleteCallback(this, searchComplete, null);
	imageSearch.setResultSetSize(1);
	imageSearch.execute(str);
    }
}

// ===========================[ Parse Text ]===========================

function process(){
    var str = document.getElementById("input").value;
    parseText(str);
}

function parseText(str){

    var sentences = [];
    
    var story = str.replace("\n", " ");
    story = story.replace(/['"]+/g, '');
    story = story.trim();
    var parts = story.split(/[.,]+/);
    for( var i=0;i<parts.length;i++ ) {
	var sentence = parts[i];
	sentence = sentence.trim();
	sentences.push( sentence );
    }
    
    //encode string to send to server
    var send = "";
    for( var i=0;i<sentences.length;i++ ) {
	send += sentences[i];
	send += ",";
    }
    //send word check to server
    wordCheck(send, function(response){
	//clear slideshow
	items = [];
	//process response from server
	console.log("php: "+response);
	var rsp_sentences = response.split(/[,]+/);
	for( var j=0;j<rsp_sentences.length;j++){
	    var searchString = "";
	    var caption = "";
	    var rsp_words = rsp_sentences[j].split(/[.]+/);
	    for(var k=0;k<rsp_words.length;k++){
		var rsp_word = rsp_words[k];
		var isStopWord = rsp_word.charAt(0);
		var isVerb = rsp_word.charAt(1);
		if(isStopWord == '0') //get rid of stopwords
		    searchString += rsp_word.substring(2);
		caption += rsp_word.substring(2)+" ";
	    }
	    //get goole search images	
	    if(searchString != "")
		processSearch( searchString, caption );
	}
    });
}

/////////////
//Slideshow
/////////////

function showCurrent(){
    var itemToShow = Math.abs(counter%numItems);
    var parentNode = document.getElementById('slides');
    if(activeSlide)
	parentNode.removeChild( activeSlide );
    activeSlide = items[itemToShow];
    if(activeSlide)
	parentNode.appendChild( activeSlide );
};

function updateItemList(){
    numItems = items.length;
    console.log("nb slides: "+ numItems);
    if( numItems < 2 ){ //only on first few slides
	counter = 0;
	showCurrent();
    }
}

//setup Slide Show Buttons
var contentDiv = document.getElementById('content');
contentDiv.querySelector('.next').addEventListener('click', function() {
    counter++;
    showCurrent();
}, false);

contentDiv.querySelector('.prev').addEventListener('click', function() {
    counter--;
    showCurrent();
}, false);
