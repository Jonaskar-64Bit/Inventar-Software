const inventoryList = document.getElementById('inventory-list');
const addItemButton = document.getElementById('add-item-btn');
const itemNameInput = document.getElementById('item-name');
const itemQuantityInput = document.getElementById('item-quantity');
const errorField = document.getElementById('errorField');
const newItemButton = document.getElementById('new-item-btn');

// Array für Inventar, aus localStorage laden oder leer starten
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

// Funktion: Inventarliste rendern
function renderInventory() {
    inventoryList.innerHTML = ''; // alte Einträge entfernen    
    inventoryItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Menge: ${item.quantity}`;
        inventoryList.appendChild(listItem);
    });
}
// Funktion: localStorage aktualisieren
function updateLocalStorage() {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}
// Neuer Artikel hinzufügen
addItemButton.addEventListener('click', function() {
    const itemName = itemNameInput.value.trim();
    const itemQuantity = parseInt(itemQuantityInput.value.trim(), 10);
    if (itemName !== '' && !isNaN(itemQuantity) && itemQuantity > 0) {
        inventoryItems.push({ name: itemName, quantity: itemQuantity });
        renderInventory();
        updateLocalStorage();
    } else {
        errorField.textContent = 'Bitte geben Sie einen Namen und eine Menge ein!';
        errorField.style.color = 'red';
        setTimeout(() => { errorField.textContent = ''; }, 3000);
    }
});