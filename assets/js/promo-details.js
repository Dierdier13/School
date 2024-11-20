const API_KEY = "205091a7-5fc0-4ccf-86dd-ae7136ed715c";
const URL_API = "http://146.59.242.125:3009";
const urlParams = new URLSearchParams(window.location.search);
const promoId = urlParams.get('id');

const promoContainer = document.querySelector("#promosContainer");

/////////// Modal /////////

const addModal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".overlay")

////////////////////// Fonction GET Etudiands ////////////////

async function getStudent() {
    try {
        const response = await fetch(URL_API + "/promos/" + promoId, {
            method: "GET",
            headers: {
                authorization: "Bearer " + API_KEY
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const promo = await response.json();
        console.log(promo);
        displayStudent(promo)

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

////////////////////// Fonction GET avatar ////////////////

async function getAvatar(studentId) {
    try {
        const response = await fetch(URL_API + "/promos/" + promoId + "/students/" + studentId + "/avatar", {
            method: "GET",
            headers: {
                authorization: "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const avatarUrl = await response.blob();
        return URL.createObjectURL(avatarUrl)

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

////////////////////// Fonction POST Student ////////////////

async function postStudent(student, avatarFile) {
    try {
        const formData = new FormData();
        for (const key in student) {
            formData.append(key, student[key]);
        }

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await fetch(URL_API + "/promos/" + promoId + "/students", {
            method: "POST",
            headers: {
                authorization: "Bearer " + API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newStudent = await response.json();
        getStudent()

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

///////////////////// Fonction Ajouter Student ///////////////

function addStudent() {
    showModal()
    createStudent()
}

///////////////////// Fonction PUT promo ///////////////

async function putStudent(id, student, avatarFile) {
    try {
        const formData = new FormData();
        for (const key in student) {
            formData.append(key, student[key]);
        }

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        const response = await fetch(URL_API + "/promos/" + promoId + "/students/" + id, {
            method: "PUT",
            headers: {
                authorization: "Bearer " + API_KEY,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newStudent = await response.json();

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

///////////////////// Fonction DELETE promo ///////////////

async function deleteStudent(id) {
    try {
        const response = await fetch(URL_API + "/promos/" + promoId + "/students/" + id, {
            method: "DELETE",
            headers: {
                authorization: "Bearer " + API_KEY
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const promo = await response.json();

    } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar :", error);
    }
}

/////////////////////////// Fonction Affiche étudiant //////

function displayStudent(promo) {
    promoContainer.textContent = "";

    const titleContainer = document.createElement('h2');
    titleContainer.textContent = promo.name;
    promoContainer.appendChild(titleContainer);

    const nmbrStudent = document.createElement('h3');
    nmbrStudent.textContent = "Nombre d'élèves : " + promo.students.length;
    promoContainer.appendChild(nmbrStudent);
    nmbrStudent.classList.add("number-student")

    const studentsContainer = document.createElement('div');
    promoContainer.appendChild(studentsContainer);
    studentsContainer.classList.add("div-student");

    promo.students.forEach(async (element) => {

        const student = document.createElement("article");
        studentsContainer.appendChild(student);
        student.classList.add("promo");

        /////// Création div contenant les avatar et info /////

        const divAvatar = document.createElement('div');
        student.appendChild(divAvatar);
        divAvatar.classList.add('div-avatar-infos');

        /////// Création div contenant les avatars /////
        if (element.avatar) {
            const avatar = document.createElement('img');
            avatar.src = await getAvatar(element._id)
            divAvatar.appendChild(avatar);
            avatar.classList.add("avatar")
        }

        /////// Création div contenant les infos /////
        const infos = document.createElement("div");
        divAvatar.appendChild(infos);
        infos.classList.add("infos");

        /////// Div PréNom /////////
        const firstnameContainer = document.createElement('div');
        infos.appendChild(firstnameContainer);

        const textFirstname = document.createElement('p');
        textFirstname.textContent = "Prénon : ";
        firstnameContainer.appendChild(textFirstname);

        let studentFirstName = document.createElement('p');
        studentFirstName.textContent = element.firstName;
        firstnameContainer.appendChild(studentFirstName);
        studentFirstName.classList.add("prenom");

        /////// Div Nom /////////
        const lastnameContainer = document.createElement('div');
        infos.appendChild(lastnameContainer);

        const textLastname = document.createElement('p');
        textLastname.textContent = "Nom : ";
        lastnameContainer.appendChild(textLastname);

        let studentLastName = document.createElement('p');
        studentLastName.textContent = element.lastName;
        lastnameContainer.appendChild(studentLastName);
        studentLastName.classList.add("nom")

        /////// Div Age /////////
        const ageContainer = document.createElement('div');
        infos.appendChild(ageContainer);

        const textAge = document.createElement('p');
        textAge.textContent = "Âge : ";
        ageContainer.appendChild(textAge);

        let studentAge = document.createElement('p');
        studentAge.textContent = element.age;
        ageContainer.appendChild(studentAge);
        studentAge.classList.add("age");

        /////// Création div contenant les buttons /////
        const buttons = document.createElement("div");
        student.appendChild(buttons);
        buttons.classList.add("button");

        const buttonModif = document.createElement("button");
        buttonModif.textContent = "Modifier";
        buttons.appendChild(buttonModif);
        buttonModif.addEventListener("click", () => {
            modifArt(element._id, student, element)
        })

        const buttonDelete = document.createElement("button");
        buttonDelete.textContent = "Supprimer";
        buttons.appendChild(buttonDelete);
        buttonDelete.addEventListener("click", () => {
            showModal()
            createValidation(element._id, student)
        })
    });
}

/////////////////////////// Créer formulaire ADDStudent ///

 function createStudent() {

    const labelFirstname = document.createElement('label');
    labelFirstname.textContent = "Prénom : ";
    addModal.appendChild(labelFirstname);

    const inputFirstname = document.createElement('input');
    addModal.appendChild(inputFirstname);

    const labelLastname = document.createElement('label');
    labelLastname.textContent = "Nom : ";
    addModal.appendChild(labelLastname);

    const inputLastname = document.createElement('input');
    addModal.appendChild(inputLastname);

    const labelAge = document.createElement('label');
    labelAge.textContent = "Age : ";
    addModal.appendChild(labelAge);

    const inputAge = document.createElement('input');
    addModal.appendChild(inputAge);

    const inputAvatar = document.createElement('input');
    inputAvatar.type = "file";
    addModal.appendChild(inputAvatar);


    const validateButton = document.createElement('button');
    validateButton.textContent = "Ajouter";
    addModal.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        const myStudent = {
            firstName: inputFirstname.value,
            lastName: inputLastname.value,
            age: inputAge.value,
        }
        postStudent(myStudent, inputAvatar.files[0])
        hideModal()
    })
}

//////////////////////// Modifier Promo /////////////////

function modifArt(id, student, element) {

    const inputAvatar = document.createElement('input');
    inputAvatar.type = "file";

    const inputFirstname = document.createElement('input');
    inputFirstname.type = "text";
    inputFirstname.value = element.firstName;

    const inputLastname = document.createElement('input');
    inputLastname.type = "text";
    inputLastname.value = element.lastName;

    const inputAge = document.createElement('input');
    inputAge.type = "text";
    inputAge.value = element.age

    const divButton = document.createElement('div');
    divButton.classList.add("div-button");

    const validateButton = document.createElement('button');
    validateButton.textContent = "Valider";
    divButton.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        const modifStudent = {
            firstName: inputFirstname.value,
            lastName: inputLastname.value,
            age: inputAge.value
        }
        putStudent(id, modifStudent, inputAvatar.files[0])
        getStudent()
    })

    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Annuler";
    divButton.appendChild(cancelButton);
    cancelButton.addEventListener("click", () => {
        getStudent()
    })

    student.querySelector(".div-avatar-infos").classList.add("block")
    student.querySelector(".avatar").replaceWith(inputAvatar);
    student.querySelector(".prenom").replaceWith(inputFirstname);
    student.querySelector(".nom").replaceWith(inputLastname);
    student.querySelector(".age").replaceWith(inputAge);
    student.querySelector(".button").replaceWith(divButton);
}

///////////////////////// Créer Valitation de Suppression //////////

function createValidation(id, student) {
    const validation = document.createElement('p');
    validation.textContent = "Voulez-vous supprimer cette promotions ?";
    addModal.appendChild(validation);

    const divButton = document.createElement('div');
    addModal.appendChild(divButton);

    const validateButton = document.createElement('button');
    validateButton.textContent = "Valider";
    divButton.appendChild(validateButton);
    validateButton.addEventListener("click", () => {
        deleteStudent(id)
        student.remove()
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

getStudent()