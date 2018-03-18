function toggleMenuDisplay(){
   var stateOn = "inline-block";
   var stateOff = "none";
   var stateTo = "";
   var menuDisplay = document.getElementById("menu").style.display; 
   if (menuDisplay === stateOn){
       stateTo = stateOff;
   }else{
       stateTo = stateOn;
   }
   document.getElementById("menu").style.display = stateTo;
}

