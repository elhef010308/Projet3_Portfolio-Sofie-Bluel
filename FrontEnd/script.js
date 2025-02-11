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

    galleryContainer.innerHTML = '';
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
        buttonFilters.setAttribute("class", "buttons-to-filter");

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


// fonction pour se déconnecter 
function logout() {
    // 1. Supprimer le token du localStorage
    localStorage.removeItem("token");

    //2. Masquer la barre noire en haut de la page web
    const blackBar = document.getElementById("edition-mode-bar");
    blackBar.style.display = "none";

    //3. Remplacer "déconnexion" par "login"
    const listItemsLi = document.querySelectorAll("li");
    const buttonLogin = listItemsLi[2];
    buttonLogin.textContent = "Login";

    //4. Supprimer l'évènement "déconnexion" pour éviter les conflits
    buttonLogin.removeEventListener("click", logout);
}

// fonction pour récupérer les données du formulaire de connexion
async function formResponse () {
    const formContainer = document.querySelector("#login-container form");
    const emailInput = document.getElementById("e-mail");
    const passwordInput = document.getElementById("pass-word");
    const submitButton = document.getElementById("submit-login");
    const errorMessage = document.querySelector(".error-message"); // Sélectionner l'élément d'erreur correctement
    
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
        console.log("Données à envoyer : ", usersData);

        // Réinitialiser les erreurs avant validation
        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
        emailInput.placeholder = ""; // Réinitialiser le placeholder
        passwordInput.placeholder = ""; // Réinitialiser le placeholder
        errorMessage.style.display = "none";  // Réinitialiser le message d'erreur global

        let hasError = false;

        // Vérifier si les champs INPUT sont vides
        if (!usersData.email) {
            emailInput.classList.add("input-error");
            emailInput.placeholder  = "Veuillez remplir ce champ"; // info-bulle pour email
            hasError = true;
        }
        if (!usersData.password) {
            passwordInput.classList.add("input-error");
            passwordInput.placeholder  = "Veuillez remplir ce champ"; // info-bulle pour mot de passe
            hasError = true;
        }

        // Si il y a une erreur, ne pas envoyer la requête
        if (hasError) {
            return;
        }

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
                const textError = document.querySelector(".error-message");
                if (textError) {
                    textError.style.display = "block"; 
                }
                return;
            }
            
            // récupérer la réponse JSON
            const dataForm = await response.json();
            console.log("Réponse API reçue :", dataForm);

            // vérifier que l'API renvoie un token
            if (dataForm.token) {
                localStorage.setItem("token", dataForm.token); // sauvegarder le token
                
                // rediriger l'utilisateur lorsque la connexion a réussie
                document.getElementById("login-container").style.display = "none";
                document.querySelector("main").style.display = "block";

                const barreModeEdition = document.getElementById("edition-mode-bar");
                barreModeEdition.style.display = "flex";

                const listItemsLi = document.querySelectorAll("li");
                const buttonLogin = listItemsLi[2];
                // Remplacer le texte de "login" par "Déconnexion"
                buttonLogin.textContent = "Déconnexion";
                buttonLogin.addEventListener("click", logout); // Ajoute un écouteur d'événement pour la déconnexion
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


// fonction pour gérer les images dans la boite modale
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

            // Récupérer le titre de l'image depuis le <figcaption>
            const caption = picture.querySelector("figcaption").textContent;

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
            deleteButton.addEventListener("click", async () => {
                // afficher un message pour confirmer la suppression 
                const userConfirmed = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");

                if (userConfirmed) {
                    containerDeleteButton.remove(); // Supprimer la div contenant l'image et le bouton
                    
                    // Passer le titre à la fonction de suppression
                    await deleteImageAPI(caption); // Passer le titre pour récupérer l'ID et supprimer l'image
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

// fonction pour supprimer une image dans l'API
async function deleteImageAPI(imageTitle) {
    try {
        // Appel à l'API pour récupérer la liste des images
        const response = await fetch("http://localhost:5678/api/works");
        const images = await response.json();

        // Trouver l'image avec le titre correspondant
        const imageToDelete = images.find(image => image.title === imageTitle);

        if (imageToDelete) {
            // L'ID de l'image à supprimer
            const imageId = imageToDelete.id;

            // Vérifier si le token d'authentification est disponible dans le localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token d'authentification manquant !");
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
                alert("Image supprimée avec succès !");
                location.reload();
            } else {
                alert("Erreur lors de la suppression de l'image !");
            }
        } else {
            alert("Aucune image trouvée avec ce titre.");
        }
    } catch (error) {
        alert("Une erreur s'est produite lors de la requête API !");
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
    const buttonAddPictures = document.querySelector(".button-add-pictures");

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
        buttonAddPictures.removeAttribute("disabled");

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
    const containerToSelectPictures = document.querySelector(".square-to-add-pictures");
    const iconeOfPictures = document.querySelector(".icone-in-square");
    const buttonToSelectPictures = document.querySelector(".button-load-pictures");
    const fileInput = document.getElementById("file-input-modal");
    const textSubtitle = document.querySelector(".subtitle-info");
    let imageDescription = document.getElementById("text-title-pictures-modal");
    let imageCategory = document.querySelector(".add-puctures-category");
    let buttonToSave = document.querySelector(".button-to-save");
    
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

    // fonction pour ACTIVER/DESACTIVER le bouton
    function activButtonToSave() {
        if (fileInput.files.length > 0 && imageCategory.value.trim() !== "" && imageDescription.value !== "") {
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
    fileInput.addEventListener("change", activButtonToSave);

    // s'assurer que le bouton est bien désactivé initialement
    activButtonToSave();
}


// Fonction pour redimensionner une image
function resizeImage(file, maxWidth = 700, maxHeight = 700, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);

        img.onload = function () {
            let width = img.width;
            let height = img.height;

            // Vérifier si l'image a besoin d'être redimensionnée
            if (width <= maxWidth && height <= maxHeight) {
                return resolve(file); // Retourne l'original si pas besoin de redimensionner
            }

            // Calculer les nouvelles dimensions en respectant le ratio
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }

            // Création du canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir en Blob et retourner l'image redimensionnée
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Erreur lors de la conversion de l'image"));
                }
            }, 'image/jpeg', quality);
        };

        img.onerror = reject;
    });
}

