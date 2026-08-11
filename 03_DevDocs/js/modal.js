// ===========================================
// DevDocs — Create Modal Engine
// Config-driven, single-modal, multi-step form system.
// ===========================================

const newBtn = document.getElementById("newBtn");
const modalOverlay = document.getElementById("modalOverlay");
const createModal = document.getElementById("createModal");

let lastFocusedEl = null;
let currentFormType = null; // tracks which form is active, for validation/collection

// ===========================================
// Icon set — same stroke-based style as the
// sidebar (lucide), so the modal feels native
// to the rest of the app instead of using emoji.
// ===========================================

const icons = {

    note: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>`,

    project: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/><path d="M20.054 15.987H3.946"/></svg>`,

    website: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,

    knowledge: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="18" x="3" y="3" rx="1"/><path d="M7 3v18"/><path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"/></svg>`,

    image: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>`,

    pdf: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,

    bookmark: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/></svg>`,

    close: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,

    back: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`

};

// ===========================================
// CREATE MENU CONFIG
// Drives the top-level "Choose what to add" screen.
// ===========================================

const createOptions = [
    { key: "note",      title: "Note",               subtitle: "Upload notes, PDFs and study material",       icon: icons.note },
    { key: "project",   title: "Project",             subtitle: "Save coding projects and GitHub repositories", icon: icons.project },
    { key: "website",   title: "Website",             subtitle: "Save useful websites and links",               icon: icons.website },
    { key: "knowledge", title: "Knowledge Resource",  subtitle: "Courses, documentation and articles",          icon: icons.knowledge },
    { key: "image",     title: "Image",               subtitle: "Store diagrams and screenshots",               icon: icons.image },
    { key: "pdf",       title: "PDF",                 subtitle: "Books and PDF documents",                      icon: icons.pdf },
    { key: "bookmark",  title: "Bookmark",            subtitle: "Save important links",                         icon: icons.bookmark }
];

// ===========================================
// FORM CONFIG
// Single source of truth for every form's fields.
// Supported field types: "text", "url", "textarea", "select", "file"
//
// Each field:
// {
//   name:        unique key -> used in collected data object
//   label:       visible label text
//   type:        input type (drives which element is rendered)
//   placeholder: optional placeholder text
//   options:     required for type "select"
//   required:    whether validateForm() should enforce a value
//   accept:      optional accept attribute for file inputs
// }
// ===========================================

const forms = {

    note: {
        title: "Create Note",
        subtitle: "Add a new note to DevDocs.",
        submitLabel: "Create Note",
        fields: [
            { name: "title",       label: "Title",       type: "text",     placeholder: "React Notes",  required: true },
            { name: "category",    label: "Category",    type: "text",     placeholder: "Programming",  required: false },
            { name: "description", label: "Description", type: "textarea", placeholder: "Write something...", required: false }
        ]
    },

    project: {
        title: "Create Project",
        subtitle: "Save a coding project to DevDocs.",
        submitLabel: "Create Project",
        fields: [
            { name: "name",        label: "Project Name", type: "text",     placeholder: "DevDocs",                     required: true },
            { name: "githubLink",  label: "GitHub Link",  type: "url",      placeholder: "https://github.com/...",      required: false },
            { name: "liveDemo",    label: "Live Demo",    type: "url",      placeholder: "https://project.vercel.app",  required: false },
            { name: "techStack",   label: "Tech Stack",   type: "text",     placeholder: "HTML, CSS, JavaScript",       required: false },
            { name: "description", label: "Description",  type: "textarea", placeholder: "What does this project do?", required: false }
        ]
    },

    website: {
        title: "Save Website",
        subtitle: "Add a useful website to DevDocs.",
        submitLabel: "Save Website",
        fields: [
            { name: "name",        label: "Name",        type: "text",     placeholder: "MDN Web Docs",    required: true },
            { name: "url",         label: "URL",         type: "url",      placeholder: "https://...",     required: true },
            { name: "category",    label: "Category",    type: "text",     placeholder: "Reference",       required: false },
            { name: "description", label: "Description", type: "textarea", placeholder: "Write something...", required: false }
        ]
    },

    knowledge: {
        title: "Add Knowledge Resource",
        subtitle: "Courses, documentation and articles.",
        submitLabel: "Add Resource",
        fields: [
            { name: "resourceName", label: "Resource Name", type: "text", placeholder: "CS50",                required: true },
            {
                name: "resourceType",
                label: "Type",
                type: "select",
                required: false,
                options: ["Course", "Documentation", "Article", "Video", "Other"]
            },
            { name: "url",   label: "URL",   type: "url",      placeholder: "https://...",         required: false },
            { name: "notes", label: "Notes", type: "textarea", placeholder: "Write something...",  required: false }
        ]
    },

    image: {
        title: "Add Image",
        subtitle: "Store a diagram or screenshot.",
        submitLabel: "Add Image",
        fields: [
            { name: "title",       label: "Title",       type: "text",     placeholder: "Architecture Diagram", required: true },
            { name: "upload",      label: "Upload",      type: "file",     accept: "image/*",                   required: false },
            { name: "description", label: "Description", type: "textarea", placeholder: "Write something...",   required: false }
        ]
    },

    pdf: {
        title: "Add PDF",
        subtitle: "Store a book or PDF document.",
        submitLabel: "Add PDF",
        fields: [
            { name: "title",    label: "Title",    type: "text", placeholder: "Clean Code",     required: true },
            { name: "upload",   label: "Upload",   type: "file", accept: "application/pdf",      required: false },
            { name: "category", label: "Category", type: "text", placeholder: "Software Engineering", required: false }
        ]
    },

    bookmark: {
        title: "Add Bookmark",
        subtitle: "Save an important link.",
        submitLabel: "Add Bookmark",
        fields: [
            { name: "name", label: "Name", type: "text", placeholder: "DevDocs Roadmap", required: true },
            { name: "url",  label: "URL",  type: "url",  placeholder: "https://...",     required: true }
        ]
    }

};

// ===========================================
// FIELD RENDERERS
// Maps a field type to its markup. Add a new
// entry here to support a new field type without
// touching any form logic.
// ===========================================

const fieldRenderers = {

    text: (field) => `
        <input
            type="text"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            data-required="${!!field.required}"
        >
    `,

    url: (field) => `
        <input
            type="url"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            data-required="${!!field.required}"
        >
    `,

    textarea: (field) => `
        <textarea
            name="${field.name}"
            rows="5"
            placeholder="${field.placeholder || ""}"
            data-required="${!!field.required}"
        ></textarea>
    `,

    select: (field) => `
        <select name="${field.name}" data-required="${!!field.required}">
            <option value="" disabled selected>Select...</option>
            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
        </select>
    `,

    file: (field) => `
        <input
            type="file"
            name="${field.name}"
            accept="${field.accept || ""}"
            data-required="${!!field.required}"
        >
    `

};

// ===========================================
// OPEN / CLOSE
// ===========================================

newBtn.addEventListener("click", openModal);

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {

    if (!modalOverlay.classList.contains("show")) return;

    if (e.key === "Escape") {
        closeModal();
    }

    if (e.key === "Tab") {
        trapFocus(e);
    }

});

function openModal() {

    lastFocusedEl = document.activeElement;

    renderCreateMenu();

    modalOverlay.classList.add("show");
    document.body.classList.add("modal-open"); // locks background scroll, see modal.css

    requestAnimationFrame(() => {
        createModal.querySelector(".close-btn")?.focus();
    });

}

function closeModal() {

    modalOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");

    currentFormType = null;

    if (lastFocusedEl) lastFocusedEl.focus();

}

function trapFocus(e) {

    const focusable = createModal.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }

}

// ===========================================
// RENDER — CREATE MENU
// ===========================================

function renderCreateMenu() {

    currentFormType = null;

    const optionsHTML = createOptions.map((opt, i) => `
        <div class="create-option"
             role="button"
             tabindex="0"
             data-key="${opt.key}"
             data-cursor-text="Add"
             style="--stagger-index:${i}">

            <div class="option-left">

                <div class="option-icon">${opt.icon}</div>

                <div>
                    <div class="option-title">${opt.title}</div>
                    <div class="option-subtitle">${opt.subtitle}</div>
                </div>

            </div>

            <div class="option-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>

        </div>
    `).join("");

    createModal.innerHTML = `
        <button class="close-btn" data-cursor-text="Close" aria-label="Close">${icons.close}</button>

        <div class="modal-header">
            <h2>Create</h2>
            <p>Choose what you'd like to add to DevDocs</p>
        </div>

        <div class="option-list">
            ${optionsHTML}
        </div>
    `;

    createModal.querySelector(".close-btn").addEventListener("click", closeModal);

    // Event delegation: one listener for the whole option list
    // instead of one per option.
    createModal.querySelector(".option-list").addEventListener("click", (e) => {
        const option = e.target.closest(".create-option");
        if (!option) return;
        renderForm(option.dataset.key);
    });

    createModal.querySelector(".option-list").addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const option = e.target.closest(".create-option");
        if (!option) return;
        e.preventDefault();
        renderForm(option.dataset.key);
    });

}

// ===========================================
// RENDER — FORM (fully config-driven)
// ===========================================

function renderForm(type) {

    const config = forms[type];

    if (!config) {
        console.error(`No form config found for type: "${type}"`);
        return;
    }

    currentFormType = type;

    const fieldsHTML = config.fields.map(field => `
        <label>${field.label}</label>
        ${fieldRenderers[field.type](field)}
        <p class="field-error" data-error-for="${field.name}"></p>
    `).join("");

    createModal.innerHTML = `
        <button class="back-btn" data-cursor-text="Back" aria-label="Back">${icons.back}</button>

        <button class="close-btn" data-cursor-text="Close" aria-label="Close">${icons.close}</button>

        <div class="modal-header">
            <h2>${config.title}</h2>
            <p>${config.subtitle}</p>
        </div>

        <form class="form" id="dynamicForm" novalidate>
            ${fieldsHTML}
            <button type="submit" class="submit-btn">${config.submitLabel}</button>
        </form>
    `;

    createModal.querySelector(".back-btn").addEventListener("click", backToMenu);
    createModal.querySelector(".close-btn").addEventListener("click", closeModal);

    createModal.querySelector("#dynamicForm").addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormSubmit(type);
    });

    // Focus the first input for a smoother keyboard flow
    requestAnimationFrame(() => {
        createModal.querySelector("#dynamicForm input, #dynamicForm select, #dynamicForm textarea")?.focus();
    });

}

function backToMenu() {
    renderCreateMenu();
}

// ===========================================
// DATA COLLECTION
// Reads the currently rendered form and returns
// a plain object keyed by field name.
// ===========================================

function collectFormData(type) {

    const config = forms[type];
    const formEl = createModal.querySelector("#dynamicForm");
    const data = { type };

    config.fields.forEach(field => {

        const input = formEl.querySelector(`[name="${field.name}"]`);

        if (field.type === "file") {
            data[field.name] = input.files[0] || null;
        } else {
            data[field.name] = input.value.trim();
        }

    });

    return data;

}

// ===========================================
// VALIDATION
// Checks required fields, marks invalid inputs,
// and surfaces inline error messages.
// Returns true if the form is valid.
// ===========================================

function validateForm(type) {

    const config = forms[type];
    const formEl = createModal.querySelector("#dynamicForm");
    let isValid = true;

    // Clear previous error state
    formEl.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    formEl.querySelectorAll(".input-invalid").forEach(el => el.classList.remove("input-invalid"));

    config.fields.forEach(field => {

        if (!field.required) return;

        const input = formEl.querySelector(`[name="${field.name}"]`);
        const errorEl = formEl.querySelector(`[data-error-for="${field.name}"]`);

        const hasValue = field.type === "file"
            ? input.files.length > 0
            : input.value.trim().length > 0;

        if (!hasValue) {
            isValid = false;
            input.classList.add("input-invalid");
            if (errorEl) errorEl.textContent = `${field.label} is required.`;
        }

    });

    return isValid;

}

// ===========================================
// SAVE
// Placeholder persistence layer. Will later
// delegate to storage.js.
// ===========================================

function saveForm(data){

    const item = addItem(data);

    console.log("Saved:", item);

    return item;

}

// ===========================================
// SUBMIT HANDLER
// Orchestrates validate -> collect -> save.
// ===========================================

function handleFormSubmit(type) {

    if (!validateForm(type)) return;

    const data = collectFormData(type);

    saveForm(data);

    closeModal();

}