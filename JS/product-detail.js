// Hàm hiển thị thông báo (giống main.js)
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    // Tạo phần tử toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Thêm biểu tượng dựa trên loại thông báo
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else {
        icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // Đặt nội dung cho toast
    toast.innerHTML = `${icon} ${message}`;
    
    // Thêm toast vào container
    toastContainer.appendChild(toast);
    
    // Tự động xóa toast sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cartItems = getCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Hàm lấy id sản phẩm từ URL
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Tăng số lượng sản phẩm
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const productId = getProductIdFromUrl();
    const product = getProductById(productId);
    
    let currentQuantity = parseInt(quantityInput.value);
    
    if (currentQuantity < product.stock) {
        currentQuantity += 1;
        quantityInput.value = currentQuantity;
    } else {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'info');
    }
}

// Giảm số lượng sản phẩm
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    let currentQuantity = parseInt(quantityInput.value);
    
    if (currentQuantity > 1) {
        currentQuantity -= 1;
        quantityInput.value = currentQuantity;
    }
}

// Thêm sản phẩm vào giỏ hàng từ trang chi tiết
function addToCartFromDetail() {
    const productId = getProductIdFromUrl();
    const product = getProductById(productId);
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);
    
    if (!product) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showToast('Sản phẩm đã hết hàng!', 'error');
        return;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
        showToast('Vui lòng nhập số lượng hợp lệ!', 'error');
        return;
    }
    
    if (quantity > product.stock) {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'error');
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    const cart = getCart();
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.productId === parseInt(productId));
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        const newQuantity = cart[existingProductIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
            cart[existingProductIndex].quantity = product.stock;
            showToast(`Bạn đã đặt tối đa số lượng có sẵn (${product.stock}) của sản phẩm này!`, 'info');
        } else {
            cart[existingProductIndex].quantity = newQuantity;
            showToast(`Đã cập nhật số lượng ${product.name} trong giỏ hàng!`, 'success');
        }
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            productId: parseInt(productId),
            quantity: quantity,
            price: product.price,
            name: product.name,
            image: product.image
        });
        showToast(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`, 'success');
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart(cart);
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
}

// Render chi tiết sản phẩm
function renderProductDetail() {
    const productDetailContainer = document.getElementById('product-detail-container');
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        productDetailContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Không tìm thấy sản phẩm</h3>
                <a href="index.html" class="btn">Quay lại trang chủ</a>
            </div>
        `;
        return;
    }
    
    const product = getProductById(productId);
    
    if (!product) {
        productDetailContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Không tìm thấy sản phẩm</h3>
                <a href="index.html" class="btn">Quay lại trang chủ</a>
            </div>
        `;
        return;
    }
    
    // Cập nhật tiêu đề trang
    document.title = `${product.name} - DrinkShop`;
    
    productDetailContainer.innerHTML = `
        <div class="product-detail-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
            <span class="product-category">${product.category}</span>
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
            <p class="product-detail-description">${product.description}</p>
            <p class="product-detail-stock">Còn lại: <strong>${product.stock}</strong> sản phẩm</p>
            <div class="product-detail-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                <input type="number" value="1" min="1" max="${product.stock}" class="quantity-input" id="quantity">
                <button class="quantity-btn" onclick="increaseQuantity()">+</button>
            </div>
            <button class="btn" onclick="addToCartFromDetail()">Thêm vào giỏ hàng</button>
        </div>
    `;
}

// Khởi tạo trang
function initializeProductDetail() {
    renderProductDetail();
    updateCartCount();
}

// Chạy khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initializeProductDetail);