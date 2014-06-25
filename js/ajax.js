function wordCheck( str, callback ){
    var ajax=new XMLHttpRequest();
    ajax.onreadystatechange=function(){
	if (ajax.readyState==4 && ajax.status==200){
	    callback(ajax.responseText);
	}
    }
    ajax.open("GET","wordCheck.php?str="+str,true);
    ajax.send();
}
