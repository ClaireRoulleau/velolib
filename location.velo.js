import ReservationTimer from "./timer.js"
import SignatureCanvas from "./canvas.js"

/* ---------------------------------------- */
/* ==            slider                    */
/*---------------------------------------- */

let sliderImages = document.querySelectorAll(".slide"),
    btnLeft = document.querySelector("#prevBtn"),
    //btnLeft = document.getElementsByClassName(".sliderBtn")[1];
    btnRight = document.querySelector("#nextBtn"),
    current = 0; //image qu'on regarde

function reset() {
    for (let i = 0; i < sliderImages.length; i++) {
        sliderImages[i].style.display = "none";
    }
}

//  commencer slider
function startSlide() {
    reset(); //DISPARAITRE TT LES IMAGE
    sliderImages[0].style.display = "block"; // FAIRE APPARAITRE 1er image
    current = -1;
}

//  prev
function slideLeft() {
    reset();
    sliderImages[current - 1].style.display = "block";
    current--;
}

// suivant
function slideRight() {
    reset();
    sliderImages[current + 1].style.display = "block";
    current++;
}

// btn prev
btnLeft.addEventListener("click", function () {
    if (current === 0) {
        current = sliderImages.length;
    }
    slideLeft();
});

// btn suivant
btnRight.addEventListener("click", function () {
    if (current === sliderImages.length - 1) {
        current = -1;
    }

    slideRight();
});

let animationId;
let lastSlide = sliderImages.length - 1; //index dernier element


function animationImage() {

    if (current === lastSlide) { //SI L IMAGE ACTUEL EST LA DERNIERE ALORS
        startSlide();
        // c'est ici que je m'arrache les cheveux!!!! car il s'arrête ici, j'arrive pas à incrementer d'un nbre puisque c'est une fonction
    }
    if (current != lastSlide) {
        slideRight();
    }
}

animationId = setInterval(animationImage, 2000);



//BOUTON 

let pauseBtn = document.getElementById('stopBtn');
let pause = false; // arreter (true) demarrer (false)


pauseBtn.addEventListener('click', function () {
    if (!pause) {
        clearInterval(animationId);
        pauseBtn.textContent = "démarrer";
    } else {
        animationId = setInterval(animationImage, 2000);
        pauseBtn.textContent = "Pause";
    }
    pause = !pause;

});


/* ---------------------------------------- */
/* ==            map                        */
/*---------------------------------------- */



class map {
    constructor() {
        this.setup();
    }

