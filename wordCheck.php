<?php 

$stopWords = file('stopwords.txt', FILE_IGNORE_NEW_LINES); //array of words
$verbs = file('verbs.txt', FILE_IGNORE_NEW_LINES); //array of verbs

$str = $_POST["str"];
$response = "";
$sentences = explode(",", $str);
foreach( $sentences as &$sentence ){
  $words = explode(" ", $sentence);
  foreach( $words as &$word ){

    //paramters of the word
    $isStopWord = 0;
    $isVerb = 0;
    if( in_array($word, $stopWords) )
      $isStopWord = 1;
    if( in_array($word, $verbs) )
      $isVerb = 1;

    //encode parameters into string
    $response = $response.$isStopWord.$isVerb.$word.".";

  }
  $response = substr($response, 0, -1);  
  $response = $response.",";

}

$response = substr($response, 0, -1);  
echo $response;

?>
