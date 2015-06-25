var db;
var dbCreated = false;
//var soundStatus = "off";
//var autoRotationStatus = "off";
var shapeStatus = 1;
var levelStatus = 1;
var mediaFlag = "true";
var shapeId="";
var imageId="";
var levelId="";
var my_media = null;
var play_image;
var tool_flag= "true";
var pictureSource;
var destinationType;
var change_image_flag = "false";
//window.localStorage.setItem("soundStatus","off");
//window.localStorage.setItem("autoRotationStatus","off");
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("resume", onResume, false);
document.addEventListener("backbutton", onBackKeyDown, false);
document.addEventListener("pause", onPause, false);
document.addEventListener("touchstart", function(){}, true);
/*window.addEventListener('orientationchange', doOnOrientationChange);

function doOnOrientationChange()
{
    switch(window.orientation)
    {
        case -90:
        case 90:
            
            location.reload();
            
            break;
        default:
            
            location.reload();
            break; 
    }
}*/

$(window).on("orientationchange",function(){
             
             if(window.orientation == 0) // Portrait
             {
            // alert("PotOrientation is: " + window.orientation);
            // window.location.reload();
            //window.location.href=window.location.href;
             // window.location = location.href;
             //$("#canvas-wrap").load(location.href + " #canvas-wrap");
             }
             else // Landscape
             {
             //alert("Orientation is: " + window.orientation);
             //window.location.reload();
             //window.location.href=window.location.href;
              //window.location = location.href;
             //$("#canvas-wrap").load(location.href + " #canvas-wrap");
             }
             });

// Handle the back button Android
function onBackKeyDown(e) {
    e.preventDefault();
    var r = confirm("Are you sure you want to exit");
    if (r == true) {
        window.localStorage.clear();
        stopAudio();
        navigator.app.exitApp();
    }
    else {
        return;
    }
}

