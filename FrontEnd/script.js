const galleryContainer = document.querySelector(".gallery");
const mainContainer = document.querySelector("main");
const loginContainer = document.getElementById("login-container");
let portfolioContainer = document.getElementById("portfolio");
const titleGlobalPage = document.querySelectorAll("h2");

const titlePortfolioContainer = titleGlobalPage[1];
titlePortfolioContainer.setAttribute("class", "title-portfolio");

let galleryItems= [];

const bodyContainer = document.body;  

const listItemsLi = document.querySelectorAll("li");
const buttonLogin = listItemsLi[2];  
const buttonProjet = listItemsLi[0];

const barreModeEdition = document.getElementById("edition-mode-bar");
const containerModalLink = document.querySelector(".icone-link-container");

const formContainer = document.querySelector("#login-container form");
const emailInput = document.getElementById("e-mail");
const passwordInput = document.getElementById("pass-word");
const submitButton = document.getElementById("submit-login");
const errorMessage = document.querySelector(".error-message");

let firstModalBox = document.getElementById("container-modal-box");
let secondModalBox = document.getElementById("container-modal-box2");
const modalContent1 = firstModalBox.querySelector(".modal-container");
const modalContent2 = secondModalBox.querySelector(".modal-container2");

const buttonToGoBack = document.querySelector(".button-go-back");
const buttonAddPictures = document.querySelector(".button-add-pictures");

const errorInModal = document.querySelector(".error-message-modale");

const containerToSelectPictures = document.querySelector(".square-to-add-pictures");
const iconeOfPictures = document.querySelector(".icone-in-square");
const buttonToSelectPictures = document.querySelector(".button-load-pictures");
const textSubtitle = document.querySelector(".subtitle-info");

const imageInput = document.getElementById("file-input-modal");
let imageDescription = document.getElementById("text-title-pictures-modal");
let imageCategory = document.querySelector(".add-puctures-category");

let buttonToSave = document.querySelector(".button-to-save");


// FONCTION POUR : récupérer les données de l'API
async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    galleryItems = await reponse.json();
    console.log(galleryItems);
    galleryContainer.innerHTML = '';
    console.log(galleryContainer);
}


// FONCTION POUR : insérer les données de l'API à la place de la galerie
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


// FONCTION POUR : créer les boutons de filtres
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
        buttonFilters.setAttribute("class", "buttons-to-filter");

        buttonFilters.addEventListener("click", () => {
            filterByCategories(category);   // Passer la catégorie au filtre
        });
        
        buttonContainer.appendChild(buttonFilters);
    });

    portfolioContainer.insertBefore(buttonContainer, galleryContainer);
}

let filteredItems = [];


// FONCTION POUR : trier la galerie selon le clic sur les boutons
async function filterByCategories(category) {
    if (category === "Tous") {
        filteredItems = galleryItems;
    } else {
        filteredItems = galleryItems.filter(item => item.category.name === category);
    }
    
    addElement(filteredItems);
}


// FONCTION POUR : gérer la page de connexion 
async function setButtonListener() {
    buttonLogin.addEventListener("click", () => {
        loginContainer.classList.remove("hidden");
        mainContainer.classList.add("hidden");
    });

    buttonProjet.addEventListener("click", () => {
        loginContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
    });
}


// FONCTION POUR : se connecter
async function formResponse () {
    // S'assurer que le DOM est bien chargé
    if (!formContainer || !emailInput || !passwordInput || !submitButton) {
        console.error("Un ou plusieurs éléments sont manquants dans le DOM.");
        return;
    }

    // Ajouter l'évènement au bouton de soumission
    formContainer.addEventListener("submit", async (event) => {
        event.preventDefault();  
        console.log("Evenement bouton : OK");
        
        const usersData = {    // Récupérer les données saisies par l'utilisateur
            email: emailInput.value, 
            password: passwordInput.value
        };

        // Réinitialiser les erreurs avant validation
        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
        emailInput.placeholder = "";            // réinitialiser le placeholder    
        passwordInput.placeholder = "";         // réinitialiser le placeholder
        errorMessage.style.display = "none";    // réinitialiser le message d'erreur global

        let hasError = false;

        // Vérifier si les champs INPUT sont vides
        if (!usersData.email) {
            emailInput.classList.add("input-error");
            emailInput.placeholder  = "Entrez votre adresse e-mail"; 
            hasError = true;
        }
        if (!usersData.password) {
            passwordInput.classList.add("input-error");
            passwordInput.placeholder  = "Entrez votre mot de passe";  
            hasError = true;
        }

        // Ne pas envoyer la requête s'il y a une erreur
        if (hasError) {
            return;
        }

        submitButton.disabled = true;   // Désactiver le bouton pendant l'envoi
        
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usersData)
            });

            // Vérifier la réponse HTTP
            if (!response.ok) {
                const textError = document.querySelector(".error-message");
                if (textError) {
                    textError.style.display = "block"; 
                }
                return;
            }
            
            // Récupérer la réponse JSON
            const dataForm = await response.json();
            console.log("Réponse API reçue :", dataForm);

            // Vérifier si l'API renvoie un token
            if (dataForm.token) {
                localStorage.setItem("token", dataForm.token);   // sauvegarder le token
                
                // Rediriger l'utilisateur lorsque la connexion a réussie
                document.getElementById("login-container").style.display = "none";
                document.querySelector("main").style.display = "block";

                // Mettre à jour l'interface visuelle
                barreModeEdition.style.display = "flex";
                containerModalLink.style.display = "flex";
                
                buttonLogin.textContent = "Déconnexion";       // remplacer "login" par "déconnexion"
                buttonLogin.addEventListener("click", logout); // ajouter un écouteur d'événement pour la déconnexion

                location.reload();  
            } 
        } catch (error) {
            console.error("Erreur :", error);
            errorMessage.style.display = "block"; 
            return;
        } finally {
            submitButton.disabled = false;   // Réactiver le bouton après réception de la réponse
        }
    });
}


