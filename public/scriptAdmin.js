// ACTIVE LINK

const currentPage = location.pathname
const menuItems = document.querySelectorAll("a")

for (item of menuItems) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("link-active-admin")
    }
}

const ImageGallery = {
    previews: document.querySelectorAll('gallery-preview img'),
    highlight: document.querySelector('.gallery .highlight > img'),
    setImage(e) {
        const {target} = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    },
}

const ChefAvatarUpload = {
    input: "",
    preview: document.querySelector('.avatar-preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event) {
        const {files: fileList} = event.target
        ChefAvatarUpload.input = event.target

        if (ChefAvatarUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            ChefAvatarUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                ChefAvatarUpload.getContainer(image)
            }

            reader.readAsDataURL(file)
        })

        ChefAvatarUpload.input.files = ChefAvatarUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = ChefAvatarUpload
        const {files: fileList} = input

        if(fileList.lenght > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return truw
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        ChefAvatarUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer() {
        const div = document.querySelector('.avatar-preview')
        const divInput = document.querySelector('input[name="avatar_path"')
            div.classList.add('on')

            divInput.value += `Avatar importado com sucesso!`

            return div
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors()

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error) {
            Validate.displayError(input, results.error)
        }

    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error

        const inputToValidate = document.querySelector('.input-validate')
        inputToValidate.classList.add('wrong')

        const container = document.querySelector('.edit-content')
        container.parentNode.appendChild(div)

        input.focus()
    },
    clearErrors() {
        const errorDiv = document.querySelector('.error')
        const inputWithError = document.querySelector('.wrong')

        if (errorDiv) {
            errorDiv.remove()
            inputWithError.classList.remove('wrong')
        }
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if(!value.match(mailFormat)) {
            error = "Email inválido"
        }

        return {
            error,
            value   
        }
    }
}

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

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const {files: fileList} = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const {files: fileList} = input

        if(fileList.lenght > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return truw
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
            div.classList.add('photo')

            div.onclick = PhotosUpload.removePhoto

            div.appendChild(image)

            div.appendChild(PhotosUpload.getRemoveButton())

            return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"

        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event){
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}



