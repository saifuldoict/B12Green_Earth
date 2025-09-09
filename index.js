let cart = [];

// Fetch Categories
const AllCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json) => showCategories(json.categories));
};

const showCategories = (categories) => {
  const categoriesContainer = document.getElementById("categories_container");
  categoriesContainer.innerHTML = "";
  for (let categorie of categories) {
    const categorieDiv = document.createElement("div");
    categorieDiv.innerHTML = `
      <button id="category_item-${categorie.id}"
      onclick="loadProductByCategory('${categorie.id}')"
        class="hover:bg-green-500 hover:text-white lesson_btn p-2 rounded-md">
        ${categorie.category_name}
      </button>
    `;
    categoriesContainer.append(categorieDiv);
  }
};

// Load Category
const loadProductByCategory = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      const category_item = document.getElementById(`category_item-${id}`);
      const all_category_items = document.getElementsByClassName("lesson_btn");
      for (let item of all_category_items) {
        item.classList.remove("active");
      }
      category_item.classList.add("active");
      const products = res.data || res.plants || [];
      allPlants(products);
      manageSpinner(false);
    })
}


// Spinner
const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("loading_indicator").classList.remove("hidden");
    document.getElementById("allPlants").classList.add("hidden");
  } else {
    document.getElementById("loading_indicator").classList.add("hidden");
    document.getElementById("allPlants").classList.remove("hidden");
  }
};

// Load Plants
const AllPlants = () => {
  manageSpinner(true);
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((res) => allPlants(res.plants));
};

const allPlants = (plants) => {
  const AllPlants = document.getElementById("allPlants");
  AllPlants.innerHTML = "";
  for (let plant of plants) {
    const plantDiv = document.createElement("div");
    plantDiv.classList.add("bg-white", "p-3", "rounded-lg", "shadow-md");

    plantDiv.innerHTML = `
      <img src="${plant.image}" class="w-full h-40 object-cover rounded-md"/>
      <h3 onClick="loadModel('${plant.id}')" 
          class="text-xl font-bold cursor-pointer hover:text-green-600">
        ${plant.name}
      </h3>
      <p class="text-sm text-gray-600">${plant.description.slice(0, 60)}...</p>
      <div class="flex justify-between mt-2">
        <button class="rounded-full bg-[#dcfce7] px-2 text-green-600 cursor-pointer">
          ${plant.category}
        </button>
        <button class="rounded-full px-2 cursor-pointer font-bold">
          ৳ ${plant.price}
        </button>
      </div>
      <button onclick="addToCart('${plant.id}','${plant.name}',${plant.price})" 
        class="w-full mt-3 rounded-full bg-green-800 px-4 py-2 text-white hover:bg-green-600">
        Add to Cart
      </button>
    `;
    AllPlants.append(plantDiv);
  }
  manageSpinner(false);
};

// Add to Cart
const addToCart = (id, name, price) => {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  renderCart();
};

// Remove Item from Cart
const removeFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
};

// Render Cart
const renderCart = () => {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.classList.add("flex", "justify-between", "items-center", "mb-2");

    li.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>৳ ${item.price * item.quantity}</span>
      <button onclick="removeFromCart('${item.id}')" 
        class="ml-2 text-red-500 hover:text-red-700">✕</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: ৳ ${total}`;
};

// Load Plant Details (Modal)
const loadModel = async (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordsDetails(details.plants);
};

const displayWordsDetails = (word) => {
  const detailsBox = document.getElementById("details_container");
  detailsBox.innerHTML = `
    <div class="bg-white p-2">
      <h3 class="text-xl font-bold">${word.name}</h3>
      <img src="${word.image}" class="w-[400px] h-40 mx-auto object-cover"/>
      <p>${word.description}</p>
      <div class="flex justify-between mt-2">
        <button class="rounded-full bg-[#dcfce7] px-2 text-green-400 cursor-pointer">
          ${word.category}
        </button>
        <button class="rounded-full px-2 cursor-pointer">৳ ${word.price}</button>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  `;
  document.getElementById("word_modal").showModal();
  manageSpinner(false);
};

// Clear Cart
document.getElementById("clear_btn").addEventListener("click", () => {
  cart = [];
  renderCart();
});

// Initialize
AllCategories();
AllPlants();