    setup() {

        //CREATION DE LA MAP SOURCE: LEAFLET.js

        //AJOUTER COORDONEE de lyon+ zoom
        let mymap = L.map('mapId').setView([45.764, 4.8357], 13);

        //INTEGRATION MAP
        let tileStreet = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiY2xhcmlsbG9uIiwiYSI6ImNqdnRjbXoxbDBrMmQ0OXA0d3B6aGN5NHEifQ.3s6qFv2klCkw9Qm4dQP9RA',
        });
        tileStreet.addTo(mymap);

        let urlJcDecaux = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=';
        let apiKey = '11286d703cd72dac885956a1f481ce0ad70098a4';

        ajaxGet(urlJcDecaux + apiKey, function (response) {
            //FAIRE UN APPEL AJAX GET POUR AFFICHER LES DONNEES

            let stations = JSON.parse(response); //CONVERTIR TEXTE JSON EN VARIABLE : tableau objet qui contient tt les infos

            stations.forEach(function (station) {

                //CREER UNE METHODE AVEC FOR EACH POUR RECUPER LES NOMS ET ADRESSES DE TT LES STATIONS
                let adress = station.address;
                let available_bikes = station.available_bikes;
                let name = station.name;
                let position = station.position;
                let lat = position.lat;
                let lng = position.lng;
                let status = station.status;


                // creation objet pour marker color 
                let IconByke = L.Icon.extend({
                    color: {
                        iconSize: [30, 30],
                    }
                });

                // couleurs icons
                let iconGreen = new IconByke({
                    iconUrl: "marker_green.png"
                });
                let iconRed = new IconByke({
                    iconUrl: "marker_red.png"
                });

                // initialiser variable let iconDisplay pour l'utiliser dans condition
                let iconDisplay = "";

                if (station.statut === "CLOSED" || station.available_bikes === 0) {
                    iconDisplay = iconRed;

                } else {
                    iconDisplay = iconGreen;
                }

                let marker = L.marker([position.lat, position.lng], {
                    icon: iconDisplay
                }).addTo(mymap);
                // let marker = L.marker([position.lat, position.lng]).addTo(mymap); //AFFICHAGE DES markers station code ds doc leaflet.js
                //Je mets l.marker ds une variable pour pouvoir faire le addeventlistener

                document.getElementById('booking').style.display = "none";

                //comment faire apparaitre station dans div conteneur? creer element à chaque clic

                marker.addEventListener('click', function () {

                    booking.style.display = "block";

                    //indiquer le nom
                    let nameMap = document.querySelector('#name_location');
                    document.querySelector('#name_station').removeChild(nameMap);
                    let nameElt = document.createElement('span'); // Création d'un élément div
                    nameElt.id = 'name_location'; // Définition de son identifiant
                    nameElt.textContent = station.name; // Définition de son contenu textuel
                    document.getElementById('name_station').appendChild(nameElt); // Insertion du nouvel élément

                    //indiquer adresse
                    let info = document.querySelector('#info');
                    document.getElementById('adress').removeChild(info);
                    let infoElt = document.createElement('span'); // Création d'un élément div
                    infoElt.id = 'info'; // Définition de son identifiant
                    infoElt.textContent = station.address; // Définition de son contenu textuel
                    document.getElementById('adress').appendChild(infoElt); // Insertion du nouvel élément

                    //indiquer nbre de bike dispo
                    let bikes = document.querySelector('#bikes');
                    document.getElementById('bikes_number').removeChild(bikes);
                    let bikesElt = document.createElement('span'); // Création d'un élément div
                    bikesElt.id = 'bikes'; // Définition de son identifiant
                    bikesElt.textContent = station.available_bikes; // Définition de son contenu textuel
                    document.getElementById('bikes_number').appendChild(bikesElt); // Insertion du nouvel élément

                    //INDIQUER le status
                    let status_station = document.querySelector('#status_station');
                    document.getElementById('status').removeChild(status_station);
                    let statusElt = document.createElement('span'); // Création d'un élément div
                    statusElt.id = 'status_station'; // Définition de son identifiant
                    statusElt.textContent = station.status; // Définition de son contenu textuel
                    document.getElementById('status').appendChild(statusElt); // Insertion du nouvel élément

                    //PERMET DE VERIFIER SI DES VELOS SONT DISPOS
                    if (station.available_bikes === 0) {
                        document.getElementById('form').style.display = "none";
                        document.getElementById('bikes0available').style.display = "block";
                        bikes0available.style.color = "red";

                    } else {
                        form.style.display = "block";
                        bikes0available.style.display = "none";
                    }

                    let keyStations = localStorage.setItem('stations', name);

                }); //FIN FUNCTION FOR EACH

                /* ---------------------------------------- */
                /* ==  formulaire                           */
                /*---------------------------------------- */

                $(document).ready(function () {

                    let $name = $('#name'),
                        $firstName = $('#firstName'),
                        $send_form = $('#send_form');
                    let $field = $('.field');
                    let $mistake = $('#mistake');
                    let $confirmation = $('#confirmation');
                    let $confirmation_booking = $('#confirmation_booking');
                    let $cancel_booking = $('#cancel_booking');
                    let $inProgressPara1 = $('#inProgressPara1');
                    let $inProgressPara2 = $('#inProgressPara2');
                    let $inProgressPara3 = $('#inProgressPara3');



                    $field.keyup(function () {
                        if ($(this).val().length < 3) { // si la chaîne de caractères est inférieure à 3
                            $(this).css({ // on rend le champ rouge
                                borderColor: 'red',
                                color: 'red'
                            });
                        } else {
                            $(this).css({ // si tout est bon, on le rend vert
                                borderColor: 'green',
                                color: 'green'
                            });
                        }
                    });

                    function check(field) {
                        if (field.val() == "") { // si le champ est vide
                            $mistake.css('display', 'block'); // on affiche le message d'erreur
                            field.css({ // on rend le champ rouge
                                borderColor: 'red',
                                color: 'red'

                            });
                            return false;
                        } else {
                            $confirmation.css('display', 'block'); // on affiche la div confirmation
                            $mistake.css('display', 'none'); // on annule le message d'erreur
                            return true;
                        }
                    }

                    $send_form.click(function (e) {
                        e.preventDefault(); // on annule la fonction par défaut du bouton d'envoi


                        // puis on lance la fonction de vérification sur tous les champs :
                        if (check($firstName) == "") { //si il esiste pas on fait un return false
                            return false;
                        } else { ////recuperer et stocke les info du formulaire dans local storage

                            let key = localStorage.setItem('firstName', $firstName.val());
                        }
                        if (check($name) == "") {
                            return false;
                        } else {
                            let keyName = localStorage.setItem('name', $name.val());

                        }

                    }); //FIN SEND FORM BUTTON  

                    $cancel_booking.css('display', 'none');
                    $confirmation_booking.css('display', 'none');

                    $confirmation_booking.click(function (e) {
                        e.preventDefault(); // on annule la fonction par défaut du bouton d'envoi 
                        //SI CANVAS 
                        //SI C EST VRAI JE FAIS APPARAITRE les  SI C EST FAUX JE;;; console.log(canvas.getContext('2d'));
                        let stationsKey = localStorage.getItem('stations'); //RECUPERE SETITEM DS LE LOCAL STORAGE POUR L4 AFFICHER
                        let objStations = JSON.stringify(stationsKey);
                        console.log(objStations);
                        $inProgressPara1.html('Réservation en cours à : ' + objStations); //afficher detail réservation!!!
                        $inProgressPara3.css('display', 'block'); // on affiche la div timer
                        //timer(); //appeler la function timer ds jquery

                        var timer = new ReservationTimer();
                        timer.startTimer(2, 0);
                    });

                    $cancel_booking.click(function (e) {
                        e.preventDefault();
                        clearInterval(timer);
                        localStorage.clear();
                        $inProgressPara3.css('display', 'none');
                        $inProgressPara1.html('Votre réservation a été annulée. A bientôt! ');

                    });

                    DrawCanvas($confirmation_booking, $cancel_booking);

                }); // JQUERY

                window.onload = function () { // FUNCTION LOCAL STORAGE POUR RECUPERER NOM ET PRENOM DS FORMULAIRE
                    let nameKey = localStorage.getItem('name');

                    //let objName = JSON.stringify(nameKey);
                    // console.log(objName);

                    if (nameKey == "null") {
                        nameKey = "";

                    }
                    document.getElementById('name').value = nameKey;
                    let firstNameKey = localStorage.getItem('firstName');

                    //let objFirst = JSON.stringify(firstNameKey);
                    if (firstNameKey == "null") {
                        firstNameKey = "";
                    }
                    document.getElementById('firstName').value = firstNameKey; //ON AASIGNE OBJFIRST à LA VALEUR DE FIRSTNAME

                }

            }); //FIN ADDEVENTLISTENER SUR LES MARKERS
        }); //FIN AJAX GET
    }
}
new map();

function DrawCanvas(confirmation, cancel){
    var canvas = new SignatureCanvas();
    
    canvas.onClick(function(){
        confirmation.css('display', 'block');
        cancel.css('display', 'block');
        console.log(canvas.signature);
    });

    (function drawLoop() {
        requestAnimFrame(drawLoop);
        canvas.renderCanvas();
    })();
}
