// Elemnts
const welcomeSection = document.getElementById("welcomeSection");
const crudSection = document.getElementById("crudSection");
const goBtn = document.getElementById("goSystemBtn");
const addProductBtn = document.querySelectorAll(".add-product-btn");
const saveBtn = document.getElementById("saveProductBtn");
const clearAllBtn = document.getElementById("clearAllBtn");


// Modals => Product Modal , Confirm Modal
const productModal = new bootstrap.Modal(document.getElementById("productModal"));
const confirmModal =new bootstrap.Modal(document.getElementById("confirmModal"));
const confirmMsg = document.getElementById("confirmMessage"); 
const confirmYesBtn = document.getElementById("confirmYesBtn"); 


// inputs
const inputProductName = document.getElementById("productName");
const inputProductPrice = document.getElementById("productPrice");
const inputProductImage = document.getElementById("productImage");
const inputProductCetagory = document.getElementById("productCetagory");
const inputProductDescription = document.getElementById("productDescription");
// console.log(productName, productPrice,productImage , productCetagory, ProductDescription);


// Global Variables
let productsList = JSON.parse(localStorage.getItem("products")) || [];
let actionType = "";
let actionIndex= null;
isEditing = false;

// check from user
document.addEventListener("DOMContentLoaded", () => {
    if(sessionStorage.getItem("visited") === "true"){
        welcomeSection.classList.add("d-none");
        crudSection.classList.remove("d-none");
    }else{
        welcomeSection.classList.remove("d-none");
        crudSection.classList.add("d-none");
    }
})

// Go to CRUD system
goBtn.addEventListener("click", () => {
    // welcomeSection.style.display = "none";
    welcomeSection.classList.add("d-none");
    crudSection.classList.remove("d-none");
    // save user
    sessionStorage.setItem("visited", "true");
})


// Open Add Modal
// addProductBtn.addEventListener("click", () => {
//     productModal.show();
// })
addProductBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        isEditing = false;
        actionIndex = null;
        clearInputs();
        document.querySelector(".modal-title").textContent = "Add Product";
        document.querySelector(".modal-footer > .btn-secondary").classList.remove("d-none")
        saveBtn.textContent = "save";
        saveBtn.classList.replace("btn-outline-info", "btn-dark")
        isEditing = false;
        productModal.show();
    })
})

// Stop the default effect of the form
// document.querySelector("form").addEventListener("submit", e => e.preventDefault());
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
});


// save product
saveBtn.addEventListener("click", () => {
    if(!validateAll()) return;
    const imageFile = inputProductImage.files[0];
    const imagePath = imageFile 
        ? `images/${imageFile.name}` 
        : "images/placeholder.png";

    let product = {
        name: inputProductName.value,
        price: inputProductPrice.value,
        category: inputProductCetagory.value,
        description: inputProductDescription.value,
        // image: `images/${inputProductImage.files[0]?.name ?? "placeholder.png"}`
        image: imagePath
    }

    // share add or edit
    if(isEditing && actionIndex !== null){
        productsList[actionIndex] = product;
    }else{
        productsList.push(product);
    }

    localStorage.setItem("products",JSON.stringify(productsList));
    displayProducts();
    clearInputs();
    productModal.hide();
})

// Clear All Products
clearAllBtn.addEventListener("click", () => {
    actionType = "clear";
    confirmMsg.innerHTML = "Do you really want to clear all products?";
    confirmModal.show();
})

// Delete single product
function deleteProduct(index){
    actionType = "delete";
    actionIndex = index;
    confirmMsg.innerHTML = "Do you really want to delete this product?";
    confirmModal.show();

}


// Edit Product
function editProduct(index){
    isEditing = true;
    actionIndex = index;
    const product = productsList[index];
    
    inputProductName.value = product.name;
    inputProductPrice.value = product.price;
    inputProductCetagory.value = product.category;
    inputProductDescription.value = product.description;

    document.querySelector(".modal-title").textContent = "Edit Product";
    document.querySelector(".modal-footer > .btn-secondary").classList.add("d-none")
    saveBtn.textContent = "Update";
    saveBtn.classList.replace("btn-dark", "btn-outline-info");
    document.querySelector
    productModal.show();
    // setTimeout(() => validateAll(), 100);

}

