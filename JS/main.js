// Hàm hiển thị thông báo
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

// Hàm thêm sản phẩm vào giỏ hàng từ trang chủ
function addToCart(productId) {
    const product = getProductById(productId);
    
    if (!product) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showToast('Sản phẩm đã hết hàng!', 'error');
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    const cart = getCart();
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.productId === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingProductIndex].quantity += 1;
        
        // Kiểm tra số lượng không vượt quá tồn kho
        if (cart[existingProductIndex].quantity > product.stock) {
            cart[existingProductIndex].quantity = product.stock;
            showToast(`Bạn đã đặt tối đa số lượng có sẵn (${product.stock}) của sản phẩm này!`, 'info');
        } else {
            showToast(`Đã cập nhật số lượng ${product.name} trong giỏ hàng!`, 'success');
        }
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            productId: product.id,
            quantity: 1,
            price: product.price,
            name: product.name,
            image: product.image
        });
        showToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart(cart);
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
}

// Render danh sách sản phẩm
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    const products = getAllProducts();
    
    // Xóa nội dung hiện tại
    productsContainer.innerHTML = '';
    
    // Thêm sản phẩm vào container
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price.toLocaleString('vi-VN')} VNĐ</p>
                <div class="product-actions">
                    <button class="btn btn-sm" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-secondary">Chi tiết</a>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Khởi tạo trang
function initializeHomePage() {
    renderProducts();
    updateCartCount();
}

// Chạy khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initializeHomePage);