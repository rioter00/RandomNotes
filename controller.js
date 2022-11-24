$(function () {
  console.log("controller loaded");
  document.querySelector("#load").onclick = reloadSketch;
});


reloadSketch = () => {  
  let inputVal = document.querySelector("#notesInput");
  let upperBounds = document.querySelector("#notesUpperBounds");
  let lowerBounds = document.querySelector("#notesLowerBounds");
  let showStems = document.querySelector("#showStems");
  
  console.log("lowerb", isNaN(parseInt(lowerBounds.value)));
  
  console.log("upper", upperBounds.value);
  
  if (inputVal.value === undefined || isNaN(parseInt(inputVal.value))) {
    inputVal.value = parseInt(inputVal.placeholder);
  }
  
  
  if (lowerBounds.value === undefined || isNaN(parseInt(lowerBounds.value))  ) {
    lowerBounds.value = lowerBounds.placeholder;
  }
  
  
  if (upperBounds.value === undefined || isNaN(upperBounds.value)){
    console.log('upper nan');
    console.log(upperBounds.placeholder);
    upperBounds = parseInt(upperBounds.placeholder);
    console.log(upperBounds.value);
  }
  
  inputVal.value = clamp(inputVal.value, 1, 6);
  
  upperBounds.value = clamp(upperBounds.value, 1, 24);
  
  lowerBounds.value = clamp(lowerBounds.value, 0, 24); 
  
  
  
  
  if(parseInt(lowerBounds.value) > parseInt(upperBounds.value)){
    console.log("will sort bounds");
    let tempVal = upperBounds.value;
    upperBounds.value = lowerBounds.value;
    lowerBounds.value = tempVal;
  }
  
  if(lowerBounds.value == upperBounds.value){
    if(upperBounds.value == 24){
      lowerBounds.value--;
    } else if( lowerBounds.value == 0){
      upperBounds.value ++;
    } else {
      lowerBounds.value--;
    }
  }

  notesUpperBound = parseInt(upperBounds.value);
  notesLowerBound = parseInt(lowerBounds.value);
  numNotes = parseInt(inputVal.value);
  showNoteStems = showStems.checked;
  setup();
  
};

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


