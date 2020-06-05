

document.querySelector(".add-ingredient").addEventListener("click", addIgredient)
document.querySelector(".add-preparation").addEventListener("click", addPreparation)


function addIgredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    //Clona o ultimo ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    //Não adiciona um novo input se o ultimo esta vazio
    if (newField.children[0].value == "") return false;

    //Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}

function addPreparation() {
    const preparations = document.querySelector("#preparations");
    const fieldContainer = document.querySelectorAll(".preparation");

    //Clona o ultimo ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    //Não adiciona um novo input se o ultimo esta vazio
    if (newField.children[0].value == "") return false;

    //Deixa o valor do input vazio
    newField.children[0].value = "";
    preparations.appendChild(newField);
}