function onPause() {
    if(window.localStorage["soundStatus"] =="on"){
        $('#settingsSound img').attr('src','images/soundOn.png');
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
}

// Handle the resume event
function onResume() {
    if(window.localStorage["soundStatus"] =="on"){
        $('#settingsSound img').attr('src','images/soundOn.png');
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
    else{
        $('#settingsSound img').attr('src','images/soundOff.png');
        window.localStorage.setItem("soundStatus","on");
        playAudio("audio/music.mp3");
    }
}

//-----------------------------------------------------------------------------------
// Start page selection
//-----------------------------------------------------------------------------------
$(document).ready( function(){
                  
   /* $('.hover').bind('touchstart touchend', function(e) {
        e.preventDefault();
        $(this).toggleClass('hover_effect');
    });*/
                  
    /* slider 1 swipe */
    var theSliderElement = document.getElementById("slider");
    theSliderElement.addEventListener("touchmove", handleTouchMoveslider, false);
    theSliderElement.addEventListener('touchstart', handleTouchStartslider, false);
    var xDown = null;
    var yDown = null;
    function handleTouchStartslider(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };
    function handleTouchMoveslider(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
            moveRight_first();
            } else {
            moveLeft_first();
            }
        }
        xDown = null;
        yDown = null;
    };

    /* slider 2 swipe */
    var theSlider2Element = document.getElementById("slider2");
    theSlider2Element.addEventListener("touchmove", handleTouchMoveSlider2, false);
    theSlider2Element.addEventListener('touchstart', handleTouchStartSlider2, false);
    var xDown = null;
    var yDown = null;
    function handleTouchStartSlider2(evt) {
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;
    };
    function handleTouchMoveSlider2(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
        moveRight_second();
        } else {
        moveLeft_second();
        }
        }
        xDown = null;
        yDown = null;
    };

    /* slider 3 swipe */

    var theSlider3Element = document.getElementById("slider3");
    theSlider3Element.addEventListener("touchmove", handleTouchMoveSlider3, false);
    theSlider3Element.addEventListener('touchstart', handleTouchStartSlider3, false);
    var xDown = null;                                                        
    var yDown = null;
    function handleTouchStartSlider3(evt) {                                         
        xDown = evt.touches[0].clientX;
        yDown = evt.touches[0].clientY;                                      
    };
    function handleTouchMoveSlider3(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
        moveRight_third();
        } else {
        moveLeft_third();
        }                       
        }
        xDown = null;
        yDown = null;                                             
    };
                  
    $('#play a').click( function(e){
                       e.preventDefault();
                       $(this).parent().toggleClass("animated pulse");
           window.localStorage.setItem("page_location","3");
        $('.homePage').hide();
        $('.imgSelectPage').show();
    });
                  

    $('ul[id*=shapes] li').click(function (e) {
                                 e.preventDefault();
                                 $(this).children().toggleClass("animatedTada tada");
                        window.localStorage.setItem("shapeId",$(this).attr('id'));
       //shapeId = $(this).attr('id');
        $('.homePage').hide();
        $('.chooseShapePage').hide();
                                   window.localStorage.setItem("page_location","5");
        db.transaction(getImagesFromId, transaction_error);
        $('.gamePage').show();
    });

    $('.settings').click( function(e){
                         e.preventDefault();
                         $(this).addClass("animatedTada tada");
                         //setTimeout(function(){ alert("Hello"); }, 3000);
                           window.localStorage.setItem("page_location","2");
        $('.homePage').hide();
        settingPageShow();
    });
                  
    $('#settingsSound').click( function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
        if(window.localStorage["soundStatus"] =="on"){
            $('#settingsSound img').attr('src','images/soundOn.png');
            window.localStorage.setItem("soundStatus","off");
            stopAudio();
        }
        else{
            $('#settingsSound img').attr('src','images/soundOff.png');
            window.localStorage.setItem("soundStatus","on");
            playAudio("audio/music.mp3");
           // playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
        }
    });

    $('#settingsRotation').click( function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
                                   window.localStorage.setItem("setting_page_change","true");
        if(window.localStorage["autoRotationStatus"] =="off"){
            $('#settingsRotation img').attr('src','images/autoRotateOn.png');
            window.localStorage.setItem("autoRotationStatus","on");
        }
        else{
            $('#settingsRotation img').attr('src','images/autoRotateOff.png');
            window.localStorage.setItem("autoRotationStatus","off");
        }
                                   // window.localStorage.setItem("autoRotationStatus",autoRotationStatus);
    });

    $('#settingsShape').click( function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
                                window.localStorage.setItem("setting_page_change","true");
        if(shapeStatus == 6)
        shapeStatus =1;
        else
        shapeStatus++;
        switch(shapeStatus)
        {
        case 1 :$('#settingsShape img').attr('src','images/shape1.png');
            shapeId = shapeStatus;
            break;
        case 2 :$('#settingsShape img').attr('src','images/shape2.png');;
            shapeId = shapeStatus;
            break;
        case 3 :$('#settingsShape img').attr('src','images/shape3.png');
            shapeId = shapeStatus;
            break;
        case 4 :$('#settingsShape img').attr('src','images/shape4.png');
            shapeId = shapeStatus;
            break;
        case 5 :$('#settingsShape img').attr('src','images/shape5.png');;
            shapeId = shapeStatus;
            break;
        case 6 :$('#settingsShape img').attr('src','images/shape6.png');
            shapeId = shapeStatus;
            break;
        default:$('#settingsShape img').attr('src','images/shape1.png');
            shapeId = 1;
        };
         window.localStorage.setItem("shapeId",shapeId);
       // alert("shapeStatus : "+shapeStatus+"shapeId : "+shapeId);
    });

    $('#settingsLevel').click( function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
                                window.localStorage.setItem("setting_page_change","true");
        if(levelStatus == 3)
            levelStatus =1;
        else
            levelStatus++;
        switch(levelStatus)
        {
        case 1 :$('#settingsLevel img').attr('src','images/easy.png');
                levelId = levelStatus;
                break;
        case 2 :$('#settingsLevel img').attr('src','images/medium.png');;
                levelId = levelStatus;
                break;
        case 3 :$('#settingsLevel img').attr('src','images/hard.png');
                levelId = levelStatus;
                break;
        default:$('#settingsLevel img').attr('src','images/easy.png');
                levelId = 1;
        };
                              window.localStorage.setItem("levelId",levelId);
    });

    $('.proVersion').click( function(e){
                           e.preventDefault();
                           $(this).toggleClass("animatedTada tada");
        $('.proVersionPopUp').show();
        $('.popUpCov').show();
    });
          
    $('#playWithCode').click( function(){
       alert("#playWithCode")
    });

    $('.goPlayPage').click( function(){
        $('.loginPage, .registerPage').hide();
                             window.localStorage.setItem("page_location","3");
        $('.imgSelectPage').show();
    });
                  
    $('.goRegisterPage').click( function(){
        $('.imgSelectPage, .loginPage').hide();
        $('.registerPage').show();
    });

    $('.chooseShape').click( function(){
        $('.imgSelectPage, .loginPage, .registerPage').hide();
                              window.localStorage.setItem("page_location","4");
        $('.chooseShapePage').show();
    });

    $('.goSettingsPage').click( function(){
        //$('.imgSelectPage, .loginPage, .registerPage').hide();
        $('.homePage').hide();
                                 window.localStorage.setItem("page_location","2");
        settingPageShow();
    });

    $('.playGame').click( function(){
        $('.loginPage, .registerPage, .settingsPage,.imgSelectPage').hide();
       
                         var currentIds = window.localStorage["play_image"];
                         if ((currentIds === undefined) ||
                             (currentIds == null))
                                {
                           window.localStorage.setItem("page_location","3");
                         $('.imgSelectPage').show()
                         }
                         else{
                       //  play_image = window.localStorage["play_image"];
                             if(window.localStorage["setting_page_change"] == "true")
                             {
                             location.reload();
                             }
                             else
                             {
                             $('.gamePage').show();
                             }
                         }
    });
                  
    $('.killMe').click( function(){
        $('.popUpCov').hide();
    });

    $('.navImageBackButton').click( function(){
        $('.imgSelectPage').hide();
                                   window.localStorage.setItem("page_location","1");
                                   //$('.play').addClass("animated");
                                  //$('.play').addClass("pulse");
        $('.homePage').show();
    });

    $('.navShapeBackButton').click( function(){
        $('.chooseShapePage').hide();
                                   window.localStorage.setItem("page_location","3");
        $('.imgSelectPage').show();
    });

    $('.navSettingsBackButton').click( function(){
        $('.settingsPage').hide();
                                      //$('.play').addClass("animated");
                                     // $('.play').addClass("pulse");
                                      window.localStorage.setItem("page_location","1");
        $('.homePage').show();
    });

    $('.navPlayBackButton').click( function(e){
        $('.gamePage').hide();
                                   window.localStorage.setItem("page_location","4");
        $('.chooseShapePage').show();
    });
                  
    $('#change_image').click(function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
        window.localStorage.setItem("change_image_flag","true");
        //alert("#change_image click " + window.localStorage["change_image_flag"]);
        $('.gamePage').hide();
        $('.imgSelectPage').show();
    });
      
    $('#change_settings').click( function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
        $('.gamePage').hide();
                                window.localStorage.setItem("game_to_setting_page","true");
                                window.localStorage.setItem("page_location","2");
        settingPageShow();
    });
    
   $('#show_preview').click(function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
        $('#image-preview').toggleClass("show");
   //canvas.style.marginLeft = -(canvas.width / 2) + "px"
   // canvas.style.marginTop = (canvas.width / 4) + "px"
   });
                  
   $('#auto_solve').click(function(e){
        e.preventDefault();
        $(this).toggleClass("animatedTada tada");
    });
                  
    $('#popupPlay').click( function(e){
        window.localStorage.setItem("change_image_flag","true");
        $('.popUpCov').hide();
        $('.gamePage').hide();
                           window.localStorage.setItem("page_location","3");
        $('.imgSelectPage').show();
    });
                  
    $('#popupPro').click( function(){
        alert("Currently Redirecting to Home Screen Update on Second Phase");
        window.localStorage.setItem("change_image_flag","true");
        $('.popUpCov').hide();
        $('.gamePage').hide();
        $('.homePage').show();
    });
            
                  

