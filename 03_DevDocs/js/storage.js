// ===========================================
// DevDocs Storage Engine
// ===========================================

const STORAGE_KEY = "devdocs-data";

// Get all items
function getItems() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

// Save entire array
function saveItems(items) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
    );
}

// Add one item
function addItem(item) {

    const items = getItems();

    const newItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        favourite: false,
        archived: false,
        ...item
    };

    items.unshift(newItem);

    saveItems(items);

    return newItem;
}

// Delete item
function deleteItem(id) {

    const items = getItems().filter(item => item.id !== id);

    saveItems(items);

}

// Update item
function updateItem(id, updates) {

    const items = getItems().map(item => {

        if (item.id !== id) return item;

        return {
            ...item,
            ...updates
        };

    });

    saveItems(items);

}

// Get one item
function getItem(id) {

    return getItems().find(item => item.id === id);

}

// Clear everything
function clearStorage() {

    localStorage.removeItem(STORAGE_KEY);

}