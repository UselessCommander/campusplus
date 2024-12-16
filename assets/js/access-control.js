document.addEventListener("DOMContentLoaded", function() {
    // Når DOM'en er fuldt indlæst, kontrolleres, om URL'en indeholder en 'token' parameter.
    if (window.location.search.includes('token=')) {
        checkTokenAccess(); // Hvis der er en token, kaldes funktionen, der tjekker tokenens gyldighed.
    } else {
        checkAccess(); // Hvis der ikke er en token, kaldes funktionen, der tjekker for tidligere adgang via localStorage.
    }
});

// Funktion til at tjekke adgang via token i URL'en
function checkTokenAccess() {
    // Henter parametrene fra URL'en
    const urlParams = new URLSearchParams(window.location.search); 
    // Henter værdien af 'token' fra URL'en
    const token = urlParams.get('token'); 
    // Den gyldige token, der kræves for at få adgang
    const validToken = 'e8fhx9j3wqp4'; 

    // Sammenligner token fra URL'en med den gyldige token
    if (token === validToken) {
        localStorage.setItem('accessGranted', 'true'); // Hvis tokenen matcher, gives adgang, og værdien gemmes i localStorage
        console.log('Token godkendt. Adgang bevilget.'); // Log besked, der angiver adgang er givet
    } else {
        console.log('Ugyldigt token eller ingen token i URL'); // Log besked, hvis tokenen er ugyldig eller mangler
        window.location.href = 'https://campus.gabrielvnlausten.dk/no-access.html'; // Omdirigerer til en side, der informerer om manglende adgang
    }
}

// Funktion til at tjekke adgang baseret på tidligere gemt adgangsstatus
function checkAccess() {
    // Henter adgangsstatus fra localStorage
    const accessGranted = localStorage.getItem('accessGranted'); 

    // Hvis der ikke tidligere er givet adgang (adgangsstatus er ikke 'true')
    if (accessGranted !== 'true') {
        console.log('Ingen adgang. Omdirigerer...'); // Log besked, der angiver, at adgang nægtes
        window.location.href = 'https://campus.gabrielvnlausten.dk/no-access.html'; // Omdirigerer brugeren til en "ingen adgang"-side
    } else {
        console.log('Adgang bevilget til denne side.'); // Log besked, der indikerer, at brugeren har adgang
    }
}
