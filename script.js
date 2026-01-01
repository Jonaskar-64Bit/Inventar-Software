const inventoryList = document.getElementById('inventory-list');
const addItemButton = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemQuantityInput = document.getElementById('item-quantity');
const errorField = document.getElementById('errorField');
const newItemButton = document.getElementById('new-item-btn');
const contrastToggle = document.getElementById('contrast-toggle');
const contrastToggleLight = document.getElementById('contrast-toggle-light');
const newItemButton = document.getElementById('new-item-btn');
const addItemSection = document.getElementById('add-item-section');


// Inventar laden
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

/* ---------- Inventar rendern ---------- */
function renderInventory() {
    inventoryList.innerHTML = '';

    inventoryItems.forEach(item => {
        const li = document.createElement('li');
        li.dataset.id = item.id; // falls du IDs nutzt

        // Text des Items
        const span = document.createElement('span');
        span.textContent = `${item.name} - Menge: ${item.quantity}`;
        li.appendChild(span);

        // Stift-Icon
        const editIcon = document.createElement('img');
        editIcon.classList.add('edit-icon');
        editIcon.src = document.body.classList.contains('dark-mode') 
                        ? 'images/edit-white.png'
                        : 'images/edit-black.png';
        editIcon.alt = 'Bearbeiten';
        editIcon.style.cursor = 'pointer';
        li.appendChild(editIcon);

        // Trash-Icon
        const trashIcon = document.createElement('img');
        trashIcon.classList.add('trash-icon');
        trashIcon.src = document.body.classList.contains('dark-mode') 
                        ? 'images/trash-white.png'
                        : 'images/trash-black.png';
        trashIcon.alt = 'Löschen';
        trashIcon.style.cursor = 'pointer';
        li.appendChild(trashIcon);

        inventoryList.appendChild(li);
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
function updateIcons() {
    document.querySelectorAll('.edit-icon').forEach(img => {
        img.src = document.body.classList.contains('dark-mode') 
                  ? 'images/edit-white.png' 
                  : 'images/edit-black.png';
    });
    document.querySelectorAll('.trash-icon').forEach(img => {
        img.src = document.body.classList.contains('dark-mode') 
                  ? 'images/trash-white.png' 
                  : 'images/trash-black.png';
    });
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem("theme", "dark");
    contrastToggle.style.display = "none";
    contrastToggleLight.style.display = "block";

    updateIcons(); // Icons anpassen
}

function enableLightMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem("theme", "light");
    contrastToggle.style.display = "block";
    contrastToggleLight.style.display = "none";

    updateIcons(); // Icons anpassen
}

inventoryList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    const index = Array.from(inventoryList.children).indexOf(li);

    if (e.target.classList.contains('trash-icon')) {
        // Löschen
        inventoryItems.splice(index, 1);
        updateLocalStorage();
        renderInventory();
    } else if (e.target.classList.contains('edit-icon')) {
        // Bearbeiten (z.B. prompt zum Ändern)
        const newName = prompt('Neuer Name:', inventoryItems[index].name);
        const newQuantity = parseInt(prompt('Neue Menge:', inventoryItems[index].quantity));
        if (newName && !isNaN(newQuantity) && newQuantity > 0) {
            inventoryItems[index].name = newName;
            inventoryItems[index].quantity = newQuantity;
            updateLocalStorage();
            renderInventory();
        }
    }
});



// Event-Listener Icons
contrastToggle.addEventListener("click", enableDarkMode);
contrastToggleLight.addEventListener("click", enableLightMode);

newItemButton.addEventListener('click', () => {
    // Toggle: Wenn versteckt → zeigen, wenn sichtbar → verstecken
    if (addItemSection.style.display === 'none') {
        addItemSection.style.display = 'block';
        // Optional: Button-Text ändern
        newItemButton.textContent = 'Gegenstand hinzufügen abbrechen';
    } else {
        addItemSection.style.display = 'none';
        newItemButton.textContent = 'Neuen Gegenstand hinzufügen';
    }
});


// Beim Laden gespeichertes Theme anwenden
if (localStorage.getItem("theme") === "dark") {
  enableDarkMode();
} else {
  enableLightMode();
}

// Inventar direkt nach dem Laden rendern
renderInventory();
