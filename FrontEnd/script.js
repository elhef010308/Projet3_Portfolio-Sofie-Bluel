// gestion des variables globales
const galleryContainer = document.querySelector(".gallery");

const mainContainer = document.querySelector("main");
const formContainer = document.getElementById("login-container");

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
    let initialContent = mainContainer.innerHTML;

    // Sélectionner l'élément en fonction de son index
    const buttonLogin = listItemsLi[2];
    const buttonProjet = listItemsLi[0];

    buttonLogin.addEventListener("click", () => {
        formContainer.classList.remove("hidden");
        mainContainer.classList.add("hidden");
    });

    buttonProjet.addEventListener("click", () => {
        formContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
    });
}

// fonction pour récupérer les données du formulaire de connexion
async function formResponse () {
    const formContainer = document.querySelector(".container-login-page");
    let emailUsers = document.getElementById("email");
    let passwordUsers = document.getElementById("password");
    
    formContainer.addEventListener("submit", (event) => {
        event.preventDefault();  // empêcher le rechargement de la page
        
        // création de l'objet contenant les données à envoyer
        let usersData = {
            email: emailUsers.value, 
            password: passwordUsers.value
        };
        
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(usersData)
        })

        // convertir la réponse serveur en objet
        .then (response => {
            let serverResponseConversion = response.json();
            return serverResponseConversion;
        })
        
        // afficher les données reçues dans la console
        .then (data => {console.log("Réponse du serveur :", data);})

        // gérer les erreurs
        .catch (error => console.error("Erreur :", error));
    })
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

// fonction pour créer le contenu de la boite modale
function createModalBox() {
    // Vérifier si la modale existe déjà (évite les doublons)
    if (document.getElementById("container-modal-box")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <aside id="container-modal-box" class="modal-box-1" role="dialogue" aria-hidden="true" aria-labelledby="title-modal">
            <div class="modal-container">    
                <button class="button-close-modal">X</button>
                <h3 class="title-modal">Galerie photo</h3>
                <div class="container-pictures-modal"></div>
                <svg class="lign-modal-box" width="420px" height="2px">
                    <rect width="100%" height="1px" fill="black"></rect>
                </svg>
                <button class="button-add-pictures">Ajouter une photo</button>
            </div>
        </aside>
    `);
    
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

    // ajouter le style CSS à la boite modale
    const baliseStyle3 = document.createElement("style");

    baliseStyle3.innerHTML = `
        .modal-box-1 {
            display: none; 
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            align-items:center;
            justify-content:center;
            z-index:100;
            background-color:white;
            border-radius: 10px;
            width: 630px;   
            height: auto;    /* Ajuster la hauteur de la modale */
        }

        .modal-container {
            position: relative;
            text-align: center;
            padding: 20px;
        }

        .button-close-modal {
            border:none;
            top: 20px;
            right: 20px;
            background-color: transparent;
            position: absolute;
            font-size:18px;
            cursor: pointer;
            margin: 0;
        }

        .container-pictures-modal {
            width: 420.3px;
            height:365.71px
            gap: 9px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);  /* 5 colonnes */
            justify-content: center;                /* Centre les colonnes horizontalement */
            align-items: center;                    /* Centre les images verticalement */
            margin: 0 auto;                         /* Centre le conteneur dans la modale */
        }

        .container-pictures-modal img {
            width: 76.86px;
            height: 102.57px;
            object-fit: cover;
            margin: 0 0 29px 0;
        }

        .container-pictures-modal figcaption {
            display: none;
        }

        .title-modal {
            font-size: 26px;
            text-align: center;
            width: 100%;
            margin: 30px 0 50px 0;
        }

        .lign-modal-box {
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            width: fit-content;            /* S'ajuste à la taille du contenu */
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .lign-modal-box svg {  /* pour éviter que la ligne ne soit à gauche */
            display: block;
            margin: 0 auto; 
        }

        .button-add-pictures {
            display:flex;
            align-items: center;
            justify-content: center;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            height:36px;
            width:237px;
            size:14px;
            font-family:Syne;
            font-weight:700;
            border: solid 2px #1D6154;
            border-radius:50px;
            background-color: #1D6154;
            color:white;
            margin: 30px 0 0 0;
        }

        .button-add-pictures:hover {
            color:#1D6154;
            background-color:white;
        }
    `;
    
    document.head.appendChild(baliseStyle3);
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
        bodyContainer.style.overflow = "hidden";                      // Empêche le scroll de la page
    };

    // Ajouter les écouteurs d'événements pour ouvrir et fermer
    document.querySelectorAll(".link-to-open-modal-box").forEach(a => {
        a.addEventListener("click", openModal);
    });

    document.querySelector(".button-close-modal").addEventListener("click", closeModal);


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
    formResponse ();
    createModalLink();  // générer le lien pour ouvrir la boite modale
    createModalBox();   // générer la boîte modale
    gestionModalBox();  // gérer la boite modale
});


