
/*TO DO / TO FIX:
-hide log-in when the user is conected and hide log-out when the user is not conected

-add button to go to the bottom of the chat (only visible when NOT at the bottom)

-add list of players from all teams (team details?)

-add chat-rooms, the general + one every team

-add more design at the index or keep it minimal???*/

$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "https://api.myjson.com/bins/1dmk4b",
        "success": function (json_app) {
            var data = json_app;
            console.log("app info", data);
//            navActive()
            setUpButtons();
            addGamesMonth(data);
            addLocations(data);
            addResults(data);
            
        },
        "error": function (data) {
            console.log("error", data);
        }
    });
});

function setUpButtons() {
    $("[data-button]").click(function clickButton(){
        var buttonClick = this.getAttribute("data-click");
        $("[data-page]").addClass("hidden");
        $("#" + buttonClick).removeClass("hidden");
        $("#buttonsId").removeClass("hidden");
        $(document).scrollTop(0);
//        $("body").css({"paddingTop": 50 + "px"});
//        $("body").css({"paddingBottom": 55 + "px"});
        $(".divLocation").removeClass("hidden");
    });
}

//function navActive() {
//    var navbut = document.getAttribute("data-click");
//    var divId = document.getAttribute("data-page");
//    
//    if($("#index").hasClass("hidden") != true) {
//        
//    } else if (navbut == divId) {
//        ().addClass("active");
//    }
//}


// parametros y argumentos de funciones
//Function arguments (parameters) work as local variables inside functions


// NEXT GAMES
function addGamesMonth(data) {
    var nextGamesData = data.next_games;
    var infoNextGames = document.getElementById("infoGamesFirstMonth");
    infoNextGames.innerHTML = ""

    var div = document.createElement("div");
    div.setAttribute("class", 'divGames')
    infoNextGames.append(div);

    for (var i = 0; i < nextGamesData.length; i++) {
        
        var team12 = document.createElement("h4");
        var team12Info = data.next_games[i].team_a + " " + "vs" + " " + data.next_games[i].team_b;
        team12.append(team12Info);
        div.append(team12);

        var stadium = document.createElement("p");
        stadium.setAttribute("class", 'highlight')
        var stadiumInfo = data.next_games[i].stadium;
        stadium.append(stadiumInfo);
        div.append(stadium);
        
        var month = document.createElement("p");
        month.setAttribute("class", 'bold')
        var monthInfo = data.next_games[i].month + ":";
        month.append(monthInfo);
        div.append(month);

        var date = document.createElement("p");
        var dateInfo = data.next_games[i].date;
        date.append(dateInfo);
        div.append(date);
        
        stadium.setAttribute("data-namestadium", stadiumInfo);

        // MOSTRAR SOLO UNA LOCALIZACIÓN
        stadium.addEventListener("click", function(){
            var locationName = this.getAttribute("data-namestadium");
            showLocation(locationName);
            $("#nextgame").addClass("hidden");
        });
    }
}

// MOSTRAR SOLO UNA LOCALIZACIÓN 
function showLocation(locationName){
    $(".divLocation").addClass("hidden");
    var locationToShow = $("#infoLocations").find("div[data-namestadium='" + locationName + "']");
    
    locationToShow.removeClass("hidden");
    $("#location").removeClass("hidden");
}

// LOCATIONS
function addLocations(data) {
    var infoLocations = document.getElementById("infoLocations");
    infoLocations.innerHTML = "";

    for (var i = 0; i < data.locations.length; i++) {
        
        var divLocation = document.createElement("div");
        divLocation.setAttribute("class", 'divLocation')
        
        var stadName = document.createElement("h4");
        var stadNameInfo = data.locations[i].name;
        stadName.append(stadNameInfo);

        var place = document.createElement("p");
        var placeInfo = data.locations[i].place;
        place.append(placeInfo);

        var mapInfo = data.locations[i].url;
        var map = document.createElement("iframe");
        map.setAttribute("src", mapInfo);
        
        divLocation.setAttribute("data-namestadium", stadNameInfo);
        
        divLocation.append(stadName, place, map);
        infoLocations.append(divLocation);
    }
}

// RESULTS
function addResults(data) {
    var infoResults = document.getElementById("infoResults");
    infoResults.innerHTML = ""

    for (var i = 0; i < 6; i++) {
        var div = document.createElement("div");
        div.setAttribute("class", 'divResults')
        infoResults.append(div);
        
        var team12 = document.createElement("h4");
        var team12Info = data.past_games[i].team_a + " " + "vs" + " " + data.past_games[i].team_b;
        team12.append(team12Info);
        div.append(team12);

        var date = document.createElement("p");
        var dateInfo = data.past_games[i].date;
        date.append(dateInfo);
        div.append(date);

        var result = document.createElement("p");
        var resultInfo = "Result:" + " " + data.past_games[i].result;
        result.append(resultInfo);
        div.append(result);
    }
}

// LOGIN + CHAT
document.getElementById("login").addEventListener("click", login);
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("createPost").addEventListener("click", writeNewPost);

// SIGN IN OR SIGN OUT
firebase.auth().onAuthStateChanged(function (user) {
    console.log("user",user);
    if (user != null) {
        console.log("You are logged in");
        getPosts();
        removeDisabled();
    } else {
        console.log("You are logged out");
    $("#posts").hide();
        addDisabled();
    }
})

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    $("#posts").show();
    removeDisabled();
}

function logout() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signOut();
    $("#posts").hide();
    addDisabled();
}

//ENVIAR POST
function writeNewPost() {
    var text = document.getElementById("textInput").value;
    $("#textInput").val("");
    
    if (firebase.auth().currentUser == null) {
        alert("You must be logged in to be able to chat");
        addDisabled();
    } else if (text == "") {
        alert("Can't sent a blank post");
    } else if (text != "" && firebase.auth().currentUser != null ) {
        removeDisabled();
        var userName = firebase.auth().currentUser.displayName;
        
    var postData = {
        name: userName,
        body: text
    };
    
    console.log("post", postData);

    var newPostKey = firebase.database().ref().child('post or something').push().key;
    var uptdates = {};
    uptdates[newPostKey] = postData;
    firebase.database().ref().child('post or something').update(uptdates);
    }
    scroll();
}

// ENVIAR POST AL DAR ENTER
document.getElementById("textInput").addEventListener("keydown", function (event) {
    if (event.which == 13) {
        writeNewPost();
    }
});

// SCROLL DOWN AL ENVIAR POST
function scroll() {
    window.scrollTo(0,document.body.scrollHeight);
}

// CREAR POST
function getPosts() {
    //on = addeventlistener
    firebase.database().ref().child('post or something').on('value', function (data) {
        
        var posts = data.val();
        var logs = document.getElementById("posts");
        logs.innerHTML = "";

        for (var key in posts) {
            var text = document.createElement("div");
            text.setAttribute("class", 'textClass');
            var element = posts[key];
            
            logs.append(text);
            
            var name = document.createElement("p");
            name.setAttribute("id", 'nameId');
            name.textContent = element.name + " said:";
            
            text.append(name);
            
            var textBody = document.createElement("p");
            textBody.setAttribute("id", 'textBodyId');
            textBody.textContent = element.body;
            
            text.append(textBody);
            
            var userName = firebase.auth().currentUser.displayName; 
            
            if (userName == element.name){
                text.classList.add("messageRight");
                textBody.classList.add("textBodyRight");
            } else {
                text.classList.add("messageLeft");
                textBody.classList.add("textBodyLeft");
            }
        }
    });
}

function addDisabled(){
    $("#textInput").attr("disabled", "disabled");
    $("#createPost").attr("disabled", "disabled");
}

function removeDisabled(){
    $("#textInput").removeAttr("disabled", "disabled");
    $("#createPost").removeAttr("disabled", "disabled");
}