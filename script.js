const inventoryList = document.getElementById('inventory-list');
const addItemButton = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemQuantityInput = document.getElementById('item-quantity');
const errorField = document.getElementById('errorField');
const newItemButton = document.getElementById('new-item-btn');
const contrastToggle = document.getElementById('contrast-toggle');
const contrastToggleLight = document.getElementById('contrast-toggle-light');

// Inventar laden
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

/* ---------- Inventar rendern ---------- */
function renderInventory() {
  inventoryList.innerHTML = '';
  inventoryItems.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - Menge: ${item.quantity}`;
    inventoryList.appendChild(listItem);
  });
}

/* ---------- LocalStorage speichern ---------- */
function updateLocalStorage() {
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}

/* ---------- Neuer Gegenstand hinzufügen ---------- */
addItemButton.addEventListener('click', function () {
  const itemName = itemNameInput.value.trim();
  const itemQuantity = parseInt(itemQuantityInput.value.trim(), 10);

  if (itemName !== '' && !isNaN(itemQuantity) && itemQuantity > 0) {
    inventoryItems.push({ name: itemName, quantity: itemQuantity });
    renderInventory();
    updateLocalStorage();
    errorField.textContent = '';
    itemNameInput.value = '';
    itemQuantityInput.value = '';
  } else {
    errorField.textContent = 'Bitte geben Sie einen Namen und eine Menge ein!';
    errorField.style.color = 'red';
    setTimeout(() => errorField.textContent = '', 3000);
  }
});

/* ---------- Theme-Toggle ---------- */
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  localStorage.setItem("theme", "dark");
  contrastToggle.style.display = "none";
  contrastToggleLight.style.display = "block";
}

function enableLightMode() {
  document.body.classList.remove('dark-mode');
  localStorage.setItem("theme", "light");
  contrastToggle.style.display = "block";
  contrastToggleLight.style.display = "none";
}

// Event-Listener Icons
contrastToggle.addEventListener("click", enableDarkMode);
contrastToggleLight.addEventListener("click", enableLightMode);

// Beim Laden gespeichertes Theme anwenden
if (localStorage.getItem("theme") === "dark") {
  enableDarkMode();
} else {
  enableLightMode();
}
