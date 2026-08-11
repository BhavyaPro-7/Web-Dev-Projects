const recentItems = [
    {
        title:"Java Notes",
        type:"note",
        icon:"📄"
    },
    {
        title:"CSS Variables",
        type:"note",
        icon:"📄"
    },
    {
        title:"MDN",
        type:"website",
        icon:"🔖"
    }
];

if (!localStorage.getItem("recentItems")) {
    localStorage.setItem(
        "recentItems",
        JSON.stringify([])
    );
}

const recentList = document.getElementById("recent-list")

function renderRecentItems(){

    let recentItems = JSON.parse(localStorage.getItem("recentItems"))
    recentList.innerHTML = ""
    recentItems.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("activity-card");
        card.classList.add(item.type)
        card.innerHTML = `
        <span>${item.icon}</span>
        <h3>${item.title}</h3>
        <p>${item.type}</p>
        `;

        recentList.appendChild(card);
    });
}
renderRecentItems();

function addRecentItem(item){
    const data = localStorage.getItem("recentItems");
    let recentItems = JSON.parse(data) || [];

    recentItems = recentItems.filter(recent => recent.title !== item.title);

    recentItems.unshift(item);

    localStorage.setItem("recentItems",JSON.stringify(recentItems));

    renderRecentItems();
}
addRecentItem({
    title: "React Basics",
    type: "note",
    icon: "⚛️"
});

