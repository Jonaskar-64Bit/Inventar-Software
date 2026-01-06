/* ============================================================
   Variablen - Inventar
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
   Inventar-Funktionen
============================================================ */
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems')) || [];

function renderInventory() {
    if (!inventoryList) return;
    inventoryList.innerHTML = '';

    inventoryItems.forEach((item, index) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = `${item.name} - Menge: ${item.quantity}`;
        li.appendChild(span);

        const editIcon = document.createElement('img');
        editIcon.classList.add('edit-icon');
        editIcon.src = document.body.classList.contains('dark-mode') 
                        ? 'images/edit-white.png'
                        : 'images/edit-black.png';
        editIcon.alt = 'Bearbeiten';
        li.appendChild(editIcon);

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

if (newItemButton && addItemSection) {
    newItemButton.addEventListener('click', () => {
        addItemSection.classList.toggle('show');

        newItemButton.textContent =
            addItemSection.classList.contains('show')
            ? 'Gegenstände hinzufügen abbrechen'
            : 'Neue Gegenstände hinzufügen';
    });
}

renderInventory();

/* ============================================================
   3D-Druck Kostenrechner (nur auf Seite mit ID prüfen)
============================================================ */
// ====================== Header & Dark Mode ======================
const body = document.body;
const darkToggle = document.getElementById("contrast-toggle");
const lightToggle = document.getElementById("contrast-toggle-light");

darkToggle.addEventListener("click", () => {
    body.classList.add("dark");
    darkToggle.style.display = "none";
    lightToggle.style.display = "inline";
});

lightToggle.addEventListener("click", () => {
    body.classList.remove("dark");
    darkToggle.style.display = "inline";
    lightToggle.style.display = "none";
});

// ====================== Einstellungen ============================
const settingsBtn = document.getElementById("settingsBtn");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const settingsSection = document.getElementById("settingsSection");

settingsBtn.addEventListener("click", () => {
    settingsSection.style.display = "block";
    settingsBtn.style.display = "none";
    settingsCloseBtn.style.display = "inline";
});
settingsCloseBtn.addEventListener("click", () => {
    settingsSection.style.display = "none";
    settingsBtn.style.display = "inline";
    settingsCloseBtn.style.display = "none";
});

// ====================== Daten & LocalStorage ====================
let filamentProfiles = JSON.parse(localStorage.getItem("filamentProfiles")) || [];
let printerProfiles = JSON.parse(localStorage.getItem("printerProfiles")) || [];
let electricityPrice = parseFloat(localStorage.getItem("electricityPrice")) || 0;

// Filament
const addFilamentBtn = document.getElementById("addFilamentBtn");
const filamentNameInput = document.getElementById("filamentName");
const filamentPriceInput = document.getElementById("filamentPrice");
const filamentList = document.getElementById("filamentList");
const filamentSelect = document.getElementById("filamentSelect");

addFilamentBtn.addEventListener("click", () => {
    const name = filamentNameInput.value.trim();
    const price = parseFloat(filamentPriceInput.value);
    if(name && !isNaN(price)){
        filamentProfiles.push({name, price});
        localStorage.setItem("filamentProfiles", JSON.stringify(filamentProfiles));
        filamentNameInput.value = "";
        filamentPriceInput.value = "";
        renderFilaments();
        updateFilamentSelect();
    }
});

function renderFilaments(){
    filamentList.innerHTML = "";
    filamentProfiles.forEach((f, index) => {
        const li = document.createElement("li");
        li.textContent = `${f.name} - ${f.price} €/kg `;
        const delBtn = document.createElement("button");
        delBtn.textContent = "Löschen";
        delBtn.addEventListener("click", () => {
            filamentProfiles.splice(index,1);
            localStorage.setItem("filamentProfiles", JSON.stringify(filamentProfiles));
            renderFilaments();
            updateFilamentSelect();
        });
        li.appendChild(delBtn);
        filamentList.appendChild(li);
    });
}

function updateFilamentSelect(){
    filamentSelect.innerHTML = "";
    filamentProfiles.forEach(f => {
        const option = document.createElement("option");
        option.value = f.price;
        option.textContent = f.name;
        filamentSelect.appendChild(option);
    });
}

// Drucker
const addPrinterBtn = document.getElementById("addPrinterBtn");
const printerNameInput = document.getElementById("printerName");
const printerPowerInput = document.getElementById("printerPower");
const printerList = document.getElementById("printerList");
const printerSelect = document.getElementById("printerSelect");

addPrinterBtn.addEventListener("click", () => {
    const name = printerNameInput.value.trim();
    const power = parseFloat(printerPowerInput.value);
    if(name && !isNaN(power)){
        printerProfiles.push({name, power});
        localStorage.setItem("printerProfiles", JSON.stringify(printerProfiles));
        printerNameInput.value = "";
        printerPowerInput.value = "";
        renderPrinters();
        updatePrinterSelect();
    }
});

function renderPrinters(){
    printerList.innerHTML = "";
    printerProfiles.forEach((p, index) => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - ${p.power} W `;
        const delBtn = document.createElement("button");
        delBtn.textContent = "Löschen";
        delBtn.addEventListener("click", () => {
            printerProfiles.splice(index,1);
            localStorage.setItem("printerProfiles", JSON.stringify(printerProfiles));
            renderPrinters();
            updatePrinterSelect();
        });
        li.appendChild(delBtn);
        printerList.appendChild(li);
    });
}

function updatePrinterSelect(){
    printerSelect.innerHTML = "";
    printerProfiles.forEach(p => {
        const option = document.createElement("option");
        option.value = p.power;
        option.textContent = p.name;
        printerSelect.appendChild(option);
    });
}

// Strompreis
const electricityPriceInput = document.getElementById("electricityPrice");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
electricityPriceInput.value = electricityPrice;

saveSettingsBtn.addEventListener("click", () => {
    const price = parseFloat(electricityPriceInput.value);
    if(!isNaN(price)){
        electricityPrice = price;
        localStorage.setItem("electricityPrice", electricityPrice);
        alert("Strompreis gespeichert!");
    }
});

// ====================== 3D-Druck Kalkulator =====================
const calculateBtn = document.getElementById("calculateBtn");
const printWeight = document.getElementById("printWeight");
const printTime = document.getElementById("printTime");
const result = document.getElementById("result");

calculateBtn.addEventListener("click", () => {
    const weight = parseFloat(printWeight.value); // g
    const time = parseFloat(printTime.value); // h
    const filamentPrice = parseFloat(filamentSelect.value); // €/kg
    const printerPower = parseFloat(printerSelect.value); // W

    if(isNaN(weight) || isNaN(time)){
        result.textContent = "Bitte Gewicht und Druckzeit korrekt angeben!";
        return;
    }

    const filamentCost = (weight / 1000) * filamentPrice; // € 
    const energyCost = (printerPower * time / 1000) * electricityPrice; // € 
    const total = filamentCost + energyCost;

    result.textContent = `Filamentkosten: ${filamentCost.toFixed(2)} € | Energiekosten: ${energyCost.toFixed(2)} € | Gesamt: ${total.toFixed(2)} €`;
});

// ====================== Initiales Rendern ========================
renderFilaments();
updateFilamentSelect();
renderPrinters();
updatePrinterSelect();
