document.addEventListener("DOMContentLoaded", function() {
    // Hent modals, progress bar steps, progress bar lines og navigation knapper
    const modals = document.querySelectorAll(".modal");
    const progressBarSteps = document.querySelectorAll(".progress-bar .step");
    const progressBarLines = document.querySelectorAll(".progress-bar .line");
    const nextButton = document.querySelector(".next-btn");
    const backButtons = document.querySelectorAll(".back-btn");

    // Variabler til at holde styr på den aktuelle modal og den længste, der er besøgt
    let currentModalIndex = 0;
    let maxVisitedIndex = 0;

    // Objekt til at gemme brugerens data undervejs
    const userData = {
        fullName: "",
        email: "",
        tel: "",
        password: "",
        organizationType: "",
        placeName: "",
        kaffe: "",
        mad: "",
        rolle: "",
        foredragChoices: {},
        opgaverChoices: {},
    };

    // Funktion til at vise en specifik modal baseret på index
    function showModal(index) {
        modals.forEach((modal, i) => {
            modal.classList.toggle("active", i === index); // Aktivér kun den valgte modal
        });
        updateProgressBar(index); // Opdatér progress bar
        currentModalIndex = index; 
        maxVisitedIndex = Math.max(maxVisitedIndex, index); // Gem det længste modal index, der er besøgt

        // Hvis den aktuelle modal har en carousel, initialiser den
        const currentModal = modals[currentModalIndex];
        if (currentModal.querySelector(".carousel")) {
            initializeCarousel(currentModal);
        }
    }

    // Funktion til at opdatere progress bar baseret på den aktuelle modal
    function updateProgressBar(index) {
        progressBarSteps.forEach((step, i) => {
            step.classList.toggle("active", i <= index); // Marker aktuelle og tidligere steps
            step.classList.toggle("visited", i <= maxVisitedIndex); // Marker tidligere besøgte steps
        });

        progressBarLines.forEach((line, i) => {
            line.classList.toggle("active", i < index); // Aktivér linjer op til det aktuelle step
        });
    }

    // Funktion til at initialisere en carousel i en modal
    function initializeCarousel(modal) {
        const carousel = modal.querySelector(".carousel"); // Hent carousel
        const items = carousel.querySelectorAll(".carousel-item"); // Hent alle carousel items
        const radioButtons = modal.querySelectorAll('input[name="choice"]'); // Hent radio knapper til valg
        const prevButton = modal.querySelector(".prev-carousel-btn"); // Forrige-knap
        const nextButton = modal.querySelector(".next-carousel-btn"); // Næste-knap
    
        let currentIndex = 0; // Start på første item
    
        // Funktion til at opdatere carousel til det aktuelle index
        function updateCarousel(index) {
            items.forEach((item, i) => {
                item.classList.toggle("active", i === index); // Aktivér kun det valgte item
            });

            currentIndex = index;
            const currentItem = items[currentIndex];
            const currentPlace = currentItem.dataset.id || currentItem.dataset.index; // Hent placering af item
            const choicesKey = modal.id === "modal-opgaver" ? "opgaverChoices" : "foredragChoices"; // Afgør hvilken key der bruges
    
            // Opdatér radio knapper baseret på brugerens tidligere valg
            radioButtons.forEach((radio) => {
                radio.checked = userData[choicesKey]?.[currentPlace] === radio.value;
            });
        }
    
        // Lyt efter ændringer i radio knapper og opdatér brugerens valg
        radioButtons.forEach((radio) => {
            radio.addEventListener("change", () => {
                const currentItem = items[currentIndex];
                const currentPlace = currentItem.dataset.id || currentItem.dataset.index;
                const choicesKey = modal.id === "modal-opgaver" ? "opgaverChoices" : "foredragChoices";
    
                // Gem valget eller fjern det afhængigt af, hvad brugeren vælger
                if (radio.value === "accept") {
                    userData[choicesKey] = userData[choicesKey] || {};
                    userData[choicesKey][currentPlace] = "accept";
                } else if (radio.value === "reject") {
                    delete userData[choicesKey][currentPlace];
                }

                // Log og gem valgene i sessionStorage
                console.log(`Updated ${choicesKey}:`, userData[choicesKey]);
                sessionStorage.setItem(choicesKey, JSON.stringify(userData[choicesKey]));
            });
        });
    
        // Håndtér forrige-knappen i carousel
        prevButton?.addEventListener("click", () => {
            const newIndex = (currentIndex - 1 + items.length) % items.length; // Gå til forrige item
            updateCarousel(newIndex);
        });
    
        // Håndtér næste-knappen i carousel
        nextButton?.addEventListener("click", () => {
            const newIndex = (currentIndex + 1) % items.length; // Gå til næste item
            updateCarousel(newIndex);
        });
    
        updateCarousel(0); // Start carousel med det første item
    }
  


    function saveCurrentData() {
        // Hent den nuværende modal baseret på currentModalIndex
        const currentModal = modals[currentModalIndex];
    
        // Tjek hvilken modal der er aktiv og gem data i userData objektet 
        if (currentModal.id === "modal-1") {
            // Gem brugerens oplysninger fra inputfelterne
            userData.fullName = document.querySelector('input[name="fullName"]').value || "";
            userData.email = document.querySelector('input[name="email"]').value || "";
            userData.tel = document.querySelector('input[name="tel"]').value || "";
            userData.password = document.querySelector('input[name="password"]').value || "";
        } else if (currentModal.id === "modal-2") {
            // Gem data for organisationstype og stednavn
            const orgType = document.querySelector('input[name="organization-type"]:checked');
            userData.placeName = document.querySelector(".place-name").value || "";
        } else if (currentModal.id === "modal-kaffebillet") {
            // Gem kaffevalg og sæt det i sessionStorage
            userData.kaffe = document.querySelector('input[name="kaffe"]:checked')?.value || "";
            sessionStorage.setItem('kaffeValg', userData.kaffe);
        } else if (currentModal.id === "modal-madbillet") {
            // Gem madvalg og sæt det i sessionStorage
            userData.mad = document.querySelector('input[name="mad"]:checked')?.value || "";
            sessionStorage.setItem('madValg', userData.mad);
        } else if (currentModal.id === "modal-rolle") {
            // Gem valgt rolle
            userData.rolle = document.querySelector('input[name="rolle-type"]:checked')?.value || "";
        }
        
        // Gem brugerens opgave- og foredragsvalg i sessionStorage
        sessionStorage.setItem('opgaverChoices', JSON.stringify(userData.opgaverChoices));
        sessionStorage.setItem('foredragChoices', JSON.stringify(userData.foredragChoices));
    }
    
    function populateConfirmationModal() {
        // Udfyld bekræftelsesmodulet med brugerens oplysninger
        document.getElementById("confirmation-name").textContent = userData.fullName || "Ikke angivet";
        document.getElementById("confirmation-email").textContent = userData.email || "Ikke angivet";
        document.getElementById("confirmation-phone").textContent = userData.tel || "Ikke angivet";
        document.getElementById("confirmation-place").textContent = userData.placeName || "Ikke angivet";
    
        // Definition af opgavenavne og foredragsnavne
        const opgaverNavne = {
            "0": "Opsætning",
            "1": "Sociale Medier",
            "2": "Oprydning"
        };
        
        const foredragNavne = {
            "0": "Sygeplejerske Foredrag",
            "1": "Politi Foredrag",
            "2": "Landbrug Foredrag"
        };
    
        // Hent brugerens valgte foredrag og opgaver og konverter dem til tekst
        const selectedForedrag = Object.entries(userData.foredragChoices || {})
            .filter(([_, value]) => value === "accept")
            .map(([key]) => foredragNavne[key] || "Ukendt Foredrag")
            .join(", ") || "Ingen foredrag valgt";
    
        document.getElementById("confirmation-foredrag").textContent = selectedForedrag;
    
        const selectedOpgaver = Object.entries(userData.opgaverChoices || {})
            .filter(([_, value]) => value === "accept")
            .map(([key]) => opgaverNavne[key] || "Ukendt Opgave")
            .join(", ") || "Ingen opgaver valgt";
    
        // Vis brugerens rolle og opgavevalg
        const roleText = userData.rolle === "frivillig"
            ? `Frivillig - ${selectedOpgaver || "Ingen opgaver valgt"}`
            : userData.rolle || "Ikke valgt";
    
        document.getElementById("confirmation-role").textContent = roleText;
    
        // Beregn priser for mad og kaffe
        const madPrice = userData.mad === "accept" ? 25 : 0;
        const kaffePrice = userData.kaffe === "accept" ? 25 : 0;
        const totalPrice = madPrice + kaffePrice;
    
        document.getElementById("confirmation-mad-price").textContent = `${madPrice},00 DKK`;
        document.getElementById("confirmation-kaffe-price").textContent = `${kaffePrice},00 DKK`;
    
        if (userData.rolle === "frivillig") {
            document.getElementById("confirmation-total").textContent = "GRATIS";
        } else {
            document.getElementById("confirmation-total").textContent = `${totalPrice},00 DKK`;
        }
    }
    
    nextButton.addEventListener("click", () => {
        // Gem data fra den nuværende modal
        saveCurrentData();
        const currentModal = modals[currentModalIndex];
    
        if (!currentModal) {
            console.error("Ingen modal fundet ved index:", currentModalIndex);
            return;
        }
    
        if (currentModal.id === "modal-rolle") {
            const selectedRole = document.querySelector('input[name="rolle-type"]:checked')?.value;
    
            if (selectedRole === "frivillig") {
                const opgaverModalIndex = [...modals].findIndex(modal => modal.id === "modal-opgaver");
                if (opgaverModalIndex !== -1) {
                    showModal(opgaverModalIndex);
                } else {
                    console.error("'modal-opgaver' blev ikke fundet!");
                }
            } else if (selectedRole === "leder" || selectedRole === "guest") {
                const confirmationModalIndex = [...modals].findIndex(modal => modal.id === "modal-confirmation");
                if (confirmationModalIndex !== -1) {
                    showModal(confirmationModalIndex);
                    populateConfirmationModal();
                } else {
                    console.error("'modal-confirmation' blev ikke fundet!");
                }
            } else {
                alert("Vælg en rolle for at fortsætte!");
            }
        } else if (currentModal.id === "modal-opgaver") {
            const confirmationModalIndex = [...modals].findIndex(modal => modal.id === "modal-confirmation");
            if (confirmationModalIndex !== -1) {
                showModal(confirmationModalIndex);
                populateConfirmationModal();
            } else {
                console.error("'modal-confirmation' blev ikke fundet!");
            }
        } else if (currentModal.id === "modal-confirmation") {
            const selectedRole = userData.rolle;
    
            if (selectedRole === "frivillig") {
                window.location.href = "mit-overblik.html";
            } else if (selectedRole === "leder" || selectedRole === "guest") {
                window.location.href = "payment.html";
            } else {
                alert("Vælg en rolle for at fortsætte!");
            }
        } else if (currentModalIndex < modals.length - 1) {
            showModal(currentModalIndex + 1);
        } else {
            console.log("Sidste modal nået.");
        }
    });
    
    // Tilføjer event listeners til alle tilbage-knapper (backButtons)
    backButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Tjekker om der er en tidligere modal at navigere til
            if (currentModalIndex > 0) {
                const currentModal = modals[currentModalIndex]; // Henter nuværende modal

                // Hvis brugeren er i "confirmation" modalen, håndteres navigation anderledes
                if (currentModal.id === "modal-confirmation") {
                    const selectedRole = userData.rolle; // Tjekker brugerens rolle

                    // Hvis rollen er "frivillig", navigeres til opgave-modalen
                    if (selectedRole === "frivillig") {
                        const opgaverModalIndex = [...modals].findIndex(modal => modal.id === "modal-opgaver");
                        if (opgaverModalIndex !== -1) {
                            showModal(opgaverModalIndex); // Viser opgave-modalen
                            return;
                        }
                    } else {
                        // Hvis rollen er "leder" eller "gæst", navigeres til rolle-modalen
                        const rolleModalIndex = [...modals].findIndex(modal => modal.id === "modal-rolle");
                        if (rolleModalIndex !== -1) {
                            showModal(rolleModalIndex); // Viser rolle-modalen
                            return;
                        }
                    }
                }

                // Viser den forrige modal i rækken
                showModal(currentModalIndex - 1);
            }
        });
    });

    // Tilføjer event listeners til alle trin i progress bar'en
    progressBarSteps.forEach((step, index) => {
        step.addEventListener("click", () => {
            // Begrænser adgangen til opgave-sektionen for "leder" og "gæst"-roller
            if ((userData.rolle === "leder" || userData.rolle === "guest") && index === progressBarSteps.length - 2) {
                console.warn("Ledere og gæster kan ikke navigere til opgave-sektionen."); // Logger advarsel i konsollen
                return; // Stopper eventet
            }

            // Tjekker, om det valgte trin allerede er besøgt
            if (index <= maxVisitedIndex) {
                showModal(index); // Viser den valgte modal
            }
        });
    });

    // Opdaterer det aktive trin i progress bar'en
    function updateActiveStep(index) {
        const steps = document.querySelectorAll(".step"); // Henter alle trin-elementer
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index); // Tilføjer "active"-klassen til det aktuelle trin
        });
    }

    // Starter med at markere trin 2 som aktivt
    updateActiveStep(2);

    // Tilføjer event listeners til alle kort (cards)
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped"); // Tilføjer/fjerner "flipped"-klassen for at vende kortet
        });
    });

