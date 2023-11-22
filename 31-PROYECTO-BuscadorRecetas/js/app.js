// www.themealdb.com/api/json/v1/1/categories.php categorias

//Iniciar app
function iniciarApp() {
    
// Selecotes
const selectCategorias = document.querySelector("#categorias");


if (selectCategorias){
    selectCategorias.addEventListener("change", obetnerRecetas);
    obetnerCategorias()
}
const favoritosDiv = document.querySelector(".favoritos")
if (favoritosDiv) {
    obtenerFavoritos()
}


// Instaciamos
const modal = new bootstrap.Modal("#modal", {})


    obetnerCategorias();

    function obetnerCategorias() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
        fetch(url)
            .then((res) => res.json())
            .then((data) => mostrarCategorias(data.categories));
    }


function mostrarCategorias(categorias) {
    if (selectCategorias) {
        categorias.forEach((categoria) => {
            const option = document.createElement("OPTION");

            option.value = categoria.strCategory;
            option.textContent = categoria.strCategory;

            selectCategorias.appendChild(option);
        });
    }
}

// Muestra recetas de una categoria

function obetnerRecetas(e) {
    console.log(e.target.value);
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.meals) {
                mostrarRecetas(data.meals);
            } else {
                console.log("No hay recetas disponibles para esta categoría.");
            }
        })
        .catch((error) => {
            console.error("Error al obtener recetas:", error);
        });
}

// Muestra las recetas
function mostrarRecetas(recetas = []) {
    limpiarHTML(resultado);
    recetas.forEach((receta) => {
        const { idMeal, strMeal, strMealThumb } = receta;

        // Contenedor recetas
        const contenedorRecetas = document.createElement("DIV");

        contenedorRecetas.classList.add("col-md-4");

        // Construir el card de recetas

        const recetasCard = document.createElement("DIV");

        recetasCard.classList.add("card", "mb-4");

        // Creamos la imagen

        const recetasImagen = document.createElement("IMG");

        recetasImagen.classList.add("card-img-top");
        recetasImagen.alt = `Imagen de la receta ${strMeal ?? receta.img}` 
        recetasImagen.src = strMealThumb ?? receta.img;

        // Body del card

        const recetaCardBody = document.createElement("DIV");
        recetaCardBody.classList.add(`card-body`);

        // Título

        const recetaHeading = document.createElement(`H3`);
        recetaHeading.classList.add("card-title", "mb-3");
        recetaHeading.textContent = strMeal ?? receta.title;

        // Botón

        const recetaButton = document.createElement("BUTTON");
        recetaButton.classList.add("btn", "btn-danger", "w-100");
        recetaButton.textContent = "Ver receta";


        //añadimos un evento al boton

        recetaButton.onclick = function(){
            seleccionarReceta(idMeal ?? receta.id)
        }

        recetaCardBody.appendChild(recetaHeading);
        recetaCardBody.appendChild(recetaButton);

        recetasCard.appendChild(recetasImagen);
        recetasCard.appendChild(recetaCardBody);

        contenedorRecetas.appendChild(recetasCard);

        resultado.appendChild(contenedorRecetas);
    });
}



// Limpiar HTML

function limpiarHTML(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}


//Seleccionar receta 

function seleccionarReceta(id){
    console.log(id)
    url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`

    fetch(url)
        .then((res)=>res.json())
        .then((data)=>mostrarRecetasModal(data.meals[0]))

}

// Mostrar la receta rn el modal

function mostrarRecetasModal(receta){
    console.log(receta)
    const {idMeal, strInstructions, strMeal, strMealThumb} = receta

    const modalTitle = document.querySelector(".modal .modal-title")
    const modalBody = document.querySelector(".modal .modal-body")


    modalTitle.textContent = strMeal

    modalBody.innerHTML = `
        <img class="img-fluid" src=${strMealThumb} alt=${strMeal}>
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
        `


    const listGroup = document.createElement("UL")
    listGroup.classList.add("list-group")

    //MOstramos
    for (let i=1; i<=20; i++) {
        if (receta[`strIngredient${i}`]) {
          const ingrediente = receta[`strIngredient${i}`]
          const cantidad = receta[`strMeasure${i}`]
  
        // console.log(`strIngredient${i} - strMeasure${i} `)
        const ingredientLi = document.createElement("LI")
        ingredientLi.classList.add("list-group-item")
        ingredientLi.textContent = `${cantidad} - ${ingrediente}`
  
        listGroup.appendChild(ingredientLi)
        }
    }
    modalBody.appendChild(listGroup)


    //Mostramos ,los botones 
    const modalFooter = document.querySelector(".modal-footer")

    limpiarHTML(modalFooter)

    const btnFavorito = document.createElement("BUTTON")

    existeFavorito(idMeal)
        ?btnFavorito.classList.add("btn", "btn-warning", "col")
        :btnFavorito.classList.add("btn", "btn-danger", "col")    
    btnFavorito.textContent = existeFavorito(idMeal)
        ? "Eliminar Favorito"
        : "Guardar Favorito"
    
    //Bton favorito


    modalFooter.appendChild(btnFavorito)
    btnFavorito.onclick = function(){
        if (existeFavorito(idMeal)){
            eliminarFavorito(idMeal)

            btnFavorito.textContent = "Guardar Favorito"
            btnFavorito.classList.remove("btn-danger")
            btnFavorito.classList.add("btn-warning")
            
            mostrarToast("Receta eliminado correctamente ")
            return
        }
        agregarFavorito({
            id:idMeal,
            title:strMeal,
            img:strMealThumb
        }
        )
        btnFavorito.textContent = "Borrar Favorito"
        btnFavorito.classList.add("btn-warning")
        btnFavorito.classList.remove("btn-danger")

        mostrarToast("Receta añadida correctamente ")
    }

    //Boton cerrar
    const btnCerrar = document.createElement("BUTTON")
    btnCerrar.classList.add("btn","btn-secondary","col")
    btnCerrar.textContent = "cerrar"


    modalFooter.appendChild(btnCerrar)


    // Funcion para el boton de cerrar el modal 
    btnCerrar.onclick = function() {
        modal.hide()
    }


    modal.show()
}

function agregarFavorito(receta){
    const favorito = JSON.parse(localStorage.getItem("recetasFavoritos")) ?? []

    localStorage.setItem(
        "recetasFavoritos", JSON.stringify([...favorito, receta] )
    )
}

function existeFavorito(id){
    const favoritos = JSON.parse(localStorage.getItem("recetasFavoritos")) ?? []

    return favoritos.some((favorito) => favorito.id === id)
}

function eliminarFavorito(id){
    const favoritos = JSON.parse(localStorage.getItem("recetasFavoritos")) ?? []
    const nuevosFavoritos = favoritos.filter((favorito) => favorito.id !== id)
    localStorage.setItem("recetasFavoritos", JSON.stringify(nuevosFavoritos))
}

// Funcion qeu muestra el toast

function mostrarToast(mensaje){
    const toastDiv = document.querySelector("#toast")
    const toastDivBody = document.querySelector(".toast-body")
    const toast = new bootstrap.Toast(toastDiv)
    toastDivBody.textContent = mensaje

    toast.show()
}

function obtenerFavoritos(){
    const favoritos = JSON.parse(localStorage.getItem("recetasFavoritos")) ?? []
    if (favoritos.length){
        mostrarRecetas(favoritos)
        return
    }
    const noFavoritos = document.createElement("p")
    noFavoritos.textContent = "No hay favoritos"
    noFavoritos.classList.add("fs-4", "text-center", "font-bold", "mt-5")
    noFavoritos.appendChild(noFavoritos)

    }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
