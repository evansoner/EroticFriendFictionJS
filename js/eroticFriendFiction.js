google.load('search', '1');

var imageSearch;

function searchComplete() {
    // Check that we got results
    if (imageSearch.results && imageSearch.results.length > 0) {
	// Grab our content div, clear it.
	var contentDiv = document.getElementById('content');
	contentDiv.innerHTML = '';

	// Loop through our results, printing them to the page.
	var results = imageSearch.results;
	for (var i = 0; i < results.length; i++) {
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
}

//Process a google search for str search string.
//searchComplete is called on completion.
function processSearch(str) {
    imageSearch = new google.search.ImageSearch();
    imageSearch.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE,
                               google.search.ImageSearch.IMAGESIZE_MEDIUM);
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    imageSearch.execute(str);
}



function readEmotionsWordList(file_name){
    tempFile = readFile(file_name, 'r').split('\n')
    binary_log_emotion_probs = {}

    try:
        for index in range(1, len(tempFile)): # skip header line, start at index 1
            tokens = tempFile[index].split(',')
            binary_log_emotion_probs[tokens[0]] = float(tokens[3])      # the csv has 4 columns, emotion is last column
    except:
        print "[readEmotionsWordList] Fail at Line: " + str(index) + ": " + sys.exc_info()[0]
        exit()

    return binary_log_emotion_probs
}

// ===========================[ Classify Word Array, Return Emotion Associated (Happy || Sad || Neutral) ]===========================

function classifySentiment( words, binary_log_emotion_probs ){
    binary_emotion_probs = [binary_log_emotion_probs[word] for word in words if word in binary_log_emotion_probs];

    if len(binary_emotion_probs) > 0:
        flag = EMOTION_HAPPY;
        for x in range(0,len(binary_emotion_probs)):
            if binary_emotion_probs[x] == -1:
                flag = flag*(-1)
                output = 'Analyse:\tSad:\t' + words[x]
            else:
                output = 'Analyse:\tHappy:\t' + words[x]

    else:
        flag = EMOTION_NEUTRAL;

    if flag == EMOTION_NEUTRAL:
        output = 'End Emotion:\tNeutral'
    elif flag == EMOTION_HAPPY:
        output = 'End Emotion:\tHappy'
    else:
        output = 'End Emotion:\tSad'

    return flag
}

// ===========================[ Regex on Story ]===========================

function splitStoryIntoArray(aStory){
    story = aStory.split(".");
    return story;
}

// ===========================[ Parse Text ]===========================

function parseText(story){

    var EMOTION_NEUTRAL = 0;
    var EMOTION_HAPPY = 1;
    var EMOTION_SAD = -1;

    //print "\n" + story
    story = splitStoryIntoArray(story);

    //print "Debug: " + str(len(verbs))
    //for tmp in verbs:
    //print "Verb: "+tmp
    
    for(var i=0;i<story.length;i++){
	var sentence = story[i];
	var word_list = sentence.split(" ");
    }
}