//-----------------------------------------------------------------------------------
// End page selection
// Start slider
//-----------------------------------------------------------------------------------
    var slideCount = $('#slider ul li, #slider2 ul li, #slider3 ul li').length;
    var slideWidth = $('#slider ul li, #slider2 ul li, #slider3 ul li').width();
    var slideHeight = $('#slider ul li, #slider2 ul li, #slider3 ul li').height();
    var sliderUlWidth = slideCount * slideWidth;

    $('#slider ul, #slider2 ul,#slider3 ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
    $('#slider, #slider2, #slider3').css({ width: slideWidth, height: slideHeight });
  //  $('#slider ul li:last-child, #slider2 ul li:last-child, #slider3 ul li:last-child').prependTo('#slider ul, #slider2 ul, #slider3 ul');

    function moveLeft_first() {
    $('#slider ul').animate({
    left: + slideWidth
    }, 200, function () {
    $('#slider ul li:last-child').prependTo('#slider ul');
    $('#slider ul').css('left', '');
    });
    };

    function moveLeft_second() {
    $('#slider2 ul').animate({
    left: + slideWidth
    }, 200, function () {
    $(' #slider2 ul li:last-child').prependTo('#slider2 ul');
    $(' #slider2 ul').css('left', '');
    });
    };

    function moveLeft_third() {
    $('#slider3 ul').animate({
    left: + slideWidth
    }, 200, function () {
    $(' #slider3 ul li:last-child').prependTo('#slider3 ul');
    $('#slider3 ul').css('left', '');
    });
    };

    function moveRight_first() {
    $('#slider ul').animate({
    left: - slideWidth
    }, 200, function () {
    $('#slider ul li:first-child').appendTo('#slider ul');
    $('#slider ul').css('left', '');
    });
    };

    function moveRight_second() {
    $('#slider2 ul').animate({
    left: - slideWidth
    }, 200, function () {
    $('#slider2 ul li:first-child').appendTo(' #slider2 ul');
    $('#slider2 ul').css('left', '');
    });
    };


    function moveRight_third() {
    $(' #slider3 ul').animate({
    left: - slideWidth
    }, 200, function () {
    $(' #slider3 ul li:first-child').appendTo(' #slider3 ul');
    $('#slider3 ul').css('left', '');
    });
    };

    $('a.control_prev_first').click(function () {
        moveLeft_first();
    });

    $('a.control_prev_second').click(function () {
        moveLeft_second();
    });

    $('a.control_prev_third').click(function () {
        moveLeft_third();
    });

    $('a.control_next_first').click(function () {
        moveRight_first();
    });

    $('a.control_next_second').click(function () {
        moveRight_second();
    });

    $('a.control_next_third').click(function () {
        moveRight_third();
    });
})

