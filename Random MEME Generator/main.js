const generateMemeBtn = document.querySelector(".generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const memeAuthor = document.querySelector(".meme-generator .meme-author");
const downloadLink = document.getElementById("download-link");
const commentInput = document.getElementById("comment-input");
const submitCommentBtn = document.getElementById("submit-comment");
const commentsList = document.querySelector(".comments-list");

// Update detail meme
const updateDetails = (url, title, author) => {
    memeImage.setAttribute("src", url);
    memeTitle.innerHTML = title;
    memeAuthor.innerHTML = `Meme by: ${author}`;

    // Set up the download link
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", title.replace(/\s+/g, '-') + '.png'); // Ganti spasi dengan tanda hubung dan tambahkan .png extension
    downloadLink.style.display = "inline-block"; // Tampilkan link download
    downloadLink.onclick = () => downloadImage(url); // Panggil fungsi downloadImage saat link di-klik
};

// Menghasilkan meme
const generateMeme = () => {
    fetch("https://meme-api.com/gimme")
        .then((response) => response.json())
        .then((data) => {
            updateDetails(data.url, data.title, data.author);
        })
        .catch((error) => {
            console.error("Error fetching meme:", error);
            updateDetails("", "Error loading meme", "");
        });
};

// Mengunduh gambar
const downloadImage = (url) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Mengatasi CORS
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const downloadUrl = canvas.toDataURL("image/png");
        downloadLink.setAttribute("href", downloadUrl);
        downloadLink.click(); // Memicu klik pada link download
    };
    img.src = url;
};

// Menangani pengiriman komentar
const submitComment = () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentLi = document.createElement("li"); // Membuat elemen <li> untuk komentar
        commentLi.classList.add("comment");
        
        // Memisahkan nama penulis dan isi komentar
        const authorSpan = document.createElement("span");
        authorSpan.classList.add("comment-author");
        authorSpan.textContent = "User"; // Ganti dengan nama pengguna sesuai kebutuhan

        const textSpan = document.createElement("span");
        textSpan.classList.add("comment-text");
        textSpan.textContent = commentText;

        commentLi.appendChild(authorSpan);
        commentLi.appendChild(textSpan);
        commentsList.appendChild(commentLi);
        commentInput.value = ""; // Kosongkan textarea setelah komentar ditambahkan
    }
};

// Menangani penghapusan semua komentar
const clearComments = () => {
    commentsList.innerHTML = ""; // Menghapus semua konten dalam daftar komentar
};

generateMemeBtn.addEventListener("click", generateMeme);
submitCommentBtn.addEventListener("click", submitComment);
document.getElementById("clear-comments").addEventListener("click", clearComments); // Tambahkan event listener untuk tombol hapus
generateMeme(); // Menghasilkan meme saat halaman dimuat
