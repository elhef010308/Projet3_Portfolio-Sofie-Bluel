const galleryContainer = document.querySelector(".gallery");
const mainContainer = document.querySelector("main");
let galleryItems= [];

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
    let portfolioContainer = document.getElementById("portfolio")
    const titleGlobalPage = document.querySelectorAll("h2");
    const titlePortfolioContainer = titleGlobalPage[1];
    titlePortfolioContainer.setAttribute("class", "title-portfolio");

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

// fonction pour créer la page de connexion
async function createLoginPage() { 
    mainContainer.innerHTML = '';

    mainContainer.innerHTML = `
        <div class="container-login-page">
            <h2>Log In</h2>
            <div class="input-field" aria-label="Page de connexion">
                <p class="e-mail">E-mail</p>
                <input
                    type="email"
                    name="email"
                    id="email"
                    title="Veuillez indiquer votre adresse mail"
                    required
                    aria-required="true"
                />
                <p class="password">Mot de passe</p>
                <input
                    type="password"
                    name="password"
                    id="password"
                    title="Veuillez saisir votre mot de passe"
                    required
                    aria-required="true"
                />
            </div>
            <button type="submit">
                Se connecter
            </button>
            <a href="#" class="forgotPasswordLink">
                Mot de passe oublié
            </a>
        </div>
    `;
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
        createLoginPage();
    });

    buttonProjet.addEventListener("click", () => {
        mainContainer.innerHTML = initialContent;
    });
}

// fonction pour ajouter du style CSS aux nouveaux éléments insérés via Javascript
async function globalStyle () {
    const baliseStyle = document.createElement("style");

    baliseStyle.innerHTML = ` 
        body {
            background-color:#FFFEF8;
        }

        .title-portfolio {
            margin:139px 0 0 0;
        }

        .list-buttons-filters {
            display:flex;
            justify-content:center;
            margin: 50px 0;
        }

        .buttons-to-filter {
            height:38px;
            size:16px;
            font-weight:700;
            border: solid 2px #1D6154;
            border-radius:50px;
            background-color:white;
            color:#1D6154;
            font-family:Syne;
        }

        .buttons-to-filter:nth-child(1) {
            width:100px;
            margin:0 10px 0 0;
        }
        
        .buttons-to-filter:nth-child(2) {
            width:100px;
            margin:0 10px 0 0;
        } 
        
        .buttons-to-filter:nth-child(3) {
            width:157px;
            margin:0 10px 0 0;
        }

        .buttons-to-filter:nth-child(4) {
            width:198px;
        } 

        .buttons-to-filter:hover {
            background-color:#1D6154;
            color:white;
        }

        .buttons-to-filter:focus {
            background-color:#1D6154;
            color:white;
        }

        .container-login-page {
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
        }

        .container-login-page h2 {
            margin:150px 0 37px 0;
        }

        .container-login-page button {
            height:36px;
            width:179px;
            size:16px;
            font-family:Syne;
            font-weight:700;
            border: solid 2px #1D6154;
            border-radius:50px;
            background-color: #1D6154;
            color:white;
            font-family:Syne;
            margin: 15px 0 28px 0;
        }

        .container-login-page button:hover {
            background-color:white;
            color:#1D6154;
        }

        .input-field input {
            margin:22px 0;
            width:379px;
            height:51px;
            border: none;
            border-radius: 2px;
            background-color:white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Ombre subtile */
            outline: none; /* Empêche la bordure bleue par défaut au focus */
        }

        .forgotPasswordLink {
            color:black;
            margin: 0 0 355px 0;
        }       
    `;
    
    document.head.appendChild(baliseStyle); 
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
    globalStyle ();
});


