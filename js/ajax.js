function wordCheck( str ){
    var ajax=new XMLHttpRequest();
    ajax.onreadystatechange=function(){
	if (ajax.readyState==4 && ajax.status==200){
	    //TODO: callback
	}
    }
    ajax.open("GET","wordCheck.php?str='"+str+"'",true);
    ajax.send();
}
