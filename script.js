/* ============================================================
   Variablen
============================================================ */
const inventoryList = document.getElementById('inventory-list');
const addItemButton = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemQuantityInput = document.getElementById('item-quantity');
const errorField = document.getElementById('errorField');
const newItemButton = document.getElementById('new-item-btn');
const addItemSection = document.getElementById('add-item-section');

const contrastToggle = document.getElementById('contrast-toggle');
const contrastToggleLight = document.getElementById('contrast-toggle-light');

/* ============================================================
   Dark / Light Mode Funktionen
============================================================ */
function updateIcons() {
    // Inventar-Seite: Icons für Trash & Stift wechseln
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
    if (contrastToggle) contrastToggle.style.display = "none";
    if (contrastToggleLight) contrastToggleLight.style.display = "block";
    updateIcons();
}

function enableLightMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem("theme", "light");
    if (contrastToggle) contrastToggle.style.display = "block";
    if (contrastToggleLight) contrastToggleLight.style.display = "none";
    updateIcons();
}

// Event-Listener für Theme-Buttons
if (contrastToggle && contrastToggleLight) {
    contrastToggle.addEventListener("click", enableDarkMode);
    contrastToggleLight.addEventListener("click", enableLightMode);
}

// Theme beim Laden anwenden
if (localStorage.getItem("theme") === "dark") {
    enableDarkMode();
} else {
    enableLightMode();
}

/* ============================================================
   Inventar-Funktionen (nur, wenn Inventar vorhanden)
============================================================ */
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

function renderInventory() {
    if (!inventoryList) return; // falls Inventar-Seite nicht da
    inventoryList.innerHTML = '';

    inventoryItems.forEach((item, index) => {
        const li = document.createElement('li');

        // Text
        const span = document.createElement('span');
        span.textContent = `${item.name} - Menge: ${item.quantity}`;
        li.appendChild(span);

        // Edit-Icon
        const editIcon = document.createElement('img');
        editIcon.classList.add('edit-icon');
        editIcon.src = document.body.classList.contains('dark-mode') 
                        ? 'images/edit-white.png'
                        : 'images/edit-black.png';
        editIcon.alt = 'Bearbeiten';
        li.appendChild(editIcon);

        // Trash-Icon
        const trashIcon = document.createElement('img');
        trashIcon.classList.add('trash-icon');
        trashIcon.src = document.body.classList.contains('dark-mode') 
                        ? 'images/trash-white.png'
                        : 'images/trash-black.png';
        trashIcon.alt = 'Löschen';
        li.appendChild(trashIcon);

        inventoryList.appendChild(li);
    });
}

function updateLocalStorage() {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}

// Neuer Gegenstand hinzufügen
if (addItemButton) {
    addItemButton.addEventListener('click', function () {
        const name = itemNameInput.value.trim();
        const quantity = parseInt(itemQuantityInput.value.trim(), 10);

        if (name !== '' && !isNaN(quantity) && quantity > 0) {
            inventoryItems.push({ name, quantity });
            renderInventory();
            updateLocalStorage();
            itemNameInput.value = '';
            itemQuantityInput.value = '';
            if (errorField) errorField.textContent = '';
        } else {
            if (errorField) {
                errorField.textContent = 'Bitte geben Sie einen Namen und eine Menge ein!';
                errorField.style.color = 'red';
                setTimeout(() => errorField.textContent = '', 3000);
            }
        }
    });
}

// Items editieren / löschen
if (inventoryList) {
    inventoryList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const index = Array.from(inventoryList.children).indexOf(li);

        if (e.target.classList.contains('trash-icon')) {
            inventoryItems.splice(index, 1);
            updateLocalStorage();
            renderInventory();
        } else if (e.target.classList.contains('edit-icon')) {
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
}

// Add-Item Section anzeigen / verstecken
if (newItemButton && addItemSection) {
    newItemButton.addEventListener('click', () => {
        if (addItemSection.style.display === 'none' || addItemSection.style.display === '') {
            addItemSection.style.display = 'block';
            newItemButton.textContent = 'Gegenstand hinzufügen abbrechen';
        } else {
            addItemSection.style.display = 'none';
            newItemButton.textContent = 'Neuen Gegenstand hinzufügen';
        }
    });
}

// Direkt Inventar rendern beim Laden
renderInventory();