//-----------------------------------------------------------------------------------
// End slider
//-----------------------------------------------------------------------------------
function onDeviceReady() {
    //navigator.splashscreen.show();
    
    if(  window.localStorage["change_image_flag"] == "true" )
    {
        play_image = window.localStorage["play_image"];
        shapeId = window.localStorage["shapeId"];
        //alert("Image : " + play_image + "shapeId : " + shapeId);
        window.localStorage.clear();
        window.localStorage.setItem("change_image_flag","false");
        $('.homePage').hide();
        window.localStorage.setItem("page_location","5");
        $('.gamePage').show();
        playPuzzleGame();
    }
    else if(window.localStorage["setting_page_change"] == "true")
    {
        window.localStorage.setItem("setting_page_change","false");
        play_image = window.localStorage["play_image"];
        shapeId = window.localStorage["shapeId"];
        $('.gamePage').show();
        playPuzzleGame();
    }
    else
    {
        switch(window.localStorage["page_location"])
        {
            case "1":  $('.settingsPage, .imgSelectPage, .chooseShapePage, .gamePage').hide();
                $('.homePage').show();
                break;
                
            case "2":  $('.homePage, .imgSelectPage, .chooseShapePage, .gamePage').hide();
                settingPageShow();
                break;
                
            case "3":  $('.homePage, .settingsPage, .chooseShapePage, .gamePage').hide();
                $('.imgSelectPage').show();
                break;
                
            case "4":  $('.homePage, .settingsPage, .imgSelectPage, .gamePage').hide();
                $('.chooseShapePage').show();
                break;
                
            case "5":  $('.homePage, .settingsPage, .imgSelectPage, .chooseShapePage').hide();
                play_image = window.localStorage["play_image"];
                shapeId = window.localStorage["shapeId"];
                $('.gamePage').show();
                playPuzzleGame();
                break;
                
            default:  $('.gamePage').hide();
                $('.homePage').show();
        }
    }


   if (navigator.splashscreen) {
        console.warn('Hiding splash screen');
        // We're done initializing, remove the splash screen
        setTimeout(function() {
                   navigator.splashscreen.hide();
                   }, 1);
    }

    
    if(window.localStorage["soundStatus"] =="off"){
        $('#settingsSound img').attr('src','images/soundOff.png');
        window.localStorage.setItem("soundStatus","on");
        stopAudio();
    }
    else{
        $('#settingsSound img').attr('src','images/soundOn.png');
        window.localStorage.setItem("soundStatus","off");
        playAudio("audio/music.mp3");
       // playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    }
//----------------------------------------------------------------------------------------------
// Start Database Creation
//----------------------------------------------------------------------------------------------
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
    db = window.openDatabase("PuzzlePicDirectoryDB", "1.0", "Puzzle Pic Images", 200000);
    if (dbCreated){
        db.transaction(getImages, transaction_error);
    }
    else{
        db.transaction(populateDB, transaction_error, populateDB_success);
    }
}

function populateDB(tx) {
    $('#busy').show();
    tx.executeSql('DROP TABLE IF EXISTS imageList');
    var sql = "CREATE TABLE IF NOT EXISTS imageList ( "+"id INTEGER PRIMARY KEY AUTOINCREMENT, "+"server_id INTEGER  ," +"picture VARCHAR(200))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (1,01,'puzzle1.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (2,02,'puzzle2.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (3,03,'puzzle3.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (4,04,'puzzle4.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (5,05,'puzzle5.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (6,06,'puzzle6.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (7,07,'puzzle7.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (8,08,'puzzle8.jpg')");
}

