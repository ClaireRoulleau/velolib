
class ReservationTimer{

     startTimer(minutes, seconds){
        
        setInterval(function () {
            var time = minutes + " : " + seconds;
            document.getElementById("timer").innerHTML = time;

            if (seconds == 0o0) {
                if (minutes != 0) {
                    minutes--;
                    seconds = 59;
                    if (minutes < 2) {
                        minutes = minutes;
                    }

                }
            } else {
                seconds--;
                if (seconds < 10) {
                    seconds = seconds;
                }


            }
            if (seconds <= 0 && minutes == 0) {
                document.getElementById("inProgressPara3").textContent = "Votre réservation a éxpirée. A bientôt";
            }

        },
        1000)
    }
}

export default ReservationTimer