const galleryContainer = document.querySelector(".gallery");
let galleryItems= [];

async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    galleryItems = await reponse.json();
    console.log(galleryItems);

    galleryContainer.innerHTML = '';
    console.log(galleryContainer);
} 

async function addElement() {
    for (let i=0; i<galleryItems.length; i++) {
        const figureContainer = document.createElement("figure");

        const baliseImage = document.createElement("img");
        baliseImage.setAttribute("alt", galleryItems[i].title);
        baliseImage.setAttribute("src", galleryItems[i].imageUrl);

        const baliseFigcaption = document.createElement("figcaption");
        baliseFigcaption.textContent = galleryItems[i].title;

        figureContainer.appendChild(baliseImage);
        figureContainer.appendChild(baliseFigcaption);

        galleryContainer.appendChild(figureContainer);
    }  

    console.log(galleryContainer);
}

function newFilters() {
    let portfolioContainer = document.getElementById("portfolio");
    const buttonContainer = document.createElement("div");
    const listCategories = new Set();
    
    for (let i=0; i<galleryItems.length; i++) {
        listCategories.add(galleryItems[i].category.name);
        listCategories.add("Tous");
    }

    listCategories.forEach(category => {
        const buttonFilters = document.createElement("button");
        buttonFilters.textContent = category;

        buttonContainer.appendChild(buttonFilters);
    })
    
    portfolioContainer.appendChild(buttonContainer);
}

 /* 
    Attention il faut appeler addElement après fetchWorks :
        1- on appelle fetchWorks
        2- ".then()" = une fois la promesse terminée alors...
        3- ...alors on appelle les fonctions addElement et newFilters 
*/
fetchWorks().then(() => {
    addElement();
    newFilters();
});