// fonctio,n pour envoyer une nouvelle image à l'API
async function addImageApi(event) {
    event.preventDefault();
    
    // Récupération des éléments
    const inputText = document.getElementById("text-title-pictures-modal");
    const imageSelect = document.getElementById("file-input-modal");
    const selectOption = document.querySelector(".add-puctures-category");
    const token = localStorage.getItem("token");
    let categoryId;
    
    // Vérification du token
    if (!token) {
        alert("Token manquant, veuillez vous reconnecter.");
        return;
    }
    
    // Vérification des champs requis
    if (!inputText.value.trim() || !selectOption.value || !imageSelect.files[0]) {
        alert("Veuillez compléter tous les champs !");
        return;
    }
    
    // Définir categoryId basé sur la sélection
    if (selectOption.value === "Objets") {
        categoryId = 1;
    } else if (selectOption.value === "Appartements") {
        categoryId = 2;
    } else if (selectOption.value === "Hotels & restaurants") {
        categoryId = 4;
    }

    console.log("Catégorie sélectionnée :", categoryId);
    console.log("Titre :", inputText.value.trim());

    const file = imageSelect.files[0]; // récupérer le fichier sléctionné
    console.log("Image récupérée : ", file);

    try {
        // Redimensionnement de l'image
        const resizedImage = await resizeImage(file);
        console.log("Image redimensionnée : ", resizedImage);
        
        // Vérification du type de resizedImage
        if (!(resizedImage instanceof Blob)) {
            console.error("Le fichier redimensionné n'est pas un Blob");
            return;
        }

        // Créer un nouveau nom de fichier pour l'image redimensionnée
        const newFileName = "resized_image.jpg"; // Nouveau nom de fichier
        const renamedFile = new File([resizedImage], newFileName, { type: "image/jpeg" });

        // Création du FormData avec les noms de champs exacts
        const formData = new FormData();
        formData.append('title', inputText.value.trim());
        formData.append('category', categoryId);
        formData.append('image', renamedFile);
        
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
            throw new Error(`Erreur ${response.status}: ${errorText}`);
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
        alert("Image ajoutée avec succès !");
        location.reload();
       
    } catch (error) {
        console.error("Erreur complète:", {
            message: error.message,
            stack: error.stack,
            type: error.name
        });
        alert("Une erreur est survenue côté serveur. Veuillez contacter l'administrateur.");
    }
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

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("form-to-add-picture");
    form.addEventListener("submit", addImageApi);
});


