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
    const emailInput = document.getElementById("e-mail");
    const passwordInput = document.getElementById("pass-word");
    const submitButton = document.getElementById("submit-login")
    
    // S'assurer que le DOM est bien chargé
    if (!formContainer || !emailInput || !passwordInput || !submitButton) {
        console.error("Un ou plusieurs éléments sont manquants dans le DOM.");
        return;
    }

    console.log("Formulaire détecté");

    // ajout de l'évènement au bouton de soumission
    formContainer.addEventListener("submit", async (event) => {
        event.preventDefault();  // empêcher le rechargement de la page
        console.log("Evenement bouton : OK");
        
        // récupération des données saisies par l'utilisateur
        const usersData = { 
            email: emailInput.value, 
            password: passwordInput.value
        };

        // vérifier les valeurs saisies par l'utilisateur
        console.log("Données envoyées : ", usersData);

        // Désactiver le bouton pendant l'envoi
        submitButton.disabled = true; 
        
        try {
            // appel de l'API avec les données
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usersData)
            });

            // vérifier la réponse HTTP
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Erreur API :", response.status, errorMessage);
                alert(`Erreur HTTP : ${response.status} - ${errorMessage}`);
                return;
            }
            
            // récupérer la réponse JSON
            const dataForm = await response.json();
            console.log("Réponse API reçue :", dataForm);

            // vérifier que l'API renvoie un token
            if (dataForm.token) {
                localStorage.setItem("token", dataForm.token); // sauvegarder le token
                alert("Connexion réussie !")             // afficher un message si la connexion fonctionne
                
                // rediriger l'utilisateur lorsque la connexion a réussie
                document.getElementById("login-container").style.display = "none";
                document.querySelector("main").style.display = "block";
            } else {
                alert("Connexion impossible ! ")  // afficher un message si la connexion ne fonctionne pas
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de la connexion.");
        } finally {
            // Réactiver le bouton après réception de la réponse
            submitButton.disabled = false; 
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

    // vérifier si les images existent dans la galerie et les cloner
    if (picturesInGallery.length > 0) {
        picturesInGallery.forEach(picture => {
            // Cloner l'image et lui ajouyer une classe
            const clonePicture = picture.cloneNode(true);
            clonePicture.classList.add("pictures-in-modal-box");

            // Créer une DIV pour contenir l'image et le bouton de suppression
            const containerDeleteButton = document.createElement("div");
            containerDeleteButton.classList.add("container-delete-button"); // Classe pour la div contenant l'image et le bouton
            
            // Ajouter l'image clonée dans cette div
            containerDeleteButton.appendChild(clonePicture);

            // Créer le bouton poubelle (icône)
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button"); // Classe pour le bouton
            deleteButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>"; // Icône poubelle (si vous utilisez FontAwesome)

            // Ajouter l'événement pour supprimer l'image lorsqu'on clique sur le bouton
            deleteButton.addEventListener("click", () => {
                containerDeleteButton.remove(); // Supprime la div contenant l'image et le bouton
                
                // Trouver l'index de l'image dans la galerie d'origine
                // AWAY.FROM pour convertir la liste en tableau 
                const pictureIndex = Array.from(picturesInGallery).indexOf(picture);

                // Si l'image existe dans la galerie, on la supprime
                if (pictureIndex !== -1) {
                    picturesInGallery[pictureIndex].remove(); // Supprimer l'image de la galerie
                }
            });

            // Ajouter le bouton poubelle à la div
            containerDeleteButton.appendChild(deleteButton);

            // Ajouter cette div (image + bouton) dans le conteneur de la modale
            picturesContainerInModal.appendChild(containerDeleteButton);
        });
    } else {
        picturesContainerInModal.innerHTML = "<p>Aucune image trouvée</p>";
    }
}

