// import * as detail from"./promo-details.js";

const API_KEY = "205091a7-5fc0-4ccf-86dd-ae7136ed715c";
const URL_API = "http://146.59.242.125:3009";

const promosContainer = document.querySelector("#promosContainer");

/////////// Modal /////////

const addModal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".overlay")

////////////////////// Fonction GET promo ////////////////

async function getPromo() {
    try {
        const response = await fetch(URL_API + "/promos", {
            method: "GET",
            headers: {
                authorization: "Bearer " + API_KEY
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        displayPromo(data);

    } catch (error) {
        console.error("Erreur lors de la récupération de la promo : ", error);
    }
}

////////////////////// Fonction POST promo ////////////////

async function postPromo(promo) {
    try {
        const response = await fetch(URL_API + "/promos", {
            method: "POST",
            headers: {
                authorization: "Bearer " + API_KEY,
                "Content-type": "Application/json"
            },
            body: JSON.stringify(promo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        getPromo()

    } catch (error) {
        console.error("Erreur lors de la récupération de la promo :", error);
    }
}

///////////////////// Fonction Ajouter Promo ///////////////

function addPromo() {
    showModal()
    createPromo()
}

///////////////////// Fonction PUT promo ///////////////

async function putPromo(id, promo) {
    try {
        const response = await fetch(URL_API + "/promos/" + id, {
            method: "PUT",
            headers: {
                authorization: "Bearer " + API_KEY,
                "Content-type": "Application/json"
            },
            body: JSON.stringify(promo)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(promo);

    } catch (error) {
        console.error("Erreur lors de la récupération de la promo :", error);
    }
}

///////////////////// Fonction DELETE promo ///////////////

async function deletePromo(id) {
    try {
        const response = await fetch(URL_API + "/promos/" + id, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + API_KEY
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

////////////////////// Fonction affiche Promo ///////////////

function displayPromo(data) {
    promosContainer.textContent = "";
    data.forEach(element => {

        const promos = document.createElement("article");
        promosContainer.appendChild(promos);
        promos.classList.add("promo");

        /////// Création div contenant les add et nom /////

        const divAvatar = document.createElement('div');
        promos.appendChild(divAvatar);
        divAvatar.classList.add('div-avatar-infos');

        let promoName = document.createElement('h3');
        promoName.classList.add("nom");
        promoName.textContent = element.name;
        divAvatar.appendChild(promoName);

        /////// Création div contenant les infos /////
        const infos = document.createElement("div");
        promos.appendChild(infos);
        infos.classList.add("infos");

        /////// Div nombre d'élève ///
        const nmbrContainer = document.createElement('div');
        infos.appendChild(nmbrContainer);

        const textNmbr = document.createElement('p');
        textNmbr.textContent = "Nombre d'élèves : ";
        nmbrContainer.appendChild(textNmbr);

        let studentNmbr = document.createElement('p');
        studentNmbr.textContent = element.students.length;
        nmbrContainer.appendChild(studentNmbr);
        studentNmbr.classList.add("number");

        /////// Div date d'entrée ///
        const startContainer = document.createElement('div');
        infos.appendChild(startContainer);

        const textStartDate = document.createElement('p');
        textStartDate.textContent = "Date de création : ";
        startContainer.appendChild(textStartDate);

        let promoStartDate = document.createElement('p');
        promoStartDate.textContent = new Date(element.startDate).toISOString().split("T")[0];
        startContainer.appendChild(promoStartDate);
        promoStartDate.classList.add("startdate");

        /////// Div date de fin ///
        const endContainer = document.createElement('div');
        infos.appendChild(endContainer);

        const textEndDate = document.createElement('p');
        textEndDate.textContent = "Date de Fin : ";
        endContainer.appendChild(textEndDate);

        let promoEndDate = document.createElement('p');
        promoEndDate.textContent = new Date(element.endDate).toISOString().split("T")[0];
        endContainer.appendChild(promoEndDate);
        promoEndDate.classList.add("enddate");

        /////// Création div contenant les buttons /////
        const buttons = document.createElement("div");
        promos.appendChild(buttons);
        buttons.classList.add("button");

        const buttonDetail = document.createElement("button");
        buttonDetail.textContent = "Voir Détails";
        buttons.appendChild(buttonDetail);
        buttonDetail.addEventListener("click", () => {
            window.location.href = "../pages/promo-details.html?id=" + element._id;
        })

        const buttonModif = document.createElement("button");
        buttonModif.textContent = "Modifier";
        buttons.appendChild(buttonModif);
        buttonModif.addEventListener("click", () => {
            modifArt(element._id, promos, element)
        })

        const buttonDelete = document.createElement("button");
        buttonDelete.textContent = "Supprimer";
        buttons.appendChild(buttonDelete);
        buttonDelete.addEventListener("click", () => {
            showModal()
            createValidation(element._id, promos);
        })

        // const addStudent = document.createElement('button');
        // addStudent.textContent = "Add Student";
        // buttons.appendChild(addStudent);
        // addStudent.classList.add("add-button");
        // addStudent.addEventListener("click", ()=>{
        //     
        // })
    });
}

/////////////////////////// Créer formulaire ADDpromo ///

function createPromo() {

    const labelName = document.createElement('label');
    labelName.textContent = "Nom de la Promo : ";
    addModal.appendChild(labelName);

    const inputName = document.createElement('input');
    addModal.appendChild(inputName);

    const labelStartDate = document.createElement('label');
    labelStartDate.textContent = "Début de la Promo : ";
    addModal.appendChild(labelStartDate);

    const inputStartDate = document.createElement('input');
    inputStartDate.type = "date";
    addModal.appendChild(inputStartDate);

    const labelEndDate = document.createElement('label');
    labelEndDate.textContent = "Fin de la Promo : ";
    addModal.appendChild(labelEndDate);

    const inputEndDate = document.createElement('input');
    inputEndDate.type = "date";
    addModal.appendChild(inputEndDate);

    const validateButton = document.createElement('button');
    validateButton.textContent = "Ajouter";
    addModal.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        const mypromo = {
            name: inputName.value,
            startDate: inputStartDate.value,
            endDate: inputEndDate.value
        }
        postPromo(mypromo)
        hideModal()
    })
}

//////////////////////// Modifier Promo /////////////////

function modifArt(id, promos, element) {

    const inputName = document.createElement('input');
    inputName.type = "text";
    inputName.value = element.name;
    console.log(promos);


    const inputStartDate = document.createElement('input');
    inputStartDate.type = "date";

    const inputEndDate = document.createElement('input');
    inputEndDate.type = "date";

    const divButton = document.createElement('div');
    divButton.classList.add("div-button");

    const validateButton = document.createElement('button');
    validateButton.textContent = "Valider";
    divButton.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        const modifPromo = {
            name: inputName.value,
            startDate: inputStartDate.value,
            endDate: inputEndDate.value
        }
        putPromo(id, modifPromo)
        getPromo()
    })

    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Annuler";
    divButton.appendChild(cancelButton);
    cancelButton.addEventListener("click", () => {
        getPromo()
    })

    promos.querySelector(".nom").replaceWith(inputName);
    promos.querySelector(".startdate").replaceWith(inputStartDate);
    promos.querySelector(".enddate").replaceWith(inputEndDate);
    promos.querySelector(".button").replaceWith(divButton);
}

///////////////////////// Créer Valitation de Suppression //////////

function createValidation(id, promos) {
    const validation = document.createElement('p');
    validation.textContent = "Voulez-vous supprimer cette promotions ?";
    addModal.appendChild(validation);

    const divButton = document.createElement('div');
    addModal.appendChild(divButton);

    const validateButton = document.createElement('button');
    validateButton.textContent = "Valider";
    divButton.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        deletePromo(id)
        promos.remove()
        hideModal()
    })

    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Annuler";
    divButton.appendChild(cancelButton);
    cancelButton.addEventListener("click", () => {
        hideModal()
    })
}

/////////////////////////////////// MODAL //////////////////

// Affiche le modal
function showModal() {
    addModal.style.display = "flex";
    modalOverlay.style.display = "block";
}

// Cache le modal 
function hideModal() {
    addModal.style.display = "none";
    modalOverlay.style.display = "none";
    addModal.textContent = ""
}

modalOverlay.addEventListener("click", hideModal);

/////////////////////////////////////////////////////////////////

getPromo()