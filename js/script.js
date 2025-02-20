// slider
let slideIndex = 0;
const slides = document.querySelector(".slides");
const totalSlides = document.querySelectorAll(".slide").length;

function moveSlide(step) {
  slideIndex += step;
  if (slideIndex < 0) slideIndex = totalSlides - 1;
  if (slideIndex >= totalSlides) slideIndex = 0;
  updateSlidePosition();
}

function updateSlidePosition() {
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

function autoSlide() {
  moveSlide(1);
}
setInterval(autoSlide, 3000); // Auto slide setiap 3 detik

// Inisialisasi keranjang dari localStorage (agar tetap ada setelah refresh)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Tambahkan produk ke dalam cart
function addToCart(name, price, image) {
  event.preventDefault(); // Mencegah reload halaman

  // Buat objek produk
  let product = {
    name: name,
    price: price,
    image: image,
  };

  // Tambahkan produk ke dalam array cart
  cart.push(product);

  // Simpan ke localStorage agar tetap ada setelah refresh
  localStorage.setItem("cart", JSON.stringify(cart));

  // Perbarui tampilan cart
  updateCart();
}

// Perbarui tampilan cart
function updateCart() {
  let cartList = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");

  cartList.innerHTML = ""; // Kosongkan daftar sebelumnya

  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #ddd";
    li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <strong>${item.name}</strong><br>
                    ${item.price}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})" style="width: 20%">&times;</button>
            </div>
        `;
    cartList.appendChild(li);

    // Hitung total harga (menghapus "Rp" dan titik)
    total += parseInt(item.price.replace("Rp ", "").replace(".", ""));
  });

  // Perbarui total harga
  cartTotal.innerText = "Total: Rp " + total.toLocaleString();

  // Simpan kembali perubahan ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hapus produk dari cart berdasarkan index
function removeFromCart(index) {
  cart.splice(index, 1); // Hapus produk berdasarkan index

  // Simpan perubahan ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Perbarui tampilan cart
  updateCart();
}

// Hapus semua produk dari cart
function clearCart() {
  cart = []; // Kosongkan array cart
  localStorage.setItem("cart", JSON.stringify(cart)); // Simpan perubahan
  updateCart(); // Perbarui tampilan
}

// Checkout (mengirim pesanan via WhatsApp)
function checkout() {
  const name = document.getElementById("buyer-name").value;
  const email = document.getElementById("buyer-email").value;

  if (!name || !email) {
    alert("Harap isi Nama dan Email!");
    return;
  }

  let message = `Saya ingin memesan:%0A`;
  cart.forEach((item) => {
    message += `- ${item.name} (${item.price})%0A`;
  });

  message += `%0AAtas nama: ${name}%0AEmail: ${email}`;
  window.open(`https://wa.me/6285966719252?text=${message}`, "_blank");

  // Kosongkan keranjang setelah checkout
  clearCart();
}

// Toggle (buka/tutup) shopping cart
function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("active");
}

// Jalankan updateCart() saat halaman dimuat agar data dari localStorage ditampilkan
updateCart();

// Tambahkan event listener untuk tombol buka shopping cart
document
  .querySelector(".shopping-cart-btn")
  .addEventListener("click", toggleCart);
