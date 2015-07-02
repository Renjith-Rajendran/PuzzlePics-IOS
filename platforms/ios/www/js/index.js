var db;
var dbCreated = false;
var shapeStatus = 1;
var levelStatus = 1;
var mediaFlag = "true";
var shapeId="";
var imageId="";
var levelId="";
var my_media = null;
var playImage;
var pictureSource;
var destinationType;


function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady() {
   // Register the event listener
    document.addEventListener("resume", onResume, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("touchstart", function(){}, true);
    //window.addEventListener('orientationchange', doOnOrientationChange);
    /* navigator.splashscreen.show();
     if (navigator.splashscreen) {
     console.warn('Hiding splash screen');
     // We're done initializing, remove the splash screen
     setTimeout(function() {
     navigator.splashscreen.hide();
     }, 100);
     }*/
    var currentsoundStatus = window.localStorage["soundStatus"];
    if ((currentsoundStatus === undefined) ||(currentsoundStatus == null))
    {
        window.localStorage.setItem("soundStatus","on");
        playAudio("audio/music.mp3");
    }
    else if(currentsoundStatus =="off"){
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
    else if(window.localStorage["soundStatus"] =="on"){
        window.localStorage.setItem("soundStatus","on");
        playAudio("audio/music.mp3");
    }
    
    var currentautoRotationStatus = window.localStorage["autoRotationStatus"];
  
    if ((currentautoRotationStatus === undefined) ||(currentautoRotationStatus == null))
    {
        window.localStorage.setItem("autoRotationStatus","false");
    }
    else if(currentautoRotationStatus =="false"){
        window.localStorage.setItem("autoRotationStatus","false");
    }
    else if(currentautoRotationStatus =="true"){
        window.localStorage.setItem("autoRotationStatus","true");
    }
    
    var changeImageFlagStatus = window.localStorage["Puzzle_ChangeImageFlag"];
    if ((changeImageFlagStatus === undefined) ||(changeImageFlagStatus == null))
    {
        console.log(changeImageFlagStatus)
    }
    else if(changeImageFlagStatus== "true" )
    {
        // playImage = window.localStorage["Puzzle_PlayImage"];
        // shapeId = window.localStorage["Puzzle_ShapeId"];
        //window.localStorage.clear();
        //$('.settingsPage, .imgSelectPage, .chooseShapePage, .homePage').hide();
       // $('.gamePage').show();
       // playPuzzleGame();
        window.localStorage.setItem("Puzzle_ChangeImageFlag","false");
    }
    
    var settingPageChangeStatus = window.localStorage["Puzzle_SettingPageChange"];
    if ((settingPageChangeStatus === undefined) ||(settingPageChangeStatus == null))
    {
        console.log(settingPageChangeStatus)
    }
    else if(window.localStorage["Puzzle_SettingPageChange"] == "true")
    {
        // playImage = window.localStorage["Puzzle_PlayImage"];
        // shapeId = window.localStorage["Puzzle_ShapeId"];
       // $('.settingsPage, .imgSelectPage, .chooseShapePage, .homePage').hide();
       // $('.gamePage').show();
       // playPuzzleGame();
        window.localStorage.setItem("Puzzle_SettingPageChange","false");
    }
    
    
    playImage = window.localStorage["Puzzle_PlayImage"];
    shapeId = window.localStorage["Puzzle_ShapeId"];
    if ((playImage === undefined) ||(playImage == null)||(shapeId === undefined) ||(shapeId == null))
    {
        $('.settingsPage, .imgSelectPage, .chooseShapePage, .gamePage').hide();
        $('.homePage').show();
    }
    else
    {
        $('.settingsPage, .imgSelectPage, .chooseShapePage, .homePage').hide();
        $('.gamePage').show();
        playPuzzleGame();
    }
    
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
    //----------------------------------------------------------------------------------------------
    // Start Database Creation
    //----------------------------------------------------------------------------------------------
    db = window.openDatabase("PuzzlePicDirectoryDB", "1.0", "Puzzle Pic Images", 200000);
    if (dbCreated){
        db.transaction(getImages, transaction_error);
    }
    else{
        db.transaction(populateDB, transaction_error, populateDB_success);
    }
    
    swipeSliders();
    
}

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
}

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
    alert("onPause");
    if(window.localStorage["soundStatus"] =="on"){
        window.localStorage.setItem("soundStatus","on");
        stopAudio();
    }
    else
    {
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
}

// Handle the resume event
function onResume() {
    alert("onResume");
    if(window.localStorage["soundStatus"] =="off"){
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
    else{
        window.localStorage.setItem("soundStatus","on");
        playAudio("audio/music.mp3");
    }
}


function swipeSliders() {
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
}

//-----------------------------------------------------------------------------------
// Start page selection
//-----------------------------------------------------------------------------------


    $('#play a').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.settingsPage,.chooseShapePage,.homePage,.gamePage,.loginPage,.registerPage').hide();
        $('.imgSelectPage').show();
    });

    $('ul[id*=shapes] li').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        db.transaction(getImagesFromId, transaction_error);
        window.localStorage.setItem("Puzzle_ShapeId",$(this).attr('id'));
        $('.settingsPage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPage').hide();
        $('.gamePage').show();
    });

    $('.settings').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                       $(this).toggleClass("tada animatedTada");
        $('.gamePage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPage').hide();
        settingPageShow();
    });

    $('#settingsSound').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                            $(this).toggleClass("tada animatedTada");
        if(window.localStorage["soundStatus"] =="on"){
            $('#settingsSound img').attr('src','images/soundOff.png');
            stopAudio();
            window.localStorage.setItem("soundStatus","off");
        }
        else if(window.localStorage["soundStatus"] =="off"){
            $('#settingsSound img').attr('src','images/soundOn.png');
            playAudio("audio/music.mp3");
            window.localStorage.setItem("soundStatus","on");
        }
    });

    $('#settingsRotation').on("click touchstart", function(e){
         e.stopPropagation(); e.preventDefault();
                              
                            /*  if ( $(this).hasClass("tada") || $(this).hasClass("animatedTada")) {
                               $(this).removeClass("tada");
                               $(this).removeClass("animatedTada");
                              } else {
                              $(this).addClass("tada");
                              $(this).addClass("animatedTada");
                              }*/
                              $(this).toggleClass("tada animatedTada");
                              
         var currentautoRotationStatus = window.localStorage["autoRotationStatus"];
        
         if ((currentautoRotationStatus === undefined) ||(currentautoRotationStatus == null))
         {
         window.localStorage.setItem("autoRotationStatus","false");
         }
         else if(currentautoRotationStatus =="false"){
         $('#settingsRotation img').attr('src','images/autoRotateOn.png');
         window.localStorage.setItem("autoRotationStatus","true");
         }
         else if(currentautoRotationStatus =="true"){
         $('#settingsRotation img').attr('src','images/autoRotateOff.png');
         window.localStorage.setItem("autoRotationStatus","false");
         }
         window.localStorage.setItem("Puzzle_SettingPageChange","true");
    });

    $('#settingsShape').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                            $(this).toggleClass("tada animatedTada");
        if(shapeStatus == 5)
        shapeStatus =1;
        else
        shapeStatus++;
        switch(shapeStatus)
        {
        case 1 :$('#settingsShape img').attr('src','images/shape1.png');
            shapeId = shapeStatus;
            break;
        /*case 2 :$('#settingsShape img').attr('src','images/shape2.png');;
            shapeId = shapeStatus;
            break;*/
        case 2 :$('#settingsShape img').attr('src','images/shape2.png');
            shapeId = shapeStatus;
            break;
        case 3 :$('#settingsShape img').attr('src','images/shape3.png');
            shapeId = shapeStatus;
            break;
        case 4 :$('#settingsShape img').attr('src','images/shape4.png');;
            shapeId = shapeStatus;
            break;
        case 5 :$('#settingsShape img').attr('src','images/shape5.png');
            shapeId = shapeStatus;
            break;
        default:$('#settingsShape img').attr('src','images/shape1.png');
            shapeId = 1;
        };
        window.localStorage.setItem("Puzzle_ShapeId",shapeId);
        window.localStorage.setItem("Puzzle_SettingPageChange","true");
       // alert("shapeStatus : "+shapeStatus+"shapeId : "+shapeId);
    });

    $('#settingsLevel').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                            $(this).toggleClass("tada animatedTada");
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
        window.localStorage.setItem("Puzzle_LevelId",levelId);
        window.localStorage.setItem("Puzzle_SettingPageChange","true");
    });

    $('.proVersion').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                         $(this).toggleClass("tada animatedTada");
        $('.proVersionPopUp').show();
        $('.popUpCov').show();
    });
          
    $('#playWithCode').on("click touchstart", function(e){
       e.stopPropagation(); e.preventDefault();
                           $(this).toggleClass("tada animatedTada");
       alert("#playWithCode")
    });

    /*$('.goPlayPage').on("click touchstart", function(e){
       e.stopPropagation(); e.preventDefault();
       $('.gamePage,.homePage,.chooseShapePage,.loginPage,.registerPage,.settingsPage').hide();
       $('.imgSelectPage').show();
    });
                  
    $('.goRegisterPage').on("click touchstart", function(e){
       e.stopPropagation(); e.preventDefault();
       $('.gamePage,.homePage,.chooseShapePage,.loginPage,.imgSelectPage,.settingsPage').hide();
       $('.registerPage').show();
    });

    $('.chooseShape').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.gamePage,.homePage,.registerPage,.loginPage,.imgSelectPage,.settingsPage').hide();
        $('.chooseShapePage').show();
    });

    $('.goSettingsPage').on("click touchstart", function(e){
         e.stopPropagation(); e.preventDefault();
        $('.gamePage,.homePage,.registerPage,.loginPage,.imgSelectPage').hide();
        settingPageShow();
    });*/

    $('.playGame').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                       $(this).toggleClass("tada animatedTada");
        var currentIds = window.localStorage["Puzzle_PlayImage"];
        if ((currentIds === undefined) ||(currentIds == null))
        {
            $('.loginPage, .registerPage, .settingsPage,.gamePage,.homePage,.chooseShapePage').hide();
            $('.imgSelectPage').show()
        }
        else{
            if(window.localStorage["Puzzle_SettingPageChange"] == "true")
            {
                location.reload();
            }
            else
            {
                $('.loginPage, .registerPage, .settingsPage,.homePage,.chooseShapePage,.imgSelectPage').hide();
                $('.gamePage').show();
            }
        }
    });
                  
    $('.killMe').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.popUpCov').hide();
    });

    $('.navImageBackButton').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.chooseShapePage').hide();
        $('.homePage').show();
    });

    $('.navShapeBackButton').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.loginPage, .registerPage, .settingsPage,.gamePage,.homePage,.chooseShapePage').hide();
        $('.imgSelectPage').show();
    });

    $('.navSettingsBackButton').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.chooseShapePage').hide();
        $('.homePage').show();
    });

    $('.navPlayBackButton').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
        $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.homePage').hide();
        $('.chooseShapePage').show();
    });
                  
    $('#change_image').click(function(e){
        e.stopPropagation(); e.preventDefault();
                              $(this).toggleClass("tada animatedTada");
        window.localStorage.setItem("Puzzle_ChangeImageFlag","true");
        $('.loginPage, .registerPage, .settingsPage,.gamePage,.chooseShapePage,.homePage').hide();
        $('.imgSelectPage').show();
    });
      
    $('#change_settings').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                              $(this).toggleClass("tada animatedTada");
        $('.loginPage, .registerPage, .imgSelectPage,.gamePage,.chooseShapePage,.homePage').hide();
        settingPageShow();
        window.localStorage.setItem("game_to_setting_page","true");
    });
    
   $('#show_preview').click(function(e){
        e.stopPropagation(); e.preventDefault();
                             $(this).toggleClass("tada animatedTada");
        $('#image-preview').toggleClass("show");
        //canvas.style.marginLeft = -(canvas.width / 2) + "px"
        //canvas.style.marginTop = (canvas.width / 4) + "px"
   });
                  
   $('#auto_solve').click(function(e){
        e.stopPropagation(); e.preventDefault();
                         $(this).toggleClass("tada animatedTada");
                         var playImageVal= window.localStorage["Puzzle_PlayImage"];
                         var shapeIdValue = window.localStorage["Puzzle_ShapeId"];
       
                          (function() {
                           var jsaw = new jigsaw.Jigsaw({
                                                        defaultImage: "puzzlepictures/" + playImageVal,
                                                        defaultPieces: 12,
                                                        insideValue:"inside_"+ shapeIdValue,
                                                        outsideValue:"outside_"+ shapeIdValue,
                                                        rotatePieces:false,
                                                        shuffled: false,
                                                        });
                           }());
   });
                  
    $('#popupPlay').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                       $(this).toggleClass("tada animatedTada");
        window.localStorage.setItem("Puzzle_ChangeImageFlag","true");
        $('.popUpCov').hide();
        $('.loginPage, .registerPage,.gamePage,.chooseShapePage,.homePage,.settingsPage').hide();
        $('.imgSelectPage').show();
    });
                  
    $('#popupPro').on("click touchstart", function(e){
        e.stopPropagation(); e.preventDefault();
                      $(this).toggleClass("tada animatedTada");
        alert("Currently Redirecting to Home Screen Update on Second Phase");
        window.localStorage.setItem("Puzzle_ChangeImageFlag","true");
        $('.popUpCov').hide();
        $('.loginPage, .registerPage,.gamePage,.chooseShapePage,.settingsPage,.imgSelectPage').hide();
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


//-----------------------------------------------------------------------------------
// End slider
//-----------------------------------------------------------------------------------

function populateDB(tx) {
    $('#busy').show();
    tx.executeSql('DROP TABLE IF EXISTS imageList');
    var sql = "CREATE TABLE IF NOT EXISTS imageList ( "+"id INTEGER PRIMARY KEY AUTOINCREMENT, "+"server_id INTEGER  ," +"picture VARCHAR(200))";
    tx.executeSql(sql);
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (1,01,'puzzle1.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (2,02,'puzzle2.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (3,03,'puzzle3.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (4,04,'puzzle4.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (5,05,'puzzle1.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (6,06,'puzzle2.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (7,07,'puzzle3.jpg')");
    tx.executeSql("INSERT INTO imageList (id,server_id,picture) VALUES (8,08,'puzzle4.jpg')");
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
        window.localStorage.setItem("Puzzle_PlayImage", imageListItems.picture);
        //window.localStorage.setItem("Puzzle_ShapeId",shapeId);
        if(window.localStorage["Puzzle_ChangeImageFlag"] == "true"  || window.localStorage["game_to_setting_page"] == "true")
        {
            location.reload();
            window.localStorage.setItem("game_to_setting_page", "false");
        }
        playImage = imageListItems.picture;
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
     console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
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
    var shapeIdVal=window.localStorage["Puzzle_ShapeId"];
    /*if ((shapeIdVal === undefined) ||(shapeIdVal == null))
    {
        shapeIdVal= 1;
    }
    else{
        shapeIdVal=window.localStorage["shapeId"];
    }*/
    
   /* var layoutHeight = $('#windowlayout').height();  // main layout
    var toolBarHeight = $('#game-options').height(); // tool bar layout
    
    var gameHeight = (((layoutHeight - toolBarHeight)/layoutHeight)*100)-8;
    $("canvas").css("height", gameHeight+"%");
    $("canvas").css("width", "100%");*/
    
    autoRotationStatusVal=window.localStorage["autoRotationStatus"];
    switch (shapeIdVal) {
        case "1":
            if (autoRotationStatusVal =="true") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

            
            
        case "2":
            (function() {
             var jsaw = new jigsaw.Jigsaw({
                                          defaultImage: "puzzlepictures/" + playImage,
                                          defaultPieces: 12,
                                          insideValue:"inside_"+ shapeIdVal,
                                          outsideValue:"outside_"+ shapeIdVal,
                                          rotatePieces:false
                                          });
             }());
            
            break;
            
        case "3":
             if (autoRotationStatusVal =="true"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                             defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

        case "4":
            if (autoRotationStatusVal =="true") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces: false
                                              });
                 }());
            }
            break;

        case "5":
            if (autoRotationStatusVal =="true") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage: "puzzlepictures/" + playImage,
                                              defaultPieces: 12,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces: false
                                              });
                 }());
            }
            break;
       
    }
   }

function settingPageShow()
{
    switch(window.localStorage["Puzzle_ShapeId"] )
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
        default : $('#settingsShape img').attr('src','images/shape1.png');
    };
    
    switch(window.localStorage["Puzzle_LevelId"])
    {
        case "1" :$('#settingsLevel img').attr('src','images/easy.png');
            break;
        case "2" :$('#settingsLevel img').attr('src','images/medium.png');
            break;
        case "3" :$('#settingsLevel img').attr('src','images/hard.png');
            break;
        default : $('#settingsLevel img').attr('src','images/easy.png');
    };
    
    if( window.localStorage["autoRotationStatus"] =="false"){
        $('#settingsRotation img').attr('src','images/autoRotateOff.png');
    }
    else if (window.localStorage["autoRotationStatus"] =="true"){
        $('#settingsRotation img').attr('src','images/autoRotateOn.png');
    }
    
    if(window.localStorage["soundStatus"] =="on"){
        $('#settingsSound img').attr('src','images/soundOn.png');
    }
    else if(window.localStorage["soundStatus"] =="off"){
        $('#settingsSound img').attr('src','images/soundOff.png');
    }
    
    $('.settingsPage').show();
}