// FONCTION POUR : se déconnecter 
function logout() {
    localStorage.removeItem("token");           // supprimer le token
    barreModeEdition.style.display = "none";    // masquer la barre noire
    containerModalLink.style.display = "none";  // masquer le lien MODIFIER
 
    buttonLogin.textContent = "Login";  
 
    buttonLogin.removeEventListener("click", logout);   // supprimer l'évènement "déconnexion"

    document.getElementById("login-container").style.display = "none";
    document.querySelector("main").style.display = "block";

    location.reload();
}


// FONCTION POUR : vérifier la présence du token lors du rechargement de la page
window.addEventListener("load", () => {
    const token = localStorage.getItem("token");

    if (token) { // Si l'utilisateur est connecté
        document.getElementById("edition-mode-bar").style.display = "flex";  // Afficher la barre noire
        containerModalLink.style.display = "flex";
        const listItemsLi = document.querySelectorAll("li");
        const buttonLogin = listItemsLi[2];
        buttonLogin.textContent = "Déconnexion";        // Remplacer "Login" par "Déconnexion"
        buttonLogin.addEventListener("click", logout);  // Ajouter l'écouteur de déconnexion
    } else { // S'il ne l'est pas
        document.getElementById("edition-mode-bar").style.display = "none";  // Masquer la barre noire
        containerModalLink.style.display = "none";
        const listItemsLi = document.querySelectorAll("li");
        const buttonLogin = listItemsLi[2];
        buttonLogin.textContent = "Login";  // Remplacer "Déconnexion" par "Login"
    }
});


// FONCTION POUR : gérer les boites modales
function gestionModalBox() {
    // Vérifier l'existence des modales
    if (!firstModalBox || !secondModalBox) {
        console.error("Au moins une des boites modales n'existe pas !");
        return;
    }

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

    function openModalBox(modalBox) {
        if (!modalBox) return;
        modalBox.style.display = "block";
        modalBox.setAttribute("aria-hidden", "false");
        modalBox.removeAttribute("aria-modal");
        buttonAddPictures.removeAttribute("disabled");

        // Activer le fond gris et désactiver le scroll du body
        bodyContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        bodyContainer.style.overflow = "hidden"; 
    }

    // OUVRIR la 1è boite modale
    document.querySelectorAll(".link-to-open-modal-box").forEach(a => {
        a.addEventListener("click", function(event) {
            openModalBox(firstModalBox);
            event.stopPropagation();   // Empêcher cet événement de se propager au document
        });                            // (sinon la boite modale se ferme lorsqu'elle s'ouvre)
    });

    // OUVRIR la 2è boite modale
    buttonAddPictures.addEventListener("click", function(event) {
        closeModalBox(firstModalBox);
        openModalBox(secondModalBox);
        event.stopPropagation();
    });

    // FERMER les boites modales
    firstModalBox.querySelector(".button-close-modal").addEventListener("click", () => closeModalBox(firstModalBox));
    secondModalBox.querySelector(".button-close-modal").addEventListener("click", () => closeModalBox(secondModalBox));

    // EMPÊCHER LA FERMETURE si on clique dans la boite modale
    modalContent1.addEventListener("click", function(event) {
        event.stopPropagation();
    });
    modalContent2.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    // FERMER les boites modales si on clique à l'extérieur
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

    // PASSAGE de la 2è à la 1è boite modale
    buttonToGoBack.addEventListener("click", function(event) {
        closeModalBox(secondModalBox);
        openModalBox(firstModalBox);
        event.stopPropagation();
        event.preventDefault();
    });
}


