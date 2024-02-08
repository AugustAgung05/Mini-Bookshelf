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

function renderUserBookDone(){
    const userData = getUser();
    let bookListDone = document.getElementById("completeBookshelfList");
    bookListDone.innerHTML = "";
    let bookListNotDone = document.getElementById("incompleteBookshelfList");
    bookListNotDone.innerHTML = "";

    for(let user of userData){
        let bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.innerHTML = `<h3>${user.title}</h3>`;
        bookItem.innerHTML += `<p> Penulis \t: ${user.author} </p>`;
        bookItem.innerHTML += `<p> Tahun \t: ${user.year}</p>`

        let divAction = document.createElement("div");
        divAction.classList.add("action");
        
        let btnDelete = document.createElement("button");
        btnDelete.classList.add("red");
        btnDelete.innerHTML = "Hapus";
        
        let btnDone = document.createElement("button");
        btnDone.classList.add("green");
        btnDone.innerHTML = "Selesai dibaca";

        if (user.bookIsComplete === false){
            divAction.appendChild(btnDelete);
            divAction.appendChild(btnDone);
            bookItem.appendChild(divAction);
            bookListNotDone.appendChild(bookItem);
        } else {
            divAction.appendChild(btnDelete);
            divAction.appendChild(btnDone);
            bookItem.appendChild(divAction);
            bookListDone.appendChild(bookItem);
        }
    }
}
submitAction.addEventListener("submit", ()=>{
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
    const newBookUser = {
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        bookIsComplete: bookIsComplete
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
document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("red")) {
        const article = target.closest("article");
        const bookTitle = article.querySelector("h3").textContent;
        const userData = getUser();
        const index = userData.findIndex(item => item.title === bookTitle);

        if (index !== -1) {
            userData.splice(index, 1);
            localStorage.setItem(localStorageKey, JSON.stringify(userData));
            renderUserBookDone();
        }
    }

    if (target.classList.contains("green")) {
        const article = target.closest("article");
        const bookTitle = article.querySelector("h3").textContent;
        const userData = getUser();
        const index = userData.findIndex(item => item.title === bookTitle);
        if (index !== -1) {
            userData[index].bookIsComplete = true;
            localStorage.setItem(localStorageKey, JSON.stringify(userData));
            renderUserBookDone();
        }
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