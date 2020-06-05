const cards = document.querySelectorAll('.card')
for (let card of cards) {
    card.addEventListener("click", function(){
        let RecipeId = card.getAttribute("id");
        window.location.href = `/receitas/${RecipeId}`
    })
}


let buttonIngredients = document.querySelector ('.button-ingredients')
let buttonPrepare = document.querySelector ('.button-prepare')
let buttonInfo = document.querySelector ('.button-info')
    

buttonIngredients.addEventListener('click', function(){
    let contentIngredients = document.querySelector('.content-ingredients')
    
    
        if(buttonIngredients.textContent == 'ESCONDER') {
            buttonIngredients.textContent = 'MOSTRAR'
            contentIngredients.classList.remove('active')
    
        } else {
            buttonIngredients.textContent = 'ESCONDER'
            contentIngredients.classList.add('active')
        }
    })

buttonPrepare.addEventListener('click', function(){
let contentPrepare = document.querySelector('.content-prepare')


    if(buttonPrepare.textContent == 'ESCONDER') {
        buttonPrepare.textContent = 'MOSTRAR'
        contentPrepare.classList.remove('active')

    } else {
        buttonPrepare.textContent = 'ESCONDER'
        contentPrepare.classList.add('active')
    }
})

buttonInfo.addEventListener('click', function(){
let contentInfo = document.querySelector('.content-info')


    if(buttonInfo.textContent == 'ESCONDER') {
        buttonInfo.textContent = 'MOSTRAR'
        contentInfo.classList.remove('active')

    } else {
        buttonInfo.textContent = 'ESCONDER'
        contentInfo.classList.add('active')
    }
})