// FONCTION POUR : gérer les images dans la boite modale
function picturesModalBox() {
    const picturesContainerInModal = firstModalBox.querySelector(".container-pictures-modal");
    const picturesInGallery = document.querySelectorAll(".img-in-gallery");

    // Vérifier si les images existent dans la galerie et les cloner
    if (picturesInGallery.length > 0) {
        picturesInGallery.forEach(picture => {
            const clonePicture = picture.cloneNode(true);
            clonePicture.classList.add("pictures-in-modal-box");
            const caption = picture.querySelector("figcaption").textContent;   // récupérer le titrre de l'image

            // Créer une DIV pour contenir l'image et le bouton de suppression
            const containerDeleteButton = document.createElement("div");
            containerDeleteButton.classList.add("container-delete-button"); 
            containerDeleteButton.appendChild(clonePicture);

            // Créer le bouton poubelle (icône)
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button"); 
            deleteButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>"; 

            // Ajouter l'événement pour supprimer l'image 
            deleteButton.addEventListener("click", async () => {
                // Afficher la boîte de confirmation
                document.getElementById("confirmationBox").style.display = "block";
                
                // OUI (on supprime)
                document.getElementById("confirmDelete").onclick = async function () {
                    await deleteImageAPI(caption, containerDeleteButton);                // passer le titre à la fonction de suppression
                    document.getElementById("confirmationBox").style.display = "none";   // cacher la confirmation
                }
                // NON (on ne supprime pas)
                document.getElementById("cancelDelete").onclick = function () {
                    document.getElementById("confirmationBox").style.display = "none";   // cacher la confirmation
                };
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


// FONCTION POUR : supprimer une image dans l'API
async function deleteImageAPI(imageTitle, containerDeleteButton) {
    errorInModal.style.display = "none";   // cacher le message d'erreur par défaut

    const tokenIsNone = document.createElement("p");
    tokenIsNone.textContent = "Veuillez vous identifier !";
    tokenIsNone.classList.add("erreur-in-modal2");

    try {
        // Appel à l'API pour récupérer la liste des images
        const response = await fetch("http://localhost:5678/api/works");
        const images = await response.json();

        // Trouver l'image avec le titre correspondant
        const imageToDelete = images.find(image => image.title === imageTitle);

        if (imageToDelete) {
            // L'ID de l'image à supprimer
            const imageId = imageToDelete.id;
            const token = localStorage.getItem("token");

            if (!token) {
                firstModalBox.appendChild(tokenIsNone);
                return;
            }

            // Effectuer la requête DELETE avec l'ID de l'image
            const deleteResponse = await fetch(`http://localhost:5678/api/works/${imageId}`, {
                method: 'DELETE', // Méthode DELETE pour supprimer l'image
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`, // Si besoin d'un token d'authentification
                },
            });

            if (deleteResponse.ok) {
                containerDeleteButton.remove();       // supprimer la div contenant l'image et le bouton
                errorInModal.style.display = "none";  // cacher le message d'erreur par défaut

                // Sélectionner l'image correspondante dans la galerie du DOM
                const imageElementDom = document.querySelector(`.gallery img[alt='${imageTitle}']`);
                if (imageElementDom) {
                    imageElementDom.closest('figure').remove();   // Supprimer l'élément image de la galerie
                }
                
                // Fermer la boîte modale après suppression
                firstModalBox.style.display = "none";
                firstModalBox.setAttribute("aria-hidden", "true");
                bodyContainer.style.backgroundColor = "";
                bodyContainer.style.overflow = "";

                location.reload();
            } else {
                errorInModal.style.display = "block";   // afficher le message d'erreur
            }
        } else {
            errorInModal.style.display = "block";       // afficher le message d'erreur
        }
    } catch (error) {
        errorInModal.style.display = "block";           // afficher le message d'erreur
    }
}


// FONCTION POUR : ajouter des images via la modale
async function addPictutesInModal() {
    // ÉTAPE 1 : afficher l'image sélectionnée
    imageInput.addEventListener("change", function (event) {
        // Récupérer le premier fichier sélectionné
        const fileSelected = event.target.files[0];
        const errorMessage = document.querySelector(".subtitle-info"); // Sélection du <p> existant
        
        // Vérifier si un fichier a été sélectionné
        if (!fileSelected) {
            return;
        }

        // Vérifier la taille du fichier (4 Mo max)
        if (fileSelected.size > 4 * 1024 * 1024) {
            errorMessage.textContent = "L'image ne doit pas dépasser 4mo !";
            errorMessage.style.color = "rgb(184, 1, 1)";
            errorMessage.style.fontWeight = "600";
            errorMessage.style.fontSize = "15px"
            imageInput.value = ""; // Réinitialiser l'input
            return;
        }

        // Vérifier le format du fichier (JPG ou PNG uniquement)
        const allowedFormats = ["image/jpeg", "image/png"];
        if (!allowedFormats.includes(fileSelected.type)) {
            errorMessage.textContent = "L'image doit être un fichier JPG ou PNG !";
            errorMessage.style.color = "rgb(184, 1, 1)";
            errorMessage.style.fontWeight = "600";
            errorMessage.style.fontSize = "15px"
            imageInput.value = ""; // Réinitialiser l'input
            return;
        }

        // Si tout est bon, remettre le message par défaut
        errorMessage.textContent = "jpg, png : 4mo max";
        errorMessage.style.color = ""; // Remettre la couleur par défaut
        errorMessage.style.fontWeight = ""; // Remettre le texte normal

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

    // fonction pour ACTIVER/DESACTIVER le bouton
    function activButtonToSave() {
        if (imageInput.files.length > 0 && imageCategory.value.trim() !== "" && imageDescription.value !== "") {
            buttonToSave.style.backgroundColor = "#1D6154";
            buttonToSave.style.border = "solid 2px #1D6154"
            buttonToSave.style.color = "white";
            buttonToSave.removeAttribute("disabled");
        } else {
            buttonToSave.setAttribute("disabled", true);
        }
    }

    // ajouter des écouteurs d'événements pour activer ou désactiver le bouton
    imageDescription.addEventListener("input", activButtonToSave);
    imageCategory.addEventListener("change", activButtonToSave);
    imageInput.addEventListener("change", activButtonToSave);

    // s'assurer que le bouton est bien désactivé initialement
    activButtonToSave();
}


// FONCTION POUR : envoyer une nouvelle image à l'API
async function addImageApi(event) {
    event.preventDefault();
    
    const token = localStorage.getItem("token");

    const tokenIsNone = document.createElement("p");
    tokenIsNone.textContent = "Veuillez vous identifier !";
    tokenIsNone.classList.add("erreur-in-modal2");

    const errorApi = document.createElement("p");
    errorApi.textContent = "Ajout de l'image impossible !";
    errorApi.classList.add("erreur-in-modal2");

    let categoryId;
    
    // Vérification du token
    if (!token) {
        secondModalBox.appendChild(tokenIsNone);
        return;
    }
    
    // Vérification des champs requis
    if (!imageDescription.value.trim() || !imageCategory.value || !imageInput.files[0]) {
        return;
    }
    
    // Définir categoryId basé sur la sélection
    if (imageCategory.value === "Objets") {
        categoryId = 1;
    } else if (imageCategory.value === "Appartements") {
        categoryId = 2;
    } else if (imageCategory.value === "Hotels & restaurants") {
        categoryId = 4;
    }

    console.log("Catégorie sélectionnée :", categoryId);
    console.log("Titre :", imageDescription.value.trim());

    const file = imageInput.files[0]; // récupérer le fichier sléctionné
    console.log("Image récupérée : ", file);

    try {
        // Création du FormData avec les noms de champs exacts
        const formData = new FormData();
        formData.append('title', imageDescription.value.trim());
        formData.append('category', categoryId);
        formData.append('image', file);
        
        // Vérification des données à envoyer
        console.log("FormData envoyé :");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Configuration de la requête avec headers appropriés
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: formData
        });
        
        // Vérification de la réponse
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur serveur:', {
                status: response.status,
                message: errorText
            });
            modalTwo.appendChild(errorApi);
            return;
        }
        
        const responseData = await response.json();
        console.log("Réponse API : ", responseData);
        
        // Mise à jour de la galerie
        const gallery = document.querySelector(".gallery");
        const newImageElement = document.createElement("figure");
        newImageElement.innerHTML = `
            <img src="${responseData.imageUrl}" alt="${responseData.title}">
            <figcaption>${responseData.title}</figcaption>
        `;
        gallery.appendChild(newImageElement);
        
        // Fermer la boîte modale après ajout
        const boiteModale = document.getElementById("container-modal-box2");
        const bodyContainer = document.body;
        boiteModale.style.display = "none";
        boiteModale.setAttribute("aria-hidden", "true");
        bodyContainer.style.backgroundColor = "";
        bodyContainer.style.overflow = "";

        location.reload();
    } catch (error) {
        console.error("Erreur complète:", {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        secondModalBox.appendChild(errorInModal);
    }
}


fetchWorks().then(() => {
    addElement(galleryItems);
    newFilters();
    setButtonListener();
    picturesModalBox();    // ajouter les images à la boite modale
    gestionModalBox();
    addPictutesInModal();
});

// Appel de la fonction lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', formResponse);

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form-to-add-picture");
    form.addEventListener("submit", addImageApi);
});


