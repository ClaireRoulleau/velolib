/* ---------------------------------------- */
/* ==            canva                      */
/*---------------------------------------- */

class SignatureCanvas {

    // Nous allons commencer par établir quatre auditeurs d'événements. Nous avons besoin de savoir quand la souris est appuyée, en haut, déplacée ou cliquée hors de la page. 
    //Afin de garder une trace de nos mouvements de souris, nous avons besoin d'une variable booléenne. Je l'appellerai drawing et commencerai par le définir sur false. 
    mousePos = { //POSITION DE LA SOURIS
        x: 0,
        y: 0
    };

    lastPos = this.mousePos;

    constructor(){
        this.canvas = this.getCanvas(document, "#sig-canvas");
        this.context = this.getContextFrom(this.canvas);
        this.signature = false;
        this.drawing = false;

       this.attachListeners();
        
        //window.requestAnimFrame(this.drawLoop);
        //this.renderCanvas(context);
        //this.drawLoop();
    }

    // drawLoop(){
    //     window.requestAnimFrame(this.drawLoop);
    //     this.renderCanvas();
    // }

    getCanvas(document, selector){
        var canvas = document.querySelector(selector);
        canvas.width = 300;
        canvas.height = 150;

        return canvas;
    }

    getContextFrom(canvas){
        var context = canvas.getContext("2d"); //Une fois qu'on a le canvas, il faut accéder à ce qu'on appelle son contexte, avec getContext().
        context.strokeStyle = "#222222"; //stroke est une forme vide pourvue d'un contour
        context.lineWith = 2; //Comme il s'agit d'un contour, il est possible de choisir l'épaisseur à utiliser. Cela se fait avec la propriété lineWidth 
        return context;
    }

    // Draw to the canvas
    //les chemins vont nous permettre de creer des lignes, la création de chemin se fait par étape successive 
    renderCanvas() {
        if (this.drawing) {
            this.context.moveTo(this.lastPos.x, this.lastPos.y); //moveto est le pt de depart 2 parametres = coordonnes du point par rapport au bord à haut à gauche
            this.context.lineTo(this.mousePos.x, this.mousePos.y); //line to est le point final  
            this.context.stroke(); // stroke permet de realiser le traçé entre les 2 points lineto et moveto
            this.lastPos = this.mousePos;
        }
    }   

    attachListeners(){
        var source = this;

        this.canvas.addEventListener("mousedown", function (e) { //mousedown est déclenché lorsqu'une souris est pressé sur un élément, /pour activer le mode de dessin
            source.drawing = true;
            source.signature = true;
            source.lastPos = source.getMousePos(source.canvas, e); //POSITION DE LA SOURIS AVEC DEUX PARAMETRES
        }, false); //return false pour stopper la propagation de event

        this.canvas.addEventListener("mouseup", function (e) { //mouseup est déclenché quand un dispositif de pointage est relâché au dessus d'un élément./pour désactiver le mode de dessin
            source.drawing = false;
        }, false);

        this.canvas.addEventListener("mousemove", function (e) { //mousemove se déclenche lorsque la souris se déplace alors qu'elle est au dessus d'un élément./pour basculer la position de la souris, utilisée en dessin
            source.mousePos = source.getMousePos(source.canvas, e);
        }, false);

        this.canvas.addEventListener("touchstart", function (e) { //est déclenché lorsqu'un ou plusieurs points tactiles sont placés sur la surface tactile.
            source.mousePos = getTouchPos(source.canvas, e); //POSITION DE LA SOURIS = 
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });

            this.canvas.dispatchEvent(mouseEvent);
        }, false);

        this.canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            this.canvas.dispatchEvent(mouseEvent);
        }, false);

        this.canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        }, false);
    }

    onClick(confirmationCallback){
       var source = this;
        this.canvas.addEventListener('click', function () {
            console.log(source.signature);
            if (source.signature == true) {
                confirmationCallback();
            }
        });
    }

    // Get the position of the mouse relative to the canvas
    //ETABLIR FUNCTION POUR DETERMINER LA POSITION DE LA SOURIS DS LE CANVAS
    getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect(); //Element.getBoundingClientRect() renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage (viewport).CONTIENT 2 proprietes top et left. 

        return {
            x: mouseEvent.clientX - rect.left, //Comme la position de la souris que vous obtenez est relative par rapport à la fenêtre du client, vous devez soustraire la position de l’élément canvas pour le convertir par rapport à l’élément lui-même.
            //RECT est la taille du est la position de l'element par rapport au viewport.MOUSSE EVENT EST LA OU ON CLIQUE
            y: mouseEvent.clientY - rect.top

        };
    }
}

// Get a regular interval for drawing to the screen
/* La méthode requestAnimFrame permet de synchroniser l'affichage dans le canvas avec le  navigateur. La fonction callback est appelée régulièrement (toutes les 60ms) par la fonction setTimeout. 
 */
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Prevent scrolling when touching the canvas
//empêcher le défilement sur document.body si la cible d’un événement tactile est le canevas.
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
        e.stopPropagation();

    }
}, false);

document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
        e.stopPropagation();

    }
}, false);

document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
        e.stopPropagation();

    }
}, false);

export default SignatureCanvas