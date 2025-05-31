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

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartItemQuantity(productId, newQuantity) {
    const cart = getCart();
    const product = getProductById(productId);
    
    if (!product) {
        showToast('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
        showToast('Sản phẩm không có trong giỏ hàng!', 'error');
        return;
    }
    
    // Xác thực số lượng mới
    if (isNaN(newQuantity) || newQuantity < 1) {
        showToast('Số lượng không hợp lệ!', 'error');
        return;
    }
    
    if (newQuantity > product.stock) {
        newQuantity = product.stock;
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'info');
    }
    
    // Cập nhật số lượng
    cart[itemIndex].quantity = newQuantity;
    
    // Lưu lại giỏ hàng
    saveCart(cart);
    
    // Cập nhật giao diện
    renderCart();
    updateCartCount();
    
    showToast('Đã cập nhật giỏ hàng!', 'success');
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
        showToast('Sản phẩm không có trong giỏ hàng!', 'error');
        return;
    }
    
    // Lấy tên sản phẩm trước khi xóa
    const productName = cart[itemIndex].name;
    
    // Xóa sản phẩm khỏi giỏ hàng
    cart.splice(itemIndex, 1);
    
    // Lưu lại giỏ hàng
    saveCart(cart);
    
    // Cập nhật giao diện
    renderCart();
    updateCartCount();
    
    showToast(`Đã xóa ${productName} khỏi giỏ hàng!`, 'success');
}

// Hàm tính tổng tiền giỏ hàng
function calculateCartTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Thanh toán
function checkout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Giỏ hàng của bạn đang trống!', 'error');
        return;
    }
    
    // Kiểm tra tồn kho của tất cả sản phẩm trong giỏ hàng
    let outOfStock = false;
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product.stock < item.quantity) {
            outOfStock = true;
            showToast(`Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho!`, 'error');
        }
    });
    
    if (outOfStock) {
        return;
    }
    
    // Cập nhật tồn kho
    const products = getAllProducts();
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });
    
    // Lưu lại danh sách sản phẩm với tồn kho mới
    localStorage.setItem('products', JSON.stringify(products));
    
    // Xóa giỏ hàng
    saveCart([]);
    
    // Cập nhật giao diện
    renderCart();
    updateCartCount();
    
    showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
}

// Render giỏ hàng
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Giỏ hàng của bạn đang trống</h3>
                <p>Thêm một vài sản phẩm vào giỏ hàng của bạn.</p>
                <a href="index.html" class="btn">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }
    
    // Tính tổng tiền
    const subtotal = calculateCartTotal(cart);
    const shippingFee = 15000; // Phí vận chuyển cố định
    const total = subtotal + shippingFee;
    
    let cartHTML = `
        <div class="cart-header">
            <div>Hình ảnh</div>
            <div>Sản phẩm</div>
            <div>Giá</div>
            <div>Số lượng</div>
            <div>Tổng</div>
            <div></div>
        </div>
    `;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        const itemTotal = item.price * item.quantity;
        
        cartHTML += `
            <div class="cart-item">
                <div>
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                </div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('vi-VN')} VNĐ</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="decreaseCartQuantity(${item.productId}, ${item.quantity})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${product ? product.stock : 99}" 
                           class="quantity-input" onchange="updateCartItemQuantity(${item.productId}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="increaseCartQuantity(${item.productId}, ${item.quantity}, ${product ? product.stock : 99})">+</button>
                </div>
                <div class="cart-item-total">${itemTotal.toLocaleString('vi-VN')} VNĐ</div>
                <div>
                    <button class="cart-remove" onclick="removeCartItem(${item.productId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        <div class="cart-summary">
            <div class="cart-total">
                <div class="cart-total-item">
                    <span>Tạm tính:</span>
                    <span>${subtotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div class="cart-total-item">
                    <span>Phí vận chuyển:</span>
                    <span>${shippingFee.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div class="cart-total-item final">
                    <span>Tổng cộng:</span>
                    <span>${total.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <button class="btn" style="width: 100%; margin-top: 20px;" onclick="checkout()">Thanh toán</button>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
}

// Tăng số lượng sản phẩm trong giỏ hàng
function increaseCartQuantity(productId, currentQuantity, maxStock) {
    if (currentQuantity < maxStock) {
        updateCartItemQuantity(productId, currentQuantity + 1);
    } else {
        showToast(`Chỉ còn ${maxStock} sản phẩm trong kho!`, 'info');
    }
}

// Giảm số lượng sản phẩm trong giỏ hàng
function decreaseCartQuantity(productId, currentQuantity) {
    if (currentQuantity > 1) {
        updateCartItemQuantity(productId, currentQuantity - 1);
    }
}

// Khởi tạo trang
function initializeCartPage() {
    renderCart();
    updateCartCount();
}

// Chạy khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initializeCartPage);