// Confirm save => clear or delete
confirmYesBtn.addEventListener("click", () => {

    if(actionType === "delete"){
        productsList.splice(actionIndex, 1);
    }
    
    if(actionType === "clear"){
        productsList = [];
    }

    localStorage.setItem('products', JSON.stringify(productsList));
    displayProducts();
    confirmModal.hide();
    actionType = "";
    actionIndex = null;

})

// clear inputs
function clearInputs(){
    document.querySelector("form").reset();
    inputProductImage.value = null;
    const inputs = [inputProductName, inputProductPrice, inputProductImage, inputProductCetagory, inputProductDescription];
    inputs.forEach(inp => {
        inp.classList.remove("is-valid", "is-invalid")
    })
}


function displayProducts(){
    let productBox = ``;
    let len = productsList.length;
    for(let i=0; i< len ; i++){
        productBox += `
            <tr>
                <td>${i + 1}</td>
                <td><img src="${productsList[i].image}" alt="${productsList[i].name}"  style="width: 70px;" onerror="this.onerror=null; this.src='images/placeholder.png'"></td>
                <td>${productsList[i].name}</td>
                <td>${productsList[i].price}</td>
                <td>${productsList[i].category}</td>
                <td>${productsList[i].description}</td>
                <td class="text-nowrap">
                    <a class="text-info text-decoration-none cursor-pointer me-3" onclick="editProduct(${i})"><i class="fa-regular fa-pen-to-square"></i>Edit</a>
                    <a class="text-danger text-decoration-none cursor-pointer" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can"></i>Delete</a>
                </td>
                <td></td>
                <td></td>
            </tr>
        `;
    }
    document.getElementById("productData").innerHTML = productBox;
    productBox = null;

    // 
    const noProductDiv = document.getElementById("noProduct");
    const productsAvailability = document.getElementById("productsAvailability");

    if(len > 0){
        noProductDiv.classList.add("d-none");
        productsAvailability.classList.remove("d-none");
    }else{
        noProductDiv.classList.remove("d-none");
        productsAvailability.classList.add("d-none");
    }
}
displayProducts()
// console.log(productsList);



// validations
function validate(inputID){
    let input = document.getElementById(inputID);
    let regex;
    let value;

    switch(inputID){
        
        case "productName" : 
            regex = /^[a-zA-z][a-zA-Z0-9_ ]{3,25}$/;
            value = input.value.trim();
            break;
        case "productPrice" : 
            regex = /^[1-9][0-9]{1,6}$/;
            value = input.value;
            break;
        case "productImage" :
            if (!input.files[0]) {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid");
                return true;
            }
            regex = /\.(jpe?g|png|webp|svg)$/i;
            value = input.files[0].name;
            break;
        case "productCetagory" : 
            regex = /^(Women|Men|Children)$/;
            value = input.value.trim();
            break;
        case "productDescription" : 
            regex = /^.{4,50}$/m;
            value = input.value.trim();
            break;
        default: 
        return true;

    }
    const isValid = regex.test(value);
    if (isValid) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    } else {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }
    return isValid;
}
function validateAll(){
    const checks = [
        validate("productName"),
        validate("productPrice"),
        validate("productCetagory"),
        validate("productDescription"),
        validate("productImage")
    ]
    return checks.every(check => check === true)
}
// function validateAll() {
//     return (
//         validate("productName") &&
//         validate("productPrice") &&
//         validate("productCetagory") &&
//         validate("productDescription") &&
//         validate("productImage")
//     );
// }
inputProductName.addEventListener("input", () => validate("productName"));
inputProductPrice.addEventListener("input", () => validate("productPrice"));
inputProductImage.addEventListener("change", () => validate("productImage")); // change مش input
inputProductCetagory.addEventListener("input", () => validate("productCetagory"));
inputProductDescription.addEventListener("input", () => validate("productDescription"));
// /.validations
