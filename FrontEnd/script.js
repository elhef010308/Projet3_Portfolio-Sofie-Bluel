const galleryContainer = document.querySelector(".gallery");
const mainContainer = document.querySelector("main");
let galleryItems= [];

async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    galleryItems = await reponse.json();
    console.log(galleryItems);

    galleryContainer.innerHTML = ''
    console.log(galleryContainer);
} 

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

async function newFilters() {
    let portfolioContainer = document.getElementById("portfolio")
    const titleGlobalPage = document.querySelectorAll("h2");
    const titlePortfolioContainer = titleGlobalPage[1];
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

        // Lier un événement au clic sur chaque bouton
        buttonFilters.addEventListener("click", () => {
            filterByCategories(category); // Passe la catégorie au filtre
        });
        
        buttonContainer.appendChild(buttonFilters);
    });
    
    portfolioContainer.insertBefore(buttonContainer, titlePortfolioContainer.nextElementSibling);
}

async function filterByCategories(category) {
    let filteredItems = [];

    if (category === "Tous") {
        filteredItems = galleryItems;
    } else {
        filteredItems = galleryItems.filter(item => item.category.name === category);
    }
    
    addElement(filteredItems);
}

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

async function setButtonListener() {
    const listItemsLi = document.querySelectorAll("li");
    let initialContent = mainContainer.innerHTML;

    // Sélectionner le 3ème élément de la liste (index 2)
    const buttonLogin = listItemsLi[2];
    const buttonProjet = listItemsLi[0];

    buttonLogin.addEventListener("click", () => {
        createLoginPage();
    });

    buttonProjet.addEventListener("click", () => {
        mainContainer.innerHTML = initialContent;
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
});


