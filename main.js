const localStorageKey = "BOOKSHELF_APPS";
const submitAction = document.getElementById("inputBook");

function checkStorage() {
    return typeof(Storage) !== "undefined";
}

function getUser(){
    if (checkStorage()){
        return JSON.parse(localStorage.getItem(localStorageKey)) || [];
    } else {
        return [];
    }
}

function putUser(obb){
    if (checkStorage()){
        let data = [];
        if(localStorage.getItem(localStorageKey) !== null){
            data = JSON.parse(localStorage.getItem(localStorageKey));
        }
        data.unshift(obb);
        if (data.length > 5){
            data.pop();
        }
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    }
}

function generateId() {
    return +new Date();
}

function renderUserBookDone() {
    const userData = getUser();
    let bookListDone = document.getElementById("completeBookshelfList");
    bookListDone.innerHTML = "";
    let bookListNotDone = document.getElementById("incompleteBookshelfList");
    bookListNotDone.innerHTML = "";

    userData.forEach(user => {
        let bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.innerHTML = `<h3>${user.title}</h3>`;
        bookItem.innerHTML += `<p> Penulis: ${user.author} </p>`;
        bookItem.innerHTML += `<p> Tahun: ${user.year}</p>`;

        let divAction = document.createElement("div");
        divAction.classList.add("action");

        let btnDelete = document.createElement("button");
        btnDelete.classList.add("red");
        btnDelete.innerHTML = "Hapus";
        btnDelete.addEventListener("click", () => {
            const index = userData.indexOf(user);
            userData.splice(index, 1);
            localStorage.setItem(localStorageKey, JSON.stringify(userData));
            renderUserBookDone();
        });

        let btnToggle = document.createElement("button");
        btnToggle.classList.add("green");
        btnToggle.innerHTML = user.IsComplete ? "Belum selesai dibaca" : "Selesai dibaca";
        btnToggle.addEventListener("click", () => {
            user.IsComplete = !user.IsComplete;
            localStorage.setItem(localStorageKey, JSON.stringify(userData));
            renderUserBookDone();
        });

        divAction.appendChild(btnDelete);
        divAction.appendChild(btnToggle);
        bookItem.appendChild(divAction);

        if (user.IsComplete) {
            bookListDone.appendChild(bookItem);
        } else {
            bookListNotDone.appendChild(bookItem);
        }
    });
}
submitAction.addEventListener("submit", ()=>{
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = parseInt(document.getElementById("inputBookYear").value);
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
    const uniqueId = generateId();
    const newBookUser = {
        id: uniqueId,
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        IsComplete: bookIsComplete
    }
    putUser(newBookUser);
    renderUserBookDone();
});
window.addEventListener('load', () => {
    if (checkStorage()) {
        if (localStorage.getItem(localStorageKey) !== null) {
        renderUserBookDone();
    }
} else {
    alert('Browser yang Anda gunakan tidak mendukung Web Storage');
}
});

const searchBooks = document.getElementById("searchBook");
searchBooks.addEventListener("submit", (e) =>{
    e.preventDefault();
    const input = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookItems = document.querySelectorAll(".book_item");

    bookItems.forEach((item) => {
        const title = item.querySelector("h3").textContent.toLowerCase();
        if (title.includes(input)){
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
})