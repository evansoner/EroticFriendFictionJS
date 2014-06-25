google.load('search', '1');

var imageSearch;
var googleReady = true;

//This function is called when a google image search is complete.
//It adds the result image to the slideshow.
function searchComplete() {
    // Check that we got results
    if (imageSearch.results && imageSearch.results.length > 0) {
	// Grab our content div, clear it.
	var contentDiv = document.getElementById('content');

	// Loop through our results, printing them to the page.
	var results = imageSearch.results;
	for (var i = 0; i < 1; i++) {
	    // For each result write it's title and image to the screen
	    var result = results[i];
	    var imgContainer = document.createElement('div');

	    var title = document.createElement('div');
	    // We use titleNoFormatting so that no HTML tags are left in the title
	    title.innerHTML = result.titleNoFormatting;

	    var newImg = document.createElement('img');
	    // There is also a result.url property which has the escaped version
	    newImg.src = result.tbUrl;

	    imgContainer.appendChild(title);
	    imgContainer.appendChild(newImg);

	    // Put our title + image in the content
	    contentDiv.appendChild(imgContainer);
	}
    }
    googleReady = true;
}

//Process a google search for str search string.
//searchComplete is called on completion.
function processSearch(str) {
    if(!googleReady){
	setTimeout(function(){
	    processSearch(str);
	},100); 
    }
    else{
	googleReady = false;
	console.log("search: " + str);
	imageSearch = new google.search.ImageSearch();
	imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
				   google.search.ImageSearch.IMAGESIZE_MEDIUM);
	imageSearch.setSearchCompleteCallback(this, searchComplete, null);
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
	var contentDiv = document.getElementById('content');
	contentDiv.innerHTML = '';
	//process response from server
	console.log("php: "+response);
	var rsp_sentences = response.split(/[,]+/);
	for( var j=0;j<rsp_sentences.length;j++){
	    var searchString = "";
	    var rsp_words = rsp_sentences[j].split(/[.]+/);
	    for(var k=0;k<rsp_words.length;k++){
		var rsp_word = rsp_words[k];
		var isStopWord = rsp_word.charAt(0);
		var isVerb = rsp_word.charAt(1);
		if(isStopWord == '0') //get rid of stopwords
		    searchString += rsp_word.substring(2);
	    }
	    //get goole search images
	    if(searchString != "")
		processSearch( searchString );
	}
    });
}

