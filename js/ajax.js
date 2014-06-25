function wordCheck( str, callback ){
    var ajax=new XMLHttpRequest();
    ajax.onreadystatechange=function(){
	if (ajax.readyState==4 && ajax.status==200){
	    callback(ajax.responseText);
	}
    }
    ajax.open("POST","wordCheck.php",true);
    ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajax.send("str="+str);
    ajax.send();
}
