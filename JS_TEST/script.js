let product = []
let core = document.getElementById("data-list-wrapper");
function fetchAndDisplayProducts() {
    fetch("http://localhost:3000/pitches")
    .then((res) => res.json())
    .then((data) => {
        product = data;
        localStorage.setItem("Products", JSON.stringify(data));
        return ProductCards(data);
    })
    .catch((err) => {
        console.log(err);
    });
}

function ProductCards(data) {
    let productCards = data.map((el) => {
        return generateProductCard(el.id, el.image, el.title, el.founder, el.category, el.price);
    });
    core.innerHTML = productCards.join("");
}

function generateProductCard(id, img, title, founder, category, price) {
    return `
    <div class="card" data-id="${id}">
                <div class="card-img">
                <a href="cart.html?title=${encodeURIComponent(title)}&image=${encodeURIComponent(img)}&founder=${encodeURIComponent(founder)}&category=${encodeURIComponent(category)}&price=${encodeURIComponent(price)}" id="just">
                  <img src="${img}" alt="pitch">
                </a>  
                </div>
              
                <div class="card-body">
                  <h4 class="card-title">${title}</h4>
                  <p class="card-founder">${founder}</p>
                  <p class="card-category">${category}</p>
                  <p class="card-price">${price}</p>
                  <a href="#" class="card-link" data-id="${id}">Edit</a>
                  <button class="card-button" data-id="${id}">Delete</button>
                </div>
              </div>
    `
}

fetchAndDisplayProducts();

let inputofadd = document.getElementById("pitch-title");
let inputofimage = document.getElementById("pitch-image");
let inputofcate = document.getElementById("pitch-category");
let inputprice = document.getElementById("pitch-price");
let addbotton = document.getElementById("add-pitch");

addbotton.addEventListener("click", addNewProduct);
function addNewProduct() {
    let newProduct = {
        title: inputofadd.value,
        image: inputofimage.value,
        category: inputofcate.value,
        price: inputprice.value
    };
    fetch("http://localhost:3000/pitches", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(newProduct)
    })
    .then((response) => response.json())
    .then(data => console.log("Success", data))
    .catch((err) => console.log("Error:", err));
}

document.addEventListener("click", (el) => {
    if (el.target.classList.contains("card-button")) {
        alert(" Do you want to delete this method")
        deleteProduct(el.target.dataset.id)
    }
})

function deleteProduct(id){
   fetch(`http://localhost:3000/pitches/${id}`, {
    method : "DELETE"
    })
}
let inputupdateid = document.getElementById("update-pitch-id");
let inputupdatetitle = document.getElementById("update-pitch-title");
let inputupdateimage = document.getElementById("update-pitch-image");
let inputudatefounder = document.getElementById("update-pitch-founder");
let inputupdatecate = document.getElementById("update-pitch-category");
let inputupdateprice = document.getElementById("update-pitch-price");
let pots = document.getElementById("update-pitch");

document.addEventListener("click", (el) => {
    if(el.target.classList.contains("card-link")){
        fetchProductDetails(el.target.dataset.id);
        console.log(el.target.dataset.id);
    }
})
function fetchProductDetails(id) {
    fetch(`http://localhost:3000/pitches/${id}`)
    .then((res) => res.json())
    .then(data => { UpdateForm(data) })
    .catch((err) => console.log("Error", err));
}

function UpdateForm(data) {
    inputupdateid.value = data.id;
    inputupdatetitle.value = data.title;
    inputupdateimage.value = data.image;
    inputudatefounder.value = data.founder;
    inputupdatecate.value = data.category;
    inputupdateprice.value = data.price;
}

function updateProduct() {
    let updatedProduct = {
        id: inputupdateid.value,
        title: inputupdatetitle.value,
        image: inputupdateimage.value,
        founder: inputudatefounder.value,
        category: inputupdatecate.value,
        price: inputupdateprice.value
    };
    console.log(updatedProduct);
    fetch(`http://localhost:3000/pitches/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(updatedProduct)
    })
    .then((response) => response.json())
    .then(data => console.log("Success", data))
    .catch((err) => console.log("Error:", err));
}

pots.addEventListener("click", updateProduct);

let AtoZ = document.getElementById("sort-low-to-high");
let ZtoA = document.getElementById("sort-high-to-low");
let foodFill = document.getElementById("filter-Food");
let ElectroFill = document.getElementById("filter-Electronics");
let PersonalFill = document.getElementById("filter-Personal-Care");

AtoZ.addEventListener("click", sortLowToHigh);
function sortLowToHigh() {
    let sortedData = product.sort((a, b) => a.price - b.price);
    ProductCards(sortedData);
}

ZtoA.addEventListener("click", sortHighToLow);
function sortHighToLow() {
    let sortedData = product.sort((a, b) => b.price - a.price);
    ProductCards(sortedData);
}

foodFill.addEventListener("click", () => filterByCategory("Food"));
function filterByCategory(category) {
    let filteredProducts = product.filter((el) => el.category === category);
    console.log(filteredProducts);
    ProductCards(filteredProducts);
}

ElectroFill.addEventListener("click", () => filterByCategory("Electronics"));
PersonalFill.addEventListener("click", () => filterByCategory("Personal Care"));