function populateDB_success() {
    dbCreated = true;
    db.transaction(getImages, transaction_error);
}

function transaction_error(tx, error) {
    alert("Database Error: " + error +  "\nCode="+error.code);
}

function getImages(tx) {
    var sql = "select id, server_id, picture from imageList ";
    tx.executeSql(sql, [], getImages_success);
}

function getImagesFromId(tx) {
    var sql = "select picture from imageList where id = "+imageId;
    tx.executeSql(sql, [], getImages_play);
}

function getImages_play(tx, results) {
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var imageListItems = results.rows.item(i);
        window.localStorage.setItem("play_image", imageListItems.picture);
        //window.localStorage.setItem("shapeId",shapeId);
        if(window.localStorage["change_image_flag"] == "true"  || window.localStorage["game_to_setting_page"] == "true")
        {
            window.localStorage.setItem("game_to_setting_page", "false");
            location.reload();
        }
        play_image = imageListItems.picture;
    }
    playPuzzleGame();
}

function getImages_success(tx, results) {
    $('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var imageListItems = results.rows.item(i);
        var newlist='<li><a href="#" onClick="ImageClick(' + imageListItems.server_id + ')"><img src="puzzlepictures/' + imageListItems.picture + '"/> </a></li>';
        $('#galleryAvilabelList').append(newlist);
       // $('#galleryPaidlList').append(newlist);
       // $('#galleryReceivedlList').append(newlist);
    }
}

