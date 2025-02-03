// gestion des variables globales
const galleryContainer = document.querySelector(".gallery");

const mainContainer = document.querySelector("main");
const loginContainer = document.getElementById("login-container");

let galleryItems= [];

let portfolioContainer = document.getElementById("portfolio");
const titleGlobalPage = document.querySelectorAll("h2");

const titlePortfolioContainer = titleGlobalPage[1];
titlePortfolioContainer.setAttribute("class", "title-portfolio");


// fonction pour récupérer les données de l'API
async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    galleryItems = await reponse.json();
    console.log(galleryItems);

    galleryContainer.innerHTML = ''
    console.log(galleryContainer);
} 

// fonction pour vider la galerie et insérer les données de l'API à la place
async function addElement(itemsToDisplay) {
    galleryContainer.innerHTML = '';
    
    for (let i=0; i<itemsToDisplay.length; i++) {
        const figureContainer = document.createElement("figure");
        figureContainer.setAttribute("class", "img-in-gallery");

        const baliseImage = document.createElement("img");
        baliseImage.setAttribute("alt", itemsToDisplay[i].title);
        baliseImage.setAttribute("src", itemsToDisplay[i].imageUrl);

        const baliseFigcaption = document.createElement("figcaption");
        baliseFigcaption.textContent = itemsToDisplay[i].title;

        figureContainer.appendChild(baliseImage);
        figureContainer.appendChild(baliseFigcaption);

        galleryContainer.appendChild(figureContainer);
    }  

    console.log(galleryContainer);
}


// fonction pour créer des boutons de filtres
async function newFilters() {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "list-buttons-filters";

    const listCategories = new Set();

    listCategories.add("Tous");
    
    for (let i=0; i<galleryItems.length; i++) {
        listCategories.add(galleryItems[i].category.name);
    }
    
    listCategories.forEach(category => {
        const buttonFilters = document.createElement("button");
        buttonFilters.textContent = category;
        buttonFilters.setAttribute("class", "buttons-to-filter")

        // Lier un événement au clic sur chaque bouton
        buttonFilters.addEventListener("click", () => {
            filterByCategories(category); // Passe la catégorie au filtre
        });
        
        buttonContainer.appendChild(buttonFilters);
    });
    
    portfolioContainer.insertBefore(buttonContainer, titlePortfolioContainer.nextElementSibling);
}


// fonction pour trier la galerie en fonction du clic sur les boutons
async function filterByCategories(category) {
    let filteredItems = [];

    if (category === "Tous") {
        filteredItems = galleryItems;
    } else {
        filteredItems = galleryItems.filter(item => item.category.name === category);
    }
    
    addElement(filteredItems);
}

// fonction pour afficher la page de connexion
// fonction pour revenir à la page d'accueil du site
async function setButtonListener() {
    const listItemsLi = document.querySelectorAll("li");

    // Sélectionner l'élément en fonction de son index
    const buttonLogin = listItemsLi[2];
    const buttonProjet = listItemsLi[0];

    buttonLogin.addEventListener("click", () => {
        loginContainer.classList.remove("hidden");
        mainContainer.classList.add("hidden");
    });

    buttonProjet.addEventListener("click", () => {
        loginContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
    });
}

// fonction pour récupérer les données du formulaire de connexion
async function formResponse () {
    const formContainer = document.querySelector("#login-container form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = document.getElementById("submit-login")
    
    // S'assurer que le DOM est bien chargé
    if (!formContainer || !emailInput || !passwordInput || !submitButton) {
        console.error("Un ou plusieurs éléments sont manquants dans le DOM.");
        return;
    }

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();  // empêcher le rechargement de la page
        
        // création de l'objet contenant les données à envoyer
        const usersData = { 
            email: emailInput.value, 
            password: passwordInput.value
        };

        console.log("Données envoyées :", usersData); // Vérification des données envoyées
        
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(usersData)
            });

            if (!response.ok) {
                console.error("Erreur HTTP :", response.status);
                alert(`Erreur HTTP : ${response.status}`);
                return;
            }
            
            // transformer la réponse en JSON
            const dataForm = await response.json();

            // vérifier que l'API renvoie un token
            if (dataForm.token) {
                localStorage.setItem("token", dataForm.token); // sauvegarder le token
                alert("Connexion réussie !")      // afficher un message si la connexion fonctionne
                window.location.href = "dashboard.html";  // rediriger l'utilisateur si la connexion a réussi (optionnel)
            } else {
                alert("Connexion impossible ! ")  // afficher un message si la connexion ne fonctionne pas
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de la connexion.");
        }
    });
}