// Venter på, at DOM'en er fuldt indlæst, før koden kører
document.addEventListener("DOMContentLoaded", function() {
    // Henter HTML-elementer, hvor priser skal vises
    const madPriceElement = document.getElementById('mad-price'); // Element til at vise madpris
    const kaffePriceElement = document.getElementById('kaffe-price'); // Element til at vise kaffepris
    const totalPriceElement = document.getElementById('total-price'); // Element til at vise totalpris
    
    // Beregner madprisen baseret på brugerens valg (userData.mad)
    let madPrice = userData.mad === 'accept' ? 25 : 0; 
    // Beregner kaffeprisen baseret på brugerens valg (userData.kaffe)
    let kaffePrice = userData.kaffe === 'accept' ? 25 : 0; 

    // Opdaterer madprisen i HTML-elementet
    madPriceElement.textContent = `${madPrice},00 DKK`;
    // Opdaterer kaffeprisen i HTML-elementet
    kaffePriceElement.textContent = `${kaffePrice},00 DKK`;

    // Beregner totalprisen ved at summere mad- og kaffepriser
    const total = madPrice + kaffePrice;
    // Opdaterer totalprisen i HTML-elementet
    totalPriceElement.textContent = `${total},00 DKK`;
});

// Anden DOMContentLoaded event listener til håndtering af kortinteraktion
document.addEventListener("DOMContentLoaded", () => {
    // Finder kortet i DOM'en med klassen "card"
    const card = document.querySelector(".card");

    // Tilføjer en klik-event listener til kortet
    card.addEventListener("click", () => {
        // Skifter klassen "flipped" for at ændre kortets tilstand (f.eks. vis kortets bagside)
        card.classList.toggle("flipped");
    });
});