function ImageClick(id)
{
    imageId = id;
     window.localStorage.setItem("page_location","4");
    $('.imgSelectPage').hide();
    $('.chooseShapePage').show();
}
//-----------------------------------------------------------------------------------------------------------
// End Database Creation
// Satrt Background Music
//-----------------------------------------------------------------------------------------------------------
$('.sound').click( function(){
                  alert("window.localStorage : "+window.localStorage["soundStatus"]);
    if(window.localStorage["soundStatus"] =="on"){
        //document.getElementById("imgSound").src="images/soundOn.png";
        $('#settingsSound img').attr('src','images/soundOn.png');
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }	
    else{
        //document.getElementById("imgSound").src="images/soundOff.png";
        $('#settingsSound img').attr('src','images/soundOff.png');
        window.localStorage.setItem("soundStatus","on");
        playAudio("audio/music.mp3");
        //playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    }
});

function playAudio(src) {
    mediaFlag = "true";
    my_media = new Media(src, onSuccess, onError);
    my_media.play();
}

function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

function stopAudio() {
    mediaFlag = "false";
    if (my_media) {
        my_media.stop();
    }
}

function onSuccess() {
    console.log("playAudio():Audio Success");
    if(mediaFlag == "true"){
       playAudio("audio/music.mp3");
       //playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    }
}

function onError(error) {
    // alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}

//---------------------------------------------------------------------------------------------------------
// End Background Music
// Start Photo from camera /  Gallery
//--------------------------------------------------------------------------------------------------------

function snapPicture () {
    navigator.camera.getPicture (onSuccess, onFail,
                                 { quality: 100,
                                 sourceType: navigator.camera.PictureSourceType.CAMERA,
                                 mediaType: navigator.camera.MediaType.PICTURE,
                                 destinationType: destinationType.FILE_URI,
                                 encodingType: navigator.camera.EncodingType.JPEG,
                                 correctOrientation: false,
                                 saveToPhotoAlbum: true
                                 });
    //A callback function when snapping picture is success.
    function onSuccess (imageData) {
        //var image = $('#picture');
        var image =document.getElementById('picture');
        image.src =  imageData;
        $('#congrat_message').hide();
        $('.proVersionPopUp').hide();
        $('.imgPopUp').show();
        $('.popUpCov').show();
    }
    //A callback function when snapping picture is fail.
    function onFail (message) {
        alert ('Error occured: ' + message);
    }
}

function onPhotoURISuccess(imageURI) {
   // var largeImage = $('#picture');
            var largeImage =document.getElementById('picture');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
    $('#congrat_message').hide();
    $('.proVersionPopUp').hide();
    $('.imgPopUp').show();
    $('.popUpCov').show();
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
                                destinationType: destinationType.FILE_URI,
                                sourceType: source });
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//--------------------------------------------------------------------------------------------------------
// End Photo from camera /  Gallery
//--------------------------------------------------------------------------------------------------------
function playPuzzleGame()
{
    var shapeIdVal=window.localStorage["shapeId"];
    switch (shapeIdVal) {
        case "1":
            (function() {
             var jsaw = new jigsaw.Jigsaw({
                                          defaultImage: "puzzlepictures/" + play_image,
                                          piecesNumberTmpl: "%d",
                                          insideValue:"inside_square",
                                          outsideValue:"outside_square",
                                          rotatePieces: false
                                          });
             }());
            
             break;
        case "2":
            if (window.localStorage["autoRotationStatus"]=="on") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside",
                                              outsideValue:"outside",
                                              rotatePieces: true
                                              });
                 }());
            }
            else{
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside",
                                              outsideValue:"outside",
                                              rotatePieces: false
                                              });
                 }());
            }
            break;
        case "3":
           if (window.localStorage["autoRotationStatus"]=="on") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside",
                                              outsideValue:"outside",
                                              rotatePieces: true
                                              });
                 }());
            }
            else{
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside",
                                              outsideValue:"outside",
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

        case "4":
             if (window.localStorage["autoRotationStatus"]=="on") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside_jigSquare",
                                              outsideValue:"outside_jigSquare",
                                              rotatePieces: true
                                              });
                 }());
            }
            else{
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                             piecesNumberTmpl: "%d",
                                              insideValue:"inside_jigSquare",
                                              outsideValue:"outside_jigSquare",
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

        case "5":
            if (window.localStorage["autoRotationStatus"]=="on") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside_curve",
                                              outsideValue:"outside_curve",
                                              rotatePieces: true
                                              });
                 }());
            }
            else{
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside_curve",
                                              outsideValue:"outside_curve",
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

        case "6":
            if (window.localStorage["autoRotationStatus"]=="on") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside_jigDiamond",
                                              outsideValue:"outside_jigDiamond",
                                              rotatePieces: true
                                              });
                 }());
            }
            else{
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + play_image,
                                              piecesNumberTmpl: "%d",
                                              insideValue:"inside_jigDiamond",
                                              outsideValue:"outside_jigDiamond",
                                              rotatePieces: false
                                              });
                 }());
            }
            break;
       
    }
   }

function settingPageShow()
{
    switch(window.localStorage["shapeId"] )
    {
        case "1" :$('#settingsShape img').attr('src','images/shape1.png');
            break;
        case "2" :$('#settingsShape img').attr('src','images/shape2.png');
            break;
        case "3" :$('#settingsShape img').attr('src','images/shape3.png');
            break;
        case "4" :$('#settingsShape img').attr('src','images/shape4.png');
            break;
        case "5" :$('#settingsShape img').attr('src','images/shape5.png');
            break;
        case "6" :$('#settingsShape img').attr('src','images/shape6.png');
            break;
        default : $('#settingsShape img').attr('src','images/shape2.png');
    };
    
    switch(window.localStorage["levelId"])
    {
        case "1" :$('#settingsLevel img').attr('src','images/easy.png');
            break;
        case "2" :$('#settingsLevel img').attr('src','images/medium.png');
            break;
        case "3" :$('#settingsLevel img').attr('src','images/hard.png');
            break;
        default : $('#settingsLevel img').attr('src','images/easy.png');
    };
    
    if( window.localStorage["autoRotationStatus"] =="off"){
        $('#settingsRotation img').attr('src','images/autoRotateOff.png');
    }
    else{
        $('#settingsRotation img').attr('src','images/autoRotateOn.png');
    }
    
    if(window.localStorage["soundStatus"] =="on"){
        $('#settingsSound img').attr('src','images/soundOn.png');
    }
    else{
        $('#settingsSound img').attr('src','images/soundOff.png');
    }
    
    $('.settingsPage').show();
}