// fonction pour créer le lien pur ouvrir la boite modale
function createModalLink() {
    // ÉTAPE 1 : créer le lien et l'icone pour ouvrir la modale
    const modalLink = document.createElement("a");
    modalLink.textContent = "modifier";
    modalLink.setAttribute("id", "link-to-open-modal");
    modalLink.setAttribute("href", "#modal-box-container");
    modalLink.setAttribute("class", "link-to-open-modal-box");

    const iconeLink1 = document.createElement("link");
    iconeLink1.setAttribute("rel", "stylesheet");
    iconeLink1.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
    document.head.appendChild(iconeLink1);

    const iconeModalLink = document.createElement("i");
    iconeModalLink.setAttribute("class", "fa-regular fa-pen-to-square");

    // ÉTAPE 2 : créer une div contenant l'icone et le lien 
    const iconeLinkContainer = document.createElement("div");
    iconeLinkContainer.setAttribute("class", "icone-link-container");

    iconeLinkContainer.appendChild(iconeModalLink);
    iconeLinkContainer.appendChild(modalLink);

    // ÉTAPE 3 : créer une div pour contenir la div du lien et le titre de la section portfolio
    const modalLinkContainer = document.createElement("div");
    modalLinkContainer.setAttribute("class", "container-modalLink");

    // ÉTAPE 4 : ajouter le lien et le titre dans la div
    modalLinkContainer.appendChild(titlePortfolioContainer);
    modalLinkContainer.appendChild(iconeLinkContainer);

    // ÉTAPE 5 : insérer le lien au début de la section portfolio
    const buttonContainer = document.querySelector(".list-buttons-filters");
    portfolioContainer.insertBefore(modalLinkContainer, buttonContainer);

    // ÉTAPE 6 : ajouter le style CSS
    titlePortfolioContainer.style.display = "flex";
    titlePortfolioContainer.style.alignItems = "center";
    titlePortfolioContainer.style.margin = "50px 0 0 0";   
    titlePortfolioContainer.style.padding = "0";            
    
    modalLink.style.color = "black";
    modalLink.style.textDecoration = "none";
    modalLink.style.fontSize = "14px";

    iconeLinkContainer.style.display = "flex";
    iconeLinkContainer.style.alignItems = "center"; 
    iconeLinkContainer.style.justifyContent = "center";
    iconeLinkContainer.style.gap = "10px";
    iconeLinkContainer.style.width = "85px";
    iconeLinkContainer.style.height = "18px";
    iconeLinkContainer.style.margin = "50px 0 0 0";
    iconeLinkContainer.style.gap = "15px";

    modalLinkContainer.style.display = "flex";
    modalLinkContainer.style.alignItems = "center"; 
    modalLinkContainer.style.justifyContent = "center";
    modalLinkContainer.style.gap = "30px";
}

// fonction pour ajouter les images à la boite modale
function picturesModalBox() {
    const modalBoxContainer = document.getElementById("container-modal-box");
    const picturesContainerInModal = modalBoxContainer.querySelector(".container-pictures-modal");
    const picturesInGallery = document.querySelectorAll(".img-in-gallery");

    // vérifier si les images existent dans la gallerie et les cloner
    if (picturesInGallery.length > 0) {
        picturesInGallery.forEach(picture => {
            const clonePisctures = picture.cloneNode(true);
            picturesContainerInModal.appendChild(clonePisctures);
        });
    } else {
        picturesContainerInModal.innerHTML = "<p>Aucune image trouvée</p>";
    }
}

// Fonction pour gérer la boite modale
function gestionModalBox() {
    // Sélectionner la modale par ID
    let modalBox = document.getElementById("container-modal-box");
    const bodyContainer = document.body;

    // Vérifier si la modale existe
    if (!modalBox) {
        console.error("La boîte modale n'existe pas !");
        return;
    }

    // Fonction pour fermer la modale
    const closeModal = function(event) {
        event.preventDefault();
        modalBox.style.display = "none";
        modalBox.setAttribute("aria-hidden", "true");
        modalBox.removeAttribute("aria-modal");
        
        // Retirer le fond gris et réactiver le scroll du body
        bodyContainer.style.backgroundColor = "";   // Retirer le fond gris
        bodyContainer.style.overflow = "";          // Réactiver le scroll
    };

    // Fonction pour ouvrir la modale
    const openModal = function(event) {
        event.preventDefault();
        modalBox.style.display = "block";
        modalBox.setAttribute("aria-hidden", "false");
        modalBox.setAttribute("aria-modal", "true");
        
        // Ajouter le fond gris et désactiver le scroll
        bodyContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";  // Gris transparent
        bodyContainer.style.overflow = "hidden";                       // Empêche le scroll de la page
    };

    // Ajouter les écouteurs d'événements pour ouvrir et fermer
    document.querySelectorAll(".link-to-open-modal-box").forEach(a => {
        a.addEventListener("click", function(event) {
            openModal(event);
            event.stopPropagation();  // Empêcher que cet événement se propage au document et ne referme la modale en même temps qu'il l'ouvre
        });
    });

    document.querySelector(".button-close-modal").addEventListener("click", closeModal);

    // Empêcher la fermeture de la modale si l'on clique à l'intérieur de la zone de contenu
    const modalContent = modalBox.querySelector(".modal-container");
    modalContent.addEventListener('click', function(event) {
        event.stopPropagation(); // Empêche la propagation de l'événement au fond de la modale
    });

    // Fermer la modale lorsque l'on clique en dehors de la boîte modale (fond)
    document.addEventListener('click', function(event) {
        // Vérifier si la modale est visible et si le clic n'est pas à l'intérieur de la modale
        if (modalBox.style.display === "block" && !modalBox.contains(event.target)) {
            closeModal(event); // Appeler la fonction pour fermer la modale
        }
    });
}

/* 
    Attention il faut appeler addElement après fetchWorks :
        1- on appelle fetchWorks
        2- ".then()" = une fois la promesse terminée alors...
        3- ...alors on appelle les fonctions suivantes 
*/
fetchWorks().then(() => {
    addElement(galleryItems);
    newFilters();
    setButtonListener();
    formResponse();
    createModalLink();  // générer le lien pour ouvrir la boite modale
    picturesModalBox();   // générer la boîte modale
    gestionModalBox();  // gérer la boite modale
});