// fonction pour gérer les boites modales
function gestionModalBox() {
    let firstModalBox = document.getElementById("container-modal-box");
    let secondModalBox = document.getElementById("container-modal-box2");
    const bodyContainer = document.body;
    const modalContent1 = firstModalBox.querySelector(".modal-container");
    const modalContent2 = secondModalBox.querySelector(".modal-container2");
    const buttonToGoBack = document.querySelector(".button-go-back");

    // VERIFIER L'EXISTENCE DES MODALES
    if (!firstModalBox || !secondModalBox) {
        console.error("Au moins une des boites modales n'existe pas !");
        return;
    }

    // FERMER UNE MODALE
    function closeModalBox(modalBox) {
        if (!modalBox) return;
        modalBox.style.display = "none";
        modalBox.setAttribute("aria-hidden", "true");
        modalBox.getAttribute("aria-modal", "true");

        // Retirer le fond gris et réactiver le scroll du body
        if (firstModalBox.style.display !== "block" && secondModalBox.style.display !== "block") {
            bodyContainer.style.backgroundColor = "";   
            bodyContainer.style.overflow = "";
        }
    }

    // OUVRIR UNE MODALE
    function openModalBox(modalBox) {
        if (!modalBox) return;
        modalBox.style.display = "block";
        modalBox.setAttribute("aria-hidden", "false");
        modalBox.removeAttribute("aria-modal");

        // Activer le fond gris et désactiver le scroll du body
        bodyContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        bodyContainer.style.overflow = "hidden"; 
    }

    // OUVRIR la 1è boite modale
    document.querySelectorAll(".link-to-open-modal-box").forEach(a => {
        a.addEventListener("click", function(event) {
            openModalBox(firstModalBox);
            // Empêcher cet événement de se propager au document, refermant la modale en même temps qu'il ne l'ouvre
            event.stopPropagation();  
        });
    });

    // OUVRIR la 2è boite modale
    firstModalBox.querySelector(".button-add-pictures").addEventListener("click", function(event) {
        closeModalBox(firstModalBox);
        openModalBox(secondModalBox);
        event.stopPropagation();
    });

    // FERMER LES BOITES
    firstModalBox.querySelector(".button-close-modal").addEventListener("click", () => closeModalBox(firstModalBox));
    secondModalBox.querySelector(".button-close-modal").addEventListener("click", () => closeModalBox(secondModalBox));

    // EMPÊCHER LA FERMETURE SI ON CLIQUE DANS LA BOITE
    modalContent1.addEventListener("click", function(event) {
        event.stopPropagation();
    });
    modalContent2.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    // FERMER LES MODALES SI ON CLIQUE EN DEHORS
    document.addEventListener("click", function(event) { 
        if (
            firstModalBox.style.display === "block" && !firstModalBox.contains(event.target)
        ) {
            closeModalBox(firstModalBox);
        }
        if (
            secondModalBox.style.display === "block" && !secondModalBox.contains(event.target)
        ) {
            closeModalBox(secondModalBox);
        }
    });

    // PASSAGE de la 2è à la 1è modale
    buttonToGoBack.addEventListener("click", function(event) {
        closeModalBox(secondModalBox);
        openModalBox(firstModalBox);
        event.stopPropagation();
        event.preventDefault();
    });
}

// fonction pour ajouter des images via la modale
async function addPictutesInModal() {
    let picturesInGallery = document.querySelectorAll(".img-in-gallery");
    let picturesInModalBox = document.querySelectorAll(".pictures-in-modal-box");
    const containerToSelectPictures = document.querySelector(".square-to-add-pictures");
    const iconeOfPictures = document.querySelector(".icone-in-square");
    const buttonToSelectPictures = document.querySelector(".button-load-pictures");
    const fileInput = document.getElementById("file-input-modal");
    const textSubtitle = document.querySelector(".subtitle-info");
    
    // ÉTAPE 1 : afficher l'image sélectionnée
    fileInput.addEventListener("change", function (event) {
        // Récupérer le premier fichier sélectionné
        const fileSelected = event.target.files[0];
        
        // Vérifier s'il s'agit bien d'un fichier de type "image/png" ou "image/jpeg"
        if (!fileSelected || !fileSelected.type.startsWith("image/")) {
            alert("Veuillez sélectionner une image !");
            // arrêter la fonction si le fichier n'est pas dans le bon TYPE
            return;
        }

        // ÉTAPE 2 : Créer l'élément <img> et afficher l'image sélectionnée
        const imageSelected = document.createElement("img");
        // transformer l'image en URL temporaire
        imageSelected.src = URL.createObjectURL(fileSelected);
        imageSelected.setAttribute("class", "img-selected-to-add"); 

        // ÉTAPE 3 : Ajouter l'image à la div et masquer les anciens éléments
        containerToSelectPictures.appendChild(imageSelected);
        iconeOfPictures.style.display = "none";
        buttonToSelectPictures.style.display = "none";
        textSubtitle.style.display = "none";
    });
}



fetchWorks().then(() => {
    addElement(galleryItems);
    newFilters();
    setButtonListener();
    createModalLink();     // générer le lien pour ouvrir la boite modale
    picturesModalBox();    // ajouter les images à la boite modale
    gestionModalBox();
    addPictutesInModal();
});

// Appel de la fonction lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', formResponse);