// Kalder funktionen "showModal" for at vise den første modal (index 0)
showModal(0);

// Lukker den yderste DOMContentLoaded event listener
});





// Venter på, at DOM'en er indlæst
document.addEventListener("DOMContentLoaded", function () {
    // Henter brugerens valg fra sessionStorage
    const kaffeValg = sessionStorage.getItem("kaffeValg"); // Brugerens valg for kaffe
    const madValg = sessionStorage.getItem("madValg"); // Brugerens valg for mad
    const opgaverValg = JSON.parse(sessionStorage.getItem("opgaverChoices")) || {}; // Valg for opgaver
    const foredragValg = JSON.parse(sessionStorage.getItem("foredragChoices")) || {}; // Valg for foredrag

    // Referencer til HTML-containere, hvor indholdet skal vises
    const kuponContainer = document.getElementById("kupon-container");
    const opgaverContainer = document.getElementById("opgaver-container");
    const foredragContainer = document.getElementById("foredrag-container");
    
    // Liste over kuponer (kaffe og mad)
    const kuponList = [
        { id: "kaffe", name: "Kaffe", image: "Hvidkaffe.png", condition: kaffeValg },
        { id: "mad", name: "Mad", image: "hvidmad.png", condition: madValg },
    ];

    // Gennemgår kupon-listen og viser de accepterede kuponer
    kuponList.forEach((kupon) => {
        if (kupon.condition === "accept") {
            const kuponElement = document.createElement("div");
            kuponElement.classList.add("card-new"); // Tilføjer styling
            kuponElement.style.backgroundColor = "#638C3E"; // Sætter baggrundsfarve
            kuponElement.innerHTML = `
                <div class="coupon-card-content-new">
                    <img src="/assets/images/${kupon.image}" alt="${kupon.name}" class="card-icon-new">
                </div>
            `;
            kuponContainer.appendChild(kuponElement);
        }
    });

    // Liste over mulige opgaver
    const opgaverList = [
        { id: "opsætning", time: "11.00", date: "11.06.25", name: "Opsætning", image: "Hammerslag.png", description: "Medbring vand og godt humør." },
        { id: "socialemedier", time: "13.00", date: "11.06.25", name: "Sociale medier", image: "kontakt.png", description: "Opret opslag om dagens aktiviteter." },
        { id: "oprydning", time: "12.00", date: "11.06.25", name: "Oprydning", image: "Trash can.png", description: "Ryd op efter eventet." }
    ];

    // Viser opgaver, der er accepteret
    opgaverList.forEach((opgave, index) => {
        if (opgaverValg[index] === "accept") { 
            const randomPladser = Math.floor(Math.random() * 80) + 20; // Genererer et tilfældigt antal pladser
            const opgaveElement = document.createElement("div");
            opgaveElement.classList.add("card-new"); // Tilføjer styling
            opgaveElement.innerHTML = `
                <div class="card-header-new">
                    <h3>Opgaver</h3>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- SVG ikon for opgaver -->
                    <path d="..." fill="black"/>
                    </svg>
                </div>
                <div class="card-content-new">
                    <img src="/assets/images/${opgave.image}" alt="${opgave.name}" class="card-icon-new">
                    <div class="card-info-new">
                        <p>kl ${opgave.time}</p>
                        <p>${opgave.date}</p>
                    </div>
                    <div class="card-description-new">
                        <p><strong>${opgave.name}</strong></p>
                        <p><strong>Plads ${randomPladser}</strong> &#x1F7E1;</p>
                        <p>${opgave.description}</p>
                    </div>
                </div>
            `;
            opgaverContainer.appendChild(opgaveElement);
        }
    });
    
    // Liste over mulige foredrag
    const foredragList = [
        { place: "0", time: "09.00", date: "15.06.25", name: "Sygeplejersken", image: "sygeplejerske.png", description: "Livet som sygeplejerske." },
        { place: "1", time: "09.30", date: "15.06.25", name: "Politi", image: "politihat.png", description: "Om politiets arbejde." },
        { place: "2", time: "10.00", date: "15.06.25", name: "Landbrug", image: "farm.png", description: "Grønt landbrug og store maskiner." }
    ];

    // Viser foredrag, der er accepteret
    foredragList.forEach((foredrag) => {
        if (foredragValg[foredrag.place] === "accept") {
            const randomPladser = Math.floor(Math.random() * 80) + 20; // Tilfældige pladser
            const foredragElement = document.createElement("div");
            foredragElement.classList.add("card-new"); // Styling
            foredragElement.innerHTML = `
                <div class="card-header-new">
                    <h3>Foredrag</h3>
                </div>
                <div class="card-content-new">
                    <img src="/assets/images/${foredrag.image}" alt="${foredrag.name}" class="card-icon-new">
                    <div class="card-info-new">
                        <p>kl ${foredrag.time}</p>
                        <p>${foredrag.date}</p>
                    </div>
                    <div class="card-description-new">
                        <p><strong>${foredrag.name}</strong></p>
                        <p><strong>Plads ${randomPladser}</strong> &#x1F535;</p>
                        <p>${foredrag.description}</p>
                    </div>
                </div>
            `;
            foredragContainer.appendChild(foredragElement);
        }
    });

    // Tilføjer klik-hændelse for SVG-knapper
    setTimeout(() => {
        document.querySelectorAll('.icon-btn').forEach((button) => {
            button.addEventListener('click', () => {
                console.log('SVG klik registreret!');
                button.classList.toggle('clicked'); // Ændrer stil ved klik
            });
        });
    }, 0);

    // Viser popup og håndterer accept
    const clarityModal = document.getElementById("clarity-modal");
    const acceptBtn = document.getElementById("accept-popup");
    if (acceptBtn) {
        acceptBtn.addEventListener("click", function () {
            clarityModal.style.display = "none"; // Skjuler popup
            sessionStorage.setItem("clarityAccepted", "true"); // Gemmer accept-status
        });
    }
});