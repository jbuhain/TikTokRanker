var arrURL = []; // contains url of vid pair
var arrID = []; // contains IDNum of vid pair
let videoElmts = document.getElementsByClassName("tiktokDiv");
let heartButtons = document.querySelectorAll("div.heart");
let reloadButtons = document.getElementsByClassName("reload");
var nname1 = document.getElementById("nname1");
var nname2 = document.getElementById("nname2");

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
}

// Step 4 Code
// Add event listeners for each heart buttons
document.getElementById("hbdiv1").addEventListener("click", function() {
  if(document.getElementById("hbdiv1").classList.contains("unloved")){
    // replace class "unloved" with class "liked"
    document.getElementById("hbdiv1").classList.replace("unloved","liked");
    // hide unfilled heart and show filled heart
    document.getElementById("hbi1Unloved").style.display = "none";
    document.getElementById("hbi1Loved").style.display = "inline";
    unlikeb2();
  }
  else if(document.getElementById("hbdiv1").classList.contains("liked")){ 
    // replace class "liked" with class "unloved" 
    document.getElementById("hbdiv1").classList.replace("liked","unloved");
    // show unfilled heart and hide filled heart
    document.getElementById("hbi1Unloved").style.display = "inline";
    document.getElementById("hbi1Loved").style.display = "none";
  }
});
document.getElementById("hbdiv2").addEventListener("click", function() {
  if(document.getElementById("hbdiv2").classList.contains("unloved")){
    document.getElementById("hbdiv2").classList.replace("unloved","liked");
    document.getElementById("hbi2Unloved").style.display = "none";
    document.getElementById("hbi2Loved").style.display = "inline";
    unlikeb1()
  }
  else if(document.getElementById("hbdiv2").classList.contains("liked")){ 
    document.getElementById("hbdiv2").classList.replace("liked","unloved");
    document.getElementById("hbi2Unloved").style.display = "inline";
    document.getElementById("hbi2Loved").style.display = "none";
  }
});

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
"https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];


// console.log(data);

// for (let i=0; i<2; i++) {
//   addVideo(urls[i],videoElmts[i]);
// }
// console.log(arr);
sendGetRequest('getTwoVideos')
.then(function(result){
  
  let nn1 = result[0].nickname;
  let nn2 = result[1].nickname;
  nname1.textContent = nn1;
  nname2.textContent = nn2;
  
  let u1 = result[0].url;
  let u2 = result[1].url;
  let id1 = result[0].rowIdNum;
  let id2 = result[1].rowIdNum;
  arrURL = [u1, u2];
  arrID = [id1, id2];
  for (let i=0; i<2; i++) {
    addVideo(arrURL[i],videoElmts[i]);
  }
  loadTheVideos();
})
// load the videos after the names are pasted in! 
// loadTheVideos();

// Step 4 Code
function unlikeb1() {
  document.getElementById("hbi1Unloved").style.display = "inline";
  document.getElementById("hbi1Loved").style.display = "none";
  if(document.getElementById("hbdiv1").classList.contains("liked")){
    document.getElementById("hbdiv1").classList.replace("liked","unloved");
  }
}
function unlikeb2() {
  document.getElementById("hbi2Unloved").style.display = "inline";
  document.getElementById("hbi2Loved").style.display = "none";
  if(document.getElementById("hbdiv2").classList.contains("liked")) {
    document.getElementById("hbdiv2").classList.replace("liked","unloved");
  }
}

// Step 5 Code
function createSend() {
  let liked1 = 0;
  let liked2 = 0;
    if(document.getElementById("hbdiv1").classList.contains("liked")) {
      liked1 = 1;
    } else if(document.getElementById("hbdiv2").classList.contains("liked")) {
    liked2 = 1;
  }
  let send = {};
  if(liked1 == 1){
    send = {"better":arrID[0], "worse":arrID[1]};
  } else if(liked2 == 1){
    send = {"worse":arrID[0], "better":arrID[1]}
  }
  return send;
}

let nextButton = document.getElementById("nxt");
nextButton.addEventListener("click",function() { // Step 5 Code 
  sendPostRequest('/insertPref', createSend())
  .then(function (data) {
    if(data == "pick winner") {
      window.location = "/winner.html";
    }
    else {
      // console.log(data); // print continue 
      viewNewPair(); // generate new rand pair
      window.location.reload();
    }
  }).catch(function (error) {
    console.error('Error:', error);
  }); });

function viewNewPair () {
  // Step 6: when the response comes back, reload the page to get two new videos.
  sendGetRequest('getTwoVideos')
.then(function(result){
  // update nickname
  let nn1 = result[0].nickname;
  let nn2 = result[1].nickname;
  nname1.textContent = nn1;
  nname2.textContent = nn2;
  // fill in video
  let u1 = result[0].url;
  let u2 = result[1].url;
  let id1 = result[0].rowIdNum;
  let id2 = result[1].rowIdNum;
  arrURL = [u1, u2];
  arrID = [id1, id2];
  for (let i=0; i<2; i++) {
    addVideo(arrURL[i],videoElmts[i]);
  }
  loadTheVideos(); // load the videos after the names are pasted in! 
  
})
}