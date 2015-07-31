var db;
var dbCreated = false;
var shapeStatus = 0;
var levelStatus = 0;
var mediaFlag = "true";
var shapeId="";
var imageId="";
var levelId="";
var my_media = null;
var mediaTimer = null;
var playImage;
var pictureSource;
var destinationType;
var URL_image;
var device_id;

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// Cordova is loaded and it is now safe to make calls Cordova methods
function onDeviceReady() {
    // Register the event listener
   
    console.log("Device ID : "+device.uuid);
    
    device_id = device.uuid;
    var networkState = navigator.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
   /* if(states[networkState] != "No network connection" && states[networkState] != "Unknown connection")
    {
        init();
    }*/
    
    Example1.resetStopwatch();
    document.addEventListener("resume", onResume, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("touchstart", function(){}, true);
    //window.addEventListener('orientationchange', doOnOrientationChange);
    // navigator.splashscreen.show();
    /* if (navigator.splashscreen) {
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
        playAudio('musicSound');
    }
    else if(currentsoundStatus =="off"){
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
    else if(window.localStorage["soundStatus"] =="on"){
        window.localStorage.setItem("soundStatus","on");
        playAudio('musicSound');
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
    
   /* if(window.localStorage["Puzzle_camera_gallery"] == "true")
    {
        playImage = window.localStorage["Puzzle_PlayImage"];
    }
    else
    {
        playImage = "puzzlepictures/" +  window.localStorage["Puzzle_PlayImage"];
    }*/
    
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



// Handle the back button Android
function onBackKeyDown(e) {
    e.preventDefault();
    var r = confirm("Are you sure you want to exit");
    if (r == true) {
        Example1.resetStopwatch();
        // window.localStorage.clear();
        window.localStorage.removeItem("Puzzle_ShapeId");
        window.localStorage.removeItem("Puzzle_ToSettingPageFlag");
        window.localStorage.removeItem("Puzzle_camera_gallery");
        window.localStorage.removeItem("Puzzle_LevelId");
        window.localStorage.removeItem("Puzzle_PlayImage");
        window.localStorage.removeItem("soundStatus");
        window.localStorage.removeItem("autoRotationStatus");
        window.localStorage.removeItem("Puzzle_ChangeImageFlag");
        window.localStorage.removeItem("Puzzle_SettingPageChange");
        stopAudio();
        navigator.app.exitApp();
    }
    else {
        return;
    }
}

function onPause() {
    // alert("onPause");
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
    // alert("onResume");
    if(window.localStorage["soundStatus"] =="off"){
        window.localStorage.setItem("soundStatus","off");
        stopAudio();
    }
    else{
        window.localStorage.setItem("soundStatus","on");
        playAudio('musicSound');
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


$('.playArea').click( function(e){
                 // e.stopPropagation();
                 // e.preventDefault();
                 $('.progressBar').hide();
                 $('.settingsPage,.chooseShapePage,.homePage,.gamePage,.loginPage,.registerPage').hide();
                 $('.imgSelectPage').show();
                 imageParsing();
                 });

$('ul[id*=shapes] li').click( function(e){
                             e.stopPropagation(); e.preventDefault();
                             db.transaction(getImagesFromId, transaction_error);
                             window.localStorage.setItem("Puzzle_ShapeId",$(this).attr('id'));
                             $('.settingsPage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPage').hide();
                             $('.gamePage').show();
                             });

$('.settings').click( function(e){
                     e.stopPropagation(); e.preventDefault();
                     // $(this).toggleClass("tada animatedTada");
                     
                     $('.settings').addClass("animatedTada tada");
                     setTimeout(function()
                                {
                                $('.settings').removeClass("animatedTada tada");
                                }, 1000);
                     $('.gamePage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPage').hide();
                     settingPageShow();
                     });

$('#settingsSound').click( function(e){
                          e.stopPropagation(); e.preventDefault();
                          //   $(this).toggleClass("tada animatedTada");
                          
                          $('#settingsSound').addClass("animatedTada tada");
                          setTimeout(function()
                                     {
                                     $('#settingsSound').removeClass("animatedTada tada");
                                     }, 1000);
                          
                          if(window.localStorage["soundStatus"] =="on"){
                          $('#settingsSound img').attr('src','images/soundOff.png');
                          stopAudio();
                          window.localStorage.setItem("soundStatus","off");
                          }
                          else if(window.localStorage["soundStatus"] =="off"){
                          $('#settingsSound img').attr('src','images/soundOn.png');
                          playAudio('musicSound');
                          window.localStorage.setItem("soundStatus","on");
                          }
                          });

$('#settingsRotation').click( function(e){
                             e.stopPropagation(); e.preventDefault();
                             
                             /*  if ( $(this).hasClass("tada") || $(this).hasClass("animatedTada")) {
                              $(this).removeClass("tada");
                              $(this).removeClass("animatedTada");
                              } else {
                              $(this).addClass("tada");
                              $(this).addClass("animatedTada");
                              }*/
                             //  $(this).toggleClass("tada animatedTada");
                             
                             $('#settingsRotation').addClass("animatedTada tada");
                             setTimeout(function()
                                        {
                                        $('#settingsRotation').removeClass("animatedTada tada");
                                        }, 1000);
                             
                             
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


$('#settingsShapeSend').click( function(e){
                              
                              $('#settingsShapeSend').addClass("animatedTada tada");
                              setTimeout(function()
                                         {
                                         $('#settingsShapeSend').removeClass("animatedTada tada");
                                         }, 1000);
                              
                              shapeStatus = window.localStorage["Puzzle_ShapeId"];
                              
                              if ((shapeStatus === undefined) ||(shapeStatus == null))
                              shapeStatus =1;
                              else
                              shapeStatus = window.localStorage["Puzzle_ShapeId"];
                              
                              if(shapeStatus == 5)
                              shapeStatus =1;
                              else
                              shapeStatus++;
                              
                              switch(shapeStatus)
                              {
                              case 1 :$('#settingsShapeSend img').attr('src','images/shape1.png');
                              shapeId = shapeStatus;
                              break;
                              /*case 2 :$('#settingsShapeSend img').attr('src','images/shape2.png');;
                               shapeId = shapeStatus;
                               break;*/
                              case 2 :$('#settingsShapeSend img').attr('src','images/shape2.png');
                              shapeId = shapeStatus;
                              break;
                              case 3 :$('#settingsShapeSend img').attr('src','images/shape3.png');
                              shapeId = shapeStatus;
                              break;
                              case 4 :$('#settingsShapeSend img').attr('src','images/shape4.png');;
                              shapeId = shapeStatus;
                              break;
                              case 5 :$('#settingsShapeSend img').attr('src','images/shape5.png');
                              shapeId = shapeStatus;
                              break;
                              default:$('#settingsShapeSend img').attr('src','images/shape1.png');
                              shapeId = 1;
                              };
                              window.localStorage.setItem("Puzzle_ShapeId",shapeId);
                              });

$('#settingsLevelSend').click( function(e){
                              e.stopPropagation(); e.preventDefault();
                              
                              // $(this).toggleClass("tada animatedTada");
                              
                              $('#settingsLevelSend').addClass("animatedTada tada");
                              setTimeout(function()
                                         {
                                         $('#settingsLevelSend').removeClass("animatedTada tada");
                                         }, 1000);
                              
                              var levelStatusVal  = window.localStorage["Puzzle_LevelId"];
                              if ((levelStatusVal === undefined) ||(levelStatusVal == null))
                              levelStatus =1;
                              else{
                              if(levelStatusVal ==12)
                              levelStatus=1;
                              else if(levelStatusVal == 24)
                              levelStatus=2;
                              else if(levelStatusVal == 48)
                              levelStatus=3;
                              }
                              
                              
                              if(levelStatus == 3)
                              levelStatus =1;
                              else
                              levelStatus++;
                              switch(levelStatus)
                              {
                              case 1 :$('#settingsLevelSend img').attr('src','images/easy.png');
                              levelId = 12;
                              break;
                              case 2 :$('#settingsLevelSend img').attr('src','images/medium.png');
                              levelId = 24;
                              break;
                              case 3 :$('#settingsLevelSend img').attr('src','images/hard.png');
                              levelId = 48;
                              break;
                              default:$('#settingsLevelSend img').attr('src','images/easy.png');
                              levelId = 12;
                              };
                              window.localStorage.setItem("Puzzle_LevelId",levelId);
                              
                              });


$('#settingsShape').click( function(e){
                          e.stopPropagation(); e.preventDefault();
                          // $(this).toggleClass("tada animatedTada");
                          
                          $('#settingsShape').addClass("animatedTada tada");
                          setTimeout(function()
                                     {
                                     $('#settingsShape').removeClass("animatedTada tada");
                                     }, 1000);
                          
                          shapeStatus = window.localStorage["Puzzle_ShapeId"];
                          
                          if ((shapeStatus === undefined) ||(shapeStatus == null))
                          shapeStatus =1;
                          else
                          shapeStatus = window.localStorage["Puzzle_ShapeId"];
                          
                          if(shapeStatus == 5)
                          shapeStatus =1;
                          else
                          shapeStatus++;
                          switch(shapeStatus)
                          {
                          case 1 :$('#settingsShape img').attr('src','images/shape1.png');
                          shapeId = shapeStatus;
                          break;
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

$('#settingsLevel').click( function(e){
                          e.stopPropagation(); e.preventDefault();
                          // $(this).toggleClass("tada animatedTada");
                          
                          $('#settingsLevel').addClass("animatedTada tada");
                          setTimeout(function()
                                     {
                                     $('#settingsLevel').removeClass("animatedTada tada");
                                     }, 1000);
                          
                          var levelStatusVal  = window.localStorage["Puzzle_LevelId"];
                          if ((levelStatusVal === undefined) ||(levelStatusVal == null))
                          levelStatus =1;
                          else{
                          if(levelStatusVal ==12)
                          levelStatus=1;
                          else if(levelStatusVal == 24)
                          levelStatus=2;
                          else if(levelStatusVal == 48)
                          levelStatus=3;
                          }
                          
                          
                          if(levelStatus == 3)
                          levelStatus =1;
                          else
                          levelStatus++;
                          switch(levelStatus)
                          {
                          case 1 :$('#settingsLevel img').attr('src','images/easy.png');
                          levelId = 12;
                          break;
                          case 2 :$('#settingsLevel img').attr('src','images/medium.png');;
                          levelId = 24;
                          break;
                          case 3 :$('#settingsLevel img').attr('src','images/hard.png');
                          levelId = 48;
                          break;
                          default:$('#settingsLevel img').attr('src','images/easy.png');
                          levelId = 12;
                          };
                          window.localStorage.setItem("Puzzle_LevelId",levelId);
                          window.localStorage.setItem("Puzzle_SettingPageChange","true");
                          });

$('.proVersion').click( function(e){
                       e.stopPropagation(); e.preventDefault();
                       //$(this).toggleClass("tada animatedTada");
                       
                       $('.proVersion').addClass("animatedTada tada");
                       setTimeout(function()
                                  {
                                  $('.proVersion').removeClass("animatedTada tada");
                                  }, 1000);
                       
                      // $('.proVersionPopUp').show();
                      // $('.popUpCov').show();
                       
                       $('.settingsPage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPag,.gamePagee').hide();
                       $('.sendPuzzlePage').show();
                       });

/*$('.goPlayPage').click( function(e){
 e.stopPropagation(); e.preventDefault();
 $('.gamePage,.homePage,.chooseShapePage,.loginPage,.registerPage,.settingsPage').hide();
 // downloadImage();
 $('.imgSelectPage').show();
 });
 
 $('.goRegisterPage').click( function(e){
 e.stopPropagation(); e.preventDefault();
 $('.gamePage,.homePage,.chooseShapePage,.loginPage,.imgSelectPage,.settingsPage').hide();
 $('.registerPage').show();
 });
 
 $('.chooseShape').click( function(e){
 e.stopPropagation(); e.preventDefault();
 $('.gamePage,.homePage,.registerPage,.loginPage,.imgSelectPage,.settingsPage').hide();
 $('.chooseShapePage').show();
 });
 
 $('.goSettingsPage').click( function(e){
 e.stopPropagation(); e.preventDefault();
 $('.gamePage,.homePage,.registerPage,.loginPage,.imgSelectPage').hide();
 settingPageShow();
 });*/

$('.playGame').click( function(e){
                     e.stopPropagation(); e.preventDefault();
                     //  $(this).toggleClass("tada animatedTada");
                     
                     $('.playGame').addClass("animatedTada tada");
                     setTimeout(function()
                                {
                                $('.playGame').removeClass("animatedTada tada");
                                }, 1000);
                     
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
                     Example1.Timer.toggle();
                     $('.loginPage, .registerPage, .settingsPage,.homePage,.chooseShapePage,.imgSelectPage').hide();
                     $('.gamePage').show();
                     }
                     }
                     });

$('.killMe').click( function(e){
                   e.stopPropagation(); e.preventDefault();
                   $('.popUpCov').hide();
                   });

$('.ImageBackButton').click( function(e){
                            //   e.stopPropagation();
                            //  e.preventDefault();
                            $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.chooseShapePage').hide();
                            $('.homePage').show();
                            });


$('.SendBackButton').click( function(e){
                           //   e.stopPropagation();
                           //  e.preventDefault();
                           $('.loginPage, .registerPage, .settingsPage,.gamePage,.homePage,.chooseShapePage').hide();
                           $('.imgSelectPage').show();
                           });


$('.ShapeBackButton').click( function(e){
                            //e.stopPropagation();
                            //  e.preventDefault();
                            $('.loginPage, .registerPage, .settingsPage,.gamePage,.homePage,.chooseShapePage').hide();
                            // downloadImage();
                            $('.imgSelectPage').show();
                            });

$('.SettingsBackButton').click( function(e){
                               //e.stopPropagation();
                               //   e.preventDefault();
                               $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.chooseShapePage').hide();
                               $('.homePage').show();
                               });

$('.PlayBackButton').click( function(e){
                           e.stopPropagation(); e.preventDefault();
                           $('.loginPage, .registerPage, .settingsPage,.gamePage,.imgSelectPage,.homePage').hide();
                           $('.chooseShapePage').show();
                           });

$('#change_image').click(function(e){
                         e.stopPropagation(); e.preventDefault();
                         //$(this).toggleClass("tada animatedTada");
                         
                         $('#change_image').addClass("animatedTada tada");
                         setTimeout(function()
                                    {
                                    $('#change_image').removeClass("animatedTada tada");
                                    }, 1000);
                         
                         window.localStorage.setItem("Puzzle_ChangeImageFlag","true");
                         $('.loginPage, .registerPage, .settingsPage,.gamePage,.chooseShapePage,.homePage').hide();
                         //downloadImage();
                         $('.imgSelectPage').show();
                         });

$('#change_settings').click( function(e){
                            e.stopPropagation(); e.preventDefault();
                            // $(this).toggleClass("tada animatedTada");
                            
                            $('#change_settings').addClass("animatedTada tada");
                            setTimeout(function()
                                       {
                                       $('#change_settings').removeClass("animatedTada tada");
                                       }, 1000);
                            Example1.Timer.toggle();
                            
                            $('.loginPage, .registerPage, .imgSelectPage,.gamePage,.chooseShapePage,.homePage').hide();
                            settingPageShow();
                            window.localStorage.setItem("Puzzle_ToSettingPageFlag","true");
                            });

$('#show_preview').click(function(e){
                         e.stopPropagation(); e.preventDefault();
                         // $(this).toggleClass("tada animatedTada");
                         
                         
                         $('#show_preview').addClass("animatedTada tada");
                         setTimeout(function()
                                    {
                                    $('#show_preview').removeClass("animatedTada tada");
                                    }, 1000);
                         
                         $('#image-preview').toggleClass("show");
                         //canvas.style.marginLeft = -(canvas.width / 2) + "px"
                         //canvas.style.marginTop = (canvas.width / 4) + "px"
                         });

$('#auto_solve').click(function(e){
                       e.stopPropagation(); e.preventDefault();
                       //   $(this).toggleClass("tada animatedTada");
                       
                       $('#auto_solve').addClass("animatedTada tada");
                       setTimeout(function()
                                  {
                                  $('#auto_solve').removeClass("animatedTada tada");
                                  }, 1000);
                       
                       var playImageVal= window.localStorage["Puzzle_PlayImage"];
                       var shapeIdValue = window.localStorage["Puzzle_ShapeId"];
                       
                       (function() {
                        var jsaw = new jigsaw.Jigsaw({
                                                     defaultImage:playImageVal,
                                                     defaultPieces: 12,
                                                     insideValue:"inside_"+ shapeIdValue,
                                                     outsideValue:"outside_"+ shapeIdValue,
                                                     rotatePieces:false,
                                                     shuffled: false,
                                                     });
                        }());
                       });

$('#popupPlay').click( function(e){
                      e.stopPropagation(); e.preventDefault();
                      //  $(this).toggleClass("tada animatedTada");
                      
                      $('#popupPlay').addClass("animatedTada tada");
                      setTimeout(function()
                                 {
                                 $('#popupPlay').removeClass("animatedTada tada");
                                 }, 1000);
                      
                      window.localStorage.setItem("Puzzle_ChangeImageFlag","true");
                      $('.popUpCov').hide();
                      $('.loginPage, .registerPage,.gamePage,.chooseShapePage,.homePage,.settingsPage').hide();
                      //downloadImage();
                      $('.imgSelectPage').show();
                      });

$('#popupPro').click( function(e){
                     e.stopPropagation(); e.preventDefault();
                     //$(this).toggleClass("tada animatedTada");
                     
                     $('#popupPro').addClass("animatedTada tada");
                     setTimeout(function()
                                {
                                $('#popupPro').removeClass("animatedTada tada");
                                }, 1000);
                     
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
    //$('#busy').show();
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
    
    
    if((window.localStorage["shapeTableCreated"] == undefined) || (window.localStorage["shapeTableCreated"] == null))
    {
        
        var sqlShape = "CREATE TABLE IF NOT EXISTS shapeList ( "+"id INTEGER PRIMARY KEY AUTOINCREMENT, "+"shape_id INTEGER  ," +"status VARCHAR(200),"+"purchase_stataus VARCHAR(200))";
        tx.executeSql(sqlShape);
        window.localStorage.setItem("shapeTableCreated", "true");
        
        tx.executeSql("INSERT INTO shapeList (shape_id,status,purchase_stataus) VALUES (1,'free','y')");
        tx.executeSql("INSERT INTO shapeList (shape_id,status,purchase_stataus) VALUES (2,'free','y')");
        tx.executeSql("INSERT INTO shapeList (shape_id,status,purchase_stataus) VALUES (3,'free','y')");
        tx.executeSql("INSERT INTO shapeList (shape_id,status,purchase_stataus) VALUES (4,'paid','n')");
        tx.executeSql("INSERT INTO shapeList (shape_id,status,purchase_stataus) VALUES (5,'paid','n')");
    }
    
    if((window.localStorage["imageTableCreated"] == undefined) || (window.localStorage["imageTableCreated"] == null))
    {
        var sqlImage = "CREATE TABLE IF NOT EXISTS imageListParsed ( "+"id INTEGER PRIMARY KEY AUTOINCREMENT, "+"row_id INTEGER  ," +"image_path VARCHAR(200),"+"status VARCHAR(200),"+"purchase_status VARCHAR(200))";
        tx.executeSql(sqlImage);
        window.localStorage.setItem("imageTableCreated", "true");
    }
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
    //var sql = "select picture from imageList where id = "+imageId;
    var sql = "select image_path from imageListParsed where row_id = "+imageId;
    tx.executeSql(sql, [], getImages_play);
}

function getImages_play(tx, results) {
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var imageListItems = results.rows.item(i);
        window.localStorage.setItem("Puzzle_PlayImage", imageListItems.picture);
        //window.localStorage.setItem("Puzzle_ShapeId",shapeId);
        if(window.localStorage["Puzzle_ChangeImageFlag"] == "true"  || window.localStorage["Puzzle_ToSettingPageFlag"] == "true")
        {
            location.reload();
            window.localStorage.setItem("Puzzle_ToSettingPageFlag", "false");
        }
        //playImage = "puzzlepictures/" + imageListItems.picture;
        playImage =imageListItems.picture;
    }
    playPuzzleGame();
}

function getImages_success(tx, results) {
    //$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var imageListItems = results.rows.item(i);
        var newlist='<li><a href="#" onClick="ImageClick(' + imageListItems.server_id + ')"><img src="puzzlepictures/' + imageListItems.picture + '"/> </a></li>';
        $('#galleryAvilabelList').append(newlist);
        
        //  var newPaidList='<li><a href="#" ><img src="puzzlepictures/' + img4.jpg + '"/> </a></li>';
        // $('#galleryPaidlList').append(newPaidList);
        // $('#galleryPaidlList').append(newlist);
        // $('#galleryReceivedlList').append(newlist);
    }
}

function ImageClick(id)
{
    imageId = id;
    window.localStorage.setItem("Puzzle_camera_gallery", "false");
    window.localStorage.setItem("page_location","4");
    $('.imgSelectPage').hide();
    $('.progressBar').show();
    //  chooseShapeServer();
    checkConnection();
    $('.chooseShapePage').show();
}
//-----------------------------------------------------------------------------------------------------------
// End Database Creation
// Satrt Background Music
//-----------------------------------------------------------------------------------------------------------

/*function playAudio(src) {
    mediaFlag = "true";
    my_media = new Media(src, onSuccess, onError);
    my_media.play({numberOfLoops:"infinite"});
    my_media.play();
}*/

function playAudio(id) {
    var audioElement = document.getElementById(id);
    var url = audioElement.getAttribute('src');
    mediaFlag = "true";
    my_media = new Media(url,
                             // success callback
                             function () { console.log("playAudio():Audio Success"); },
                             // error callback
                             function (err) { console.log("playAudio():Audio Error: " + err); }
                             );
    // Play audio
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
       // my_media.release();
    }
}

/*function onSuccess() {
    console.log("playAudio():Audio Success");
    if(mediaFlag == "true"){
        playAudio('musicSound');
        //playAudio("http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3");
    }
}

function onError(error) {
    console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}*/

//---------------------------------------------------------------------------------------------------------
// End Background Music
// Start Photo from camera /  Gallery
//--------------------------------------------------------------------------------------------------------

$('.sendPuzzle').click( function(e){
                       console.log("check");
                       // sendPuzzleShow();
                       $('.settingsPage,.chooseShapePage,.homePage,.gamePage,.loginPage,.registerPage,.imgSelectPage,.imgPopUp,.popUpCov').hide();
                       $('.progressBar').show();
                       $.ajax(
                              {
                              type: "POST",
                              url: "http://www.polussoftware.com/puzzlepics/device_check.php?deviceId=" + device_id,
                              data: "",
                              contentType: "application/json; charset=utf-8",
                              dataType: "json",
                              success: function(msg) {
                              $('.progressBar').hide();
                              
                              registrationStaus(msg)
                              },
                              error: function() {
                              alert('error');
                              }
                              });
                       
                       
                       });

function registrationStaus(msg)
{
    
    if(msg.data == "Registered")
				{
                    $('.progressBar').hide();
                    sendPuzzleShow();
                }
				else
                {
                    registration();
                }
    
}

$('.playPuzzle').click( function(e){
                       var image =document.getElementById('picture');
                       window.localStorage.setItem("Puzzle_LevelId", "12");
                       window.localStorage.setItem("Puzzle_ShapeId", "1");
                       window.localStorage.setItem("Puzzle_PlayImage", image.src);
                       window.localStorage.setItem("Puzzle_camera_gallery", "true");
                       // playImage = image.src;
                       location.reload();
                       // $('.settingsPage,.chooseShapePage,.homePage,.loginPage,.registerPage,.imgSelectPage,.imgPopUp,.popUpCov').hide();
                       // $('.gamePage').show();
                       // playPuzzleGame();
                       });

function registration()
{
    $('.progressBar').hide();
    $('.settingsPage,.chooseShapePage,.homePage,.loginPage,.gamePage,.imgSelectPage,.imgPopUp,.popUpCov').hide();
    $('.registerPage').show();
}


$('.registerButton').click( function(e){
                           var fname    = document.getElementById("fname").value;
                           var lname    = document.getElementById("lname").value;
                           var mobileNo = document.getElementById("mobileNo").value;
                           var email    = document.getElementById("email").value;
                           var password = document.getElementById("password").value;
                           
                           var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                           if(email.match(mailformat))
                           {
                           Url = "http://www.polussoftware.com/puzzlepics/reg.php?deviceId="+ device_id +"&firstName="+ fname +"&lastName="+ lname +"&mobile="+ mobileNo +"&email="+ email +"&password="+ password;
                           if(fname !="" && lname !="" && mobileNo !="" && email !="" && password !="" )
                           {
                           if(mobileNo.match(/^\d+$/))
                           {
                           $('.progressBar').show();
                           $.ajax(
                                  {
                                  type: "POST",
                                  url: Url,
                                  data: "",
                                  contentType: "application/json; charset=utf-8",
                                  dataType: "json",
                                  success: function(result) {
                                  registartionSuccess(result);
                                  
                                  },
                                  error: function() {
                                  $('.progressBar').hide();
                                  alert('error');
                                  }
                                  });
                           }
                           else
                           {
                           alert("Please enter valid phone number!");
                           }
                           }
                           else
                           {
                           alert("Please fill all the fields!");
                           }
                           
                           }  
                           else  
                           {  
                           alert("You have entered an invalid email address!");  
                           } 	 
                           
                           });

function registartionSuccess(result)
{
    $('.progressBar').hide();
    console.log("Successfully registerd !");
    sendPuzzleShow();
}

function snapPicture () {
    navigator.camera.getPicture (onSuccess, onFail,
                                 { quality: 100,
                                 targetWidth: 800,
                                 targetHeight: 600,
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
        
        image.src = imageData;
        $('.proVersionPopUp').hide();
        $('.congrat').hide();
        $('.imgPopUp').show();
        $('.recivied').hide();
        $('.popUpCov').show();
    }
    //A callback function when snapping picture is fail.
    function onFail (message) {
        console.log ('Error occured: ' + message);
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
    $('.recivied').hide();
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


$('.sendGame').click( function(e){
                     alert("sending puzzle");
                     uploadPhoto();
                     });

function uploadPhoto() {
    $('.progressBar').show();
    var imageURI = document.getElementById('picture').getAttribute("src");
    if (!imageURI) {
        alert('Please select an image first.');
        return;
    }
    
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    
     console.log("imageURI upload "+ imageURI);
     console.log("Puzzle_LevelId "+ window.localStorage["Puzzle_LevelId"]);
     console.log("Puzzle_ShapeId "+ window.localStorage["Puzzle_ShapeId"]);
    
    var params = new Object();
    params.contactNo = "999999999";
    params.levelId = window.localStorage["Puzzle_LevelId"];
    params.shapeId = window.localStorage["Puzzle_ShapeId"];
    params.deviceId = device_id;
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://www.polussoftware.com/puzzlepics/image.php"), win, fail, options);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    $('.progressBar').hide();
    alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

//--------------------------------------------------------------------------------------------------------
// End Photo from camera /  Gallery
//--------------------------------------------------------------------------------------------------------
function playPuzzleGame()
{
    Example1.Timer.toggle();
    var shapeIdVal=window.localStorage["Puzzle_ShapeId"];
    /*if ((shapeIdVal === undefined) ||(shapeIdVal == null))
     {
     shapeIdVal= 1;
     }
     else{
     shapeIdVal=window.localStorage["shapeId"];
     }*/
    
    /*var layoutHeight = $('#windowlayout').height();  // main layout
     var toolBarHeight = $('#game-options').height(); // tool bar layout
     
     var gameHeight = (((layoutHeight - toolBarHeight)/layoutHeight)*100)-8;
     $("canvas").css("height", gameHeight+"%");
     $("canvas").css("width", "100%");*/
    
    autoRotationStatusVal=window.localStorage["autoRotationStatus"];
    
    levelPieceVal=window.localStorage["Puzzle_LevelId"];
    if ((levelPieceVal === undefined) ||(levelPieceVal == null))
    {
        levelPieceVal= 12;
    }
    else{
        levelPieceVal=window.localStorage["Puzzle_LevelId"];
    }
    
    
    switch (shapeIdVal) {
        case "1":
            if (autoRotationStatusVal =="true") {
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
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
                                          defaultImage:playImage,
                                          defaultPieces:levelPieceVal,
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
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
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
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
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
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
                                              insideValue:"inside_"+ shapeIdVal,
                                              outsideValue:"outside_"+ shapeIdVal,
                                              rotatePieces:true
                                              });
                 }());
            }
            else if (autoRotationStatusVal =="false"){
                (function() {
                 var jsaw = new jigsaw.Jigsaw({
                                              defaultImage:playImage,
                                              defaultPieces:levelPieceVal,
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
    
    // alert("Puzzle_LevelId " + window.localStorage["Puzzle_LevelId"]);
    switch(window.localStorage["Puzzle_LevelId"])
    {
        case "12" :$('#settingsLevel img').attr('src','images/easy.png');
            break;
        case "24" :$('#settingsLevel img').attr('src','images/medium.png');
            break;
        case "48" :$('#settingsLevel img').attr('src','images/hard.png');
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


function sendPuzzleShow()
{
    
    switch(window.localStorage["Puzzle_ShapeId"] )
    {
        case "1" :$('#settingsShapeSend img').attr('src','images/shape1.png');
            break;
        case "2" :$('#settingsShapeSend img').attr('src','images/shape2.png');
            break;
        case "3" :$('#settingsShapeSend img').attr('src','images/shape3.png');
            break;
        case "4" :$('#settingsShapeSend img').attr('src','images/shape4.png');
            break;
        case "5" :$('#settingsShapeSend img').attr('src','images/shape5.png');
            break;
        default : $('#settingsShapeSend img').attr('src','images/shape1.png');
            window.localStorage.setItem("Puzzle_ShapeId", "1");
    };
    
    switch(window.localStorage["Puzzle_LevelId"])
    {
        case "12" :$('#settingsLevelSend img').attr('src','images/easy.png');
            break;
        case "24" :$('#settingsLevelSend img').attr('src','images/medium.png');
            break;
        case "36" :$('#settingsLevelSend img').attr('src','images/hard.png');
            break;
        default : $('#settingsLevelSend img').attr('src','images/easy.png');
       				 window.localStorage.setItem("Puzzle_LevelId", "12");
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
    
    $('.sendPuzzlePage').show();
}

/* Start download Image from Server */

//var URL_image= "http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg";
var Folder_Name="appfiles";
var File_Name="image";

function downloadImage()
{
    DownloadFile(URL_image, Folder_Name, File_Name);
}

function DownloadFile(URL, Folder_Name, File_Name) {
    if (URL == null && Folder_Name == null && File_Name == null)
    {
        return;
    }
    else
    {
        var networkState = navigator.connection.type;
        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        
        if(states[networkState] == "Unknown connection" || states[networkState] == "No network connection")
        {
            alert("Check your Internet connection!")
        }
        else
        {
            download(URL, Folder_Name, File_Name); //If available download function call
        }
    }
}

function download(URL, Folder_Name, File_Name) {
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
    function fileSystemSuccess(fileSystem) 
    {
        //alert("folder creation");
        
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
        var path = cordova.file.dataDirectory  + File_Name + "." + ext;
        //alert("phoneGapPath " + path);
   	    filetransfer(download_link, path);
    } 
    
    function fileSystemFail(evt)
    {
        alert(evt.target.error.code);
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    fileTransfer.download(download_link, fp,
                          function(entry) {
                          
                          var smallImage = document.getElementById('picture');
                          smallImage.style.display = 'block';
                          smallImage.src = cordova.file.dataDirectory + entry.fullPath;
                          // alert("complete " + smallImage.src);
                          
                          $('.progressBar').hide();
                          window.localStorage.setItem("Puzzle_LevelId", "12");
                          window.localStorage.setItem("Puzzle_ShapeId", "1");
                          window.localStorage.setItem("Puzzle_PlayImage", smallImage.src);
                          window.localStorage.setItem("Puzzle_camera_gallery", "true");
                          
                          location.reload();
                          console.log("download complete: " + entry.fullPath);
                          },
                          function(error) {
                          console.log("download error source " + error.source);
                          console.log("download error target " + error.target);
                          console.log("upload error code" + error.code);
                          },
                          false,
                          {
                          headers: {
                          "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                          }
                          }
                          );
}

/* Endx download Image from Server */



/* Start Timer */

var Example1 = new (function() {
                    var $stopwatch, // Stopwatch element on the page
                    incrementTime =60, // Timer speed in milliseconds
                    currentTime = 0, // Current time in hundredths of a second
                    updateTimer = function() {
                    $stopwatch.html(formatTime(currentTime));
                    currentTime += incrementTime / 10;
                    },
                    init = function() {
                    $stopwatch = $('#stopwatch');
                    Example1.Timer = $.timer(updateTimer, incrementTime, true);
                    };
                    this.resetStopwatch = function() {
                    currentTime = 0;
                    this.Timer.stop().once();
                    };
                    $(init);
                    });

function setTimeToStartPause()
{
    Example1.Timer.toggle();
}

function resetTime()
{
    Example1.resetStopwatch();
    Example1.Timer.toggle();
}


// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}

function formatTime(time) {
    var min = parseInt(time / 6000),
    sec = parseInt(time / 100) - (min * 60),
    hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}

/* End Timer */
/* Start checking internet connection */

function checkConnection() {
    var networkState = navigator.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    if(states[networkState] == "Unknown connection" || states[networkState] == "No network connection")
    {
        chooseShapeLocal();
    }
    else
    {
        chooseShapeServer();
    }
}

/* End checking internet connection  */

/* 	Start Choose Shape from local Parsing    */

function chooseShapeLocal()
{
    $("#shapes").empty();
    db.transaction(getShapes, transaction_error);
}

function getShapes(tx)
{
    var sql = "select shape_id, status, purchase_stataus from shapeList ";
    tx.executeSql(sql, [], getShapes_success);
}

function getShapes_success(tx, results)
{
			 $('.progressBar').hide();
			 $("#shapes").empty();
    var len = results.rows.length;
    for (var i=0; i<len; i++)
    {
        
        var shapeListItems = results.rows.item(i);
        
        if(shapeListItems.status == "free")
        {
            var newlist='<li id="'+ shapeListItems.shape_id +'"  onClick="shapeSelected('+ shapeListItems.shape_id  +')"> Free  <div><img src="images/sh'+ shapeListItems.shape_id+'.png"/></div></li>';
        }
        else if(shapeListItems.status == "paid")
        {
            if(shapeListItems.purchase_stataus == "y")
            {
                var newlist='<li id="'+ shapeListItems.shape_id +'"  onClick="shapeSelected('+ shapeListItems.shape_id  +')"> Purchased  <div><img src="images/sh'+ shapeListItems.shape_id+'.png"/></div></li>';
            }
            else
            {
                var newlist='<li id="'+ shapeListItems.shape_id +'"  onClick="shapePurchase('+ shapeListItems.shape_id  +')"> Paid  <div><img src="images/sh'+ shapeListItems.shape_id+'.png"/></div></li>';
            }
        }
        $('#shapes').append(newlist);
        
    }
    
}


/* 	End Choose Shape from local Parsing    */

/* 	Start Choose Shape from Web Parsing    */
function chooseShapeServer()
{
    $.ajax(
           {
           type: "POST",
           url: "http://www.polussoftware.com/puzzlepics/shape_screen.php?deviceId="+ device_id,
           data: "",
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(msg) {
           parseShape(msg);
           },
           error: function() {
           alert('error');
           }
           });
}

function parseShape(msg)
{
    $('.progressBar').hide();
    //  alert(msg);
    $("#shapes").empty();
    $.each(msg.data, function(key,value)
           {
           //alert("id " + value.id);
           if(value.status == "free")
           {
           if( value.id == "60" || value.id == "70" || value.id == "80" || value.id == "90" || value.id == "100" || value.id == "110" || value.id == "120" )
           {
           var newlist='<li id="'+ value.id +'"  onClick="shapeSelected('+ value.id  +')"> Free test <div><img src="images/sh2.png"/></div></li>';
           }
           else
           var newlist='<li id="'+ value.id +'"  onClick="shapeSelected('+ value.id  +')"> Free  <div><img src="images/sh'+ value.id +'.png"/></div></li>';
           }
           else if( value.status == "paid" )
           {
           if(value.purchased_status == "y")
           {
           if( value.id == "60" || value.id == "70" || value.id == "80" || value.id == "90" || value.id == "100" || value.id == "110" || value.id == "120" )
           {
           var newlist='<li id="'+ value.id +'"  onClick="shapeSelected('+ value.id  +')"> Purchased test  <div><img src="images/sh2.png"/></div></li>';
           }
           else
           var newlist='<li id="'+ value.id +'"  onClick="shapeSelected('+ value.id  +')"> Purchased  <div><img src="images/sh'+ value.id +'.png"/></div></li>';
           }
           else if(value.purchased_status == "n")
           {
           if( value.id == "60" || value.id == "70" || value.id == "80" || value.id == "90" || value.id == "100" || value.id == "110" || value.id == "120" )
           {
           var newlist='<li id="'+ value.id +'"  onClick="shapePurchase('+ value.id  +')"> Paid test <div><img src="images/sh2.png"/></div></li>';
           }
           else
           var newlist='<li id="'+ value.id +'"  onClick="shapePurchase('+ value.id  +')"> Paid <div><img src="images/sh'+ value.id +'.png"/></div></li>';
           }
           }
           $('#shapes').append(newlist);
           })
}

function shapeSelected(id)
{
    window.localStorage.setItem("Puzzle_ShapeId",id);
    
    db.transaction(getImagesFromId, transaction_error);
    $('.settingsPage,.imgSelectPage,.homePage,.chooseShapePage,.loginPage,.registerPage').hide();
    $('.gamePage').show();
}

/* 	End Choose Shape from Web Parsing    */

/* Start in App billing  */
var strResult = "";
function successHandler (result) {
    
    if(typeof result === 'object')
    {
        //alert("SUCCESS result  : \r\n"+ result );
        window.localStorage.setItem("initresult",result);
        strResult = JSON.stringify(result);
    }
    else
    {
        strResult = result;
    }
    //alert("SUCCESS purchase : \r\n"+strResult );
    window.localStorage.setItem("initPurchase",strResult);
    db.transaction(updateShapes, transaction_error);
    sendPurchaseStatus(strResult);
    
}

function successHandlerImage (result) {
    if(typeof result === 'object')
    {
        //alert("SUCCESS result  : \r\n"+ result );
        window.localStorage.setItem("initresult",result);
        strResult = JSON.stringify(result);
    }
    else
    {
        strResult = result;
    }
    //alert("SUCCESS purchase : \r\n"+strResult );
    window.localStorage.setItem("initPurchase",strResult);
    db.transaction(updateImages, transaction_error);
    ImagePurchaseStatus(strResult);
}

function updateShapes(tx)
{
    var status = "y";
    tx.executeSql("UPDATE shapeList SET purchase_stataus ='" + status +"' WHERE shape_id = '"+ strResult +"' ;", [],   updateCB, errorCB);
}

function updateImages(tx)
{
    var status = "y";
    tx.executeSql("UPDATE imageListParsed SET purchase_stataus ='" + status +"' WHERE row_id = '"+ strResult +"' ;", [],   updateCB, errorCB);
}

function updateCB(tx)
{
}

function errorCB(err)
{
    alert("Error processing SQL: " + err.code);
}

function sendPurchaseStatus(strResult)
{
    
    Url = "http://www.polussoftware.com/puzzlepics/purchase_shape.php?deviceId="+ device_id +"&shapeId=" + strResult +"&purchaseId=";
    $.ajax(
           {
           type: "POST",
           url: Url,
           data: "",
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(msg) {
           parseShape(msg);
           
           },
           error: function() {
           alert('error');
           }
           });
}

function ImagePurchaseStatus(strResult)
{
    
    Url = "http://www.polussoftware.com/puzzlepics/purchase_image.php?deviceId="+ device_id +"&imageId="+ strResult +"&purchaseId=";
    $.ajax(
           {
           type: "POST",
           url: Url,
           data: "",
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(msg) {
           db.transaction(getImagesFromDB, transaction_error);
           
           },
           error: function() {
           alert('error');
           }
           });
}

function successInit(result) {
    var strResult = "";
    if(typeof result === 'object') {
        strResult = JSON.stringify(result);
    } else {
        strResult = result;
    }
    //alert("SUCCESS init : \r\n"+strResult );
    window.localStorage.setItem("initLoading",strResult);
    
}

function errorHandler (error) {
    alert("Check your internet Connection");
}

// Click on init button
function init(){
    // Initialize the billing plugin
    inappbilling.init(successInit, errorHandler);
}

// Click on purchase button
function shapePurchase(id){
    // make the purchase
    inappbilling.buy(successHandler, errorHandler,id);
    
}

// Click on purchase button
function imagePurchase(id){
    // make the purchase
    inappbilling.buy(successHandlerImage, errorHandler,id);
    
}

// Click on ownedProducts button
function ownedProducts(){
    // Initialize the billing plugin
    inappbilling.getPurchases(successHandler, errorHandler);
    
}

// Click on Consume purchase button
function consumePurchase(){
    
    inappbilling.consumePurchase(successHandler, errorHandler, id);
}

// Click on subscribe button
function subscribe(){
    // make the purchase
    inappbilling.subscribe(successHandler, errorHandler,"infinite_gas");
    
}


/* End in App billing  */

/* Start Recived token */

$('#reciviedToken').click( function(e){
                          console.log("reciviedToken")
                          //$('.settingsPage,.chooseShapePage,.gamePage,.loginPage,.registerPage,.imgSelectPage').hide();
                          $('.recivied').show();
                          $('.popUpCov').show();
                          });

$('#downloadImage').click( function(e){
                          //$('.progressBar').show();
                          // downloadImage();
                          var tokenValue = document.getElementById("token").value;
                          
                          Url = "http://www.polussoftware.com/puzzlepics/popup_screen.php?Token=" + tokenValue;
                          $.ajax(
                                 {
                                 type: "POST",
                                 url: Url,
                                 data: "",
                                 contentType: "application/json; charset=utf-8",
                                 dataType: "json",
                                 success: function(result) {
                                 $('.progressBar').show();
                                 recivedImage(result);
                                 },
                                 error: function()
                                 {
                                 alert('Check your Internet connection!');
                                 }
                                 });
                          
                          function recivedImage(result)
                          {
                          
                          $.each(result.data, function(key,value)
                                 {
                                 
                                 if( value.id == "invalid token")
                                 {
                                 alert("Please enter a valid token!");
                                 }
                                 else
                                 {
                                 // alert("url " +value.image_url );
                                 URL_image = "http://www.polussoftware.com/puzzlepics/"+value.image_url;
                                 downloadImage();
                                 }
                                 })
                          }
                          });


/* End Recived token */

/* Start Image parsed form the server */
var jsonLenth = 0;
var count = 0;
function imageParsing()
{
    var row_id;
    $('.progressBar').show();
    if((window.localStorage["Puzzle_server_image_id"] == undefined) || (window.localStorage["Puzzle_server_image_id"] == null))
    {
        row_id = "0";
        checkInternetImageParsing(row_id);
    }
    else
    {
        db.transaction(getRowID, transaction_error);
    }   
    
        
       /* Url = "http://www.polussoftware.com/puzzlepics/image_display.php?deviceId="+ device_id +"&rowId="+ row_id;
        
        var networkState = navigator.connection.type;
        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        
        if(states[networkState] == "Unknown connection" || states[networkState] == "No network connection")
        {
            alert("Check your Internet connection!")
        }
        else
        {
            $.ajax(
                   {
                   type: "POST",
                   url: Url,
                   data: "",
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   success: function(result) {
                   selectImageSuccess(result);
                   
                   },
                   error: function() {
                   $('.progressBar').hide();
                   alert('123 error');
                   }
                   });
        }*/
}


function getRowID(tx)
{
    var sql = "SELECT MAX(row_id) FROM imageListParsed";
    tx.executeSql(sql, [], getRowID_success);
}

function getRowID_success(tx, results)
{
    $('#busy').hide();
    var len = results.rows.length;
    var c = len - 1;
    alert("len " + len);
    var imageListItems = results.rows.item(c);
    var row_id = imageListItems.row_id;
    checkInternetImageParsing(row_id);
    
}

function checkInternetImageParsing(row_id)
{
    var networkState = navigator.connection.type;
    
				var states = {};
				states[Connection.UNKNOWN]  = 'Unknown connection';
				states[Connection.ETHERNET] = 'Ethernet connection';
				states[Connection.WIFI]     = 'WiFi connection';
				states[Connection.CELL_2G]  = 'Cell 2G connection';
				states[Connection.CELL_3G]  = 'Cell 3G connection';
				states[Connection.CELL_4G]  = 'Cell 4G connection';
				states[Connection.CELL]     = 'Cell generic connection';
				states[Connection.NONE]     = 'No network connection';
    
				if(states[networkState] == "Unknown connection" || states[networkState] == "No network connection")
                {
                    if(row_id == 0)
                    {
                        alert("Check your Internet connection!")
                    }
                    else
                    {
                        db.transaction(getImagesFromDB, transaction_error);
                    }
                }
                else
                {
                    imageParsingFromServer(row_id);
                }
}

function imageParsingFromServer(row_id)
{
    Url = "http://www.polussoftware.com/puzzlepics/image_display.php?deviceId="+ device_id +"&rowId="+ row_id;
    $.ajax(
           {
           type: "POST",
           url: Url,
           data: "",
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(result) {
           selectImageSuccess(result);
           },
           error: function() {
           ('.progressBar').hide();
           console.log("Image Parsing From Server Error")
           }
           });
}

function selectImageSuccess(result)
{
    if(result != "null")
    {
        jsonLenth = result.data.length;
        $.each(result.data, function(key,value)
        {
           console.log("value.id " + value.id);
           console.log("value.URl " + value.image_url);
           var URL = "http://www.polussoftware.com/puzzlepics/"+value.image_url;
           DownloadImageFile(URL, "Folder_Name", value.image_name,value.id,value.status,value.purchase_status);
        })
    }
				//db.transaction(getImagesFromDB, transaction_error);
}

function DownloadImageFile(URL, Folder_Name, File_Name,server_row_id,image_status,purchase_status) {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    if(states[networkState] == "Unknown connection" || states[networkState] == "No network connection")
    {
        alert("Check your Internet connection!")
    }
    else
    {
        downloadImage(URL, Folder_Name, File_Name,server_row_id,image_status,purchase_status); //If available download function call
    }
    
}

function downloadImage(URL, Folder_Name, File_Name,server_row_id,image_status,purchase_status) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
    function fileSystemSuccess(fileSystem)
    {
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
        var path = cordova.file.dataDirectory  + File_Name + "." + ext;
   	    filetransfer(download_link, path,server_row_id,image_status,purchase_status);
    }
    
    function fileSystemFail(evt)
    {
        alert(evt.target.error.code);
    }
}

function filetransfer(download_link, fp,server_row_id,image_status,purchase_status) {
    var fileTransfer = new FileTransfer();
    fileTransfer.download(download_link, fp,
                          function(entry) {
                          
                          var Puzzle_server_image_path = cordova.file.dataDirectory + entry.fullPath;
                          console.log("row_id " +server_row_id  );
                          console.log("status " +image_status );
                          window.localStorage.setItem("Puzzle_server_image_id",server_row_id);
                          
                          db.transaction( function(tx)
                                         {	tx.executeSql("INSERT INTO imageListParsed (row_id, image_path, status, purchase_status) VALUES ('" + server_row_id + "','" + Puzzle_server_image_path + "','" + image_status + "','" + purchase_status + "');", [],   insertCB, errorCB);
                                         }, transaction_error);
                          
                          console.log("download complete: " + entry.fullPath);
                          },
                          function(error) {
                          console.log("download error source " + error.source);
                          console.log("download error target " + error.target);
                          console.log("upload error code" + error.code);
                          },
                          false,
                          {
                          headers: {
                          "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                          }
                          }
                          );
}

/*function insertingImages(tx)
 {
 
 tx.executeSql("INSERT INTO imageListParsed (row_id, image_path, status, purchase_status) VALUES ('" + Puzzle_server_image_id + "','" + Puzzle_server_image_path + "','" + Puzzle_server_image_status + "','" + Puzzle_server_image_purchase_status + "');", [],   insertCB, errorCB);
 }*/
function insertCB(tx)
{
    count = count + 1;
    if(jsonLenth == count)
    {
        db.transaction(getImagesFromDB, transaction_error);
    }
}

function getImagesFromDB(tx) {
    $("#galleryPaidlList").empty();
    $("#galleryAvilabelList").empty();
    var sql = "select row_id, image_path, status, purchase_status from imageListParsed ";
    tx.executeSql(sql, [], getImagesServer_success);
}

function getImagesServer_success(tx, results) {
    //$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
        var imageListItems = results.rows.item(i);
        // var newlist='<li><a href="#" onClick="ImageClick(' + imageListItems.server_id + ')"><img src="puzzlepictures/' + imageListItems.picture + '"/> </a></li>';
        // $('#galleryAvilabelList').append(newlist);
        
        if(imageListItems.status == "Free")
        {
            var newlist='<li><a href="#" onClick="ImageClick(' + imageListItems.row_id + ')"><img src="' + imageListItems.image_path + '"/> </a></li>';
            $('#galleryAvilabelList').append(newlist);
        }
        else if(imageListItems.status == "Paid")
        {
            if(imageListItems.purchase_status == "Y")
            {
                var newlist='<li><a href="#" onClick="ImageClick(' + imageListItems.row_id + ')"><img src="' + imageListItems.image_path + '"/> </a></li>';
            }
            else if(imageListItems.purchase_status == "N")
            {
                var newlist='<li><a href="#" onClick="imagePurchase('+ imageListItems.row_id +')"><img src="' + imageListItems.image_path + '"/> </a></li>';
            }
            $('#galleryPaidlList').append(newlist);
        }
    }
    $('.progressBar').hide();
    $('.settingsPage,.chooseShapePage,.homePage,.gamePage,.loginPage,.registerPage').hide();
    $('.imgSelectPage').show();
}
/* End Image parsed form the server */
