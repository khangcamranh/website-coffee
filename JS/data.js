// Dữ liệu sản phẩm nước uống
const products = [
    {
        id: 1,
        name: "Nước ép cam tươi",
        price: 25000,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=300",
        description: "Nước ép cam tươi nguyên chất, giàu vitamin C, giúp tăng cường sức đề kháng. Được làm từ những quả cam tươi ngon, không chất bảo quản, mang lại hương vị tự nhiên và bổ dưỡng nhất.",
        category: "Nước ép",
        stock: 20
    },
    {
        id: 2,
        name: "Trà sữa trân châu",
        price: 35000,
        image: "https://images.unsplash.com/photo-1558857563-c0c6b32a3def?q=80&w=300",
        description: "Trà sữa thơm ngon với trân châu dẻo, thơm, ngọt vừa phải. Hòa quyện giữa vị đậm đà của trà và vị béo của sữa, cùng với những viên trân châu dẻo dai.",
        category: "Trà sữa",
        stock: 15
    },
    {
        id: 3,
        name: "Sinh tố bơ",
        price: 30000,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=300",
        description: "Sinh tố bơ béo ngậy, thơm ngon, bổ dưỡng. Được làm từ những quả bơ tươi ngon, kết hợp với sữa tươi và đường, tạo nên thức uống thơm ngon và giàu dinh dưỡng.",
        category: "Sinh tố",
        stock: 18
    },
    {
        id: 4,
        name: "Cà phê đen đá",
        price: 20000,
        image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?q=80&w=300",
        description: "Cà phê đen đậm đà, hương vị mạnh mẽ, thơm nồng. Được pha từ hạt cà phê Robusta chất lượng cao, rang xay tại chỗ, giữ trọn vẹn hương vị đặc trưng.",
        category: "Cà phê",
        stock: 25
    },
    {
        id: 5,
        name: "Trà đào cam sả",
        price: 28000,
        image: "https://images.unsplash.com/photo-1556679343-c1917e0cbcc4?q=80&w=300",
        description: "Trà đào thơm ngon, kết hợp với cam và sả, vị thanh mát. Sự kết hợp tinh tế giữa vị chua ngọt của đào, cam và hương thơm của sả tạo nên thức uống giải khát tuyệt vời.",
        category: "Trà",
        stock: 22
    },
    {
        id: 6,
        name: "Matcha đá xay",
        price: 40000,
        image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=300",
        description: "Matcha Nhật Bản nguyên chất xay với đá, thơm ngon, đậm đà. Bột trà xanh Matcha cao cấp, xay cùng với đá và sữa, tạo nên thức uống màu xanh đẹp mắt và hương vị đặc trưng.",
        category: "Đá xay",
        stock: 12
    },
    {
        id: 7,
        name: "Nước ép dưa hấu",
        price: 22000,
        image: "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=300",
        description: "Nước ép dưa hấu mát lạnh, ngọt thanh, giải nhiệt hiệu quả vào mùa hè. Được ép từ những quả dưa hấu chín mọng, đỏ thẫm, không pha trộn, giữ nguyên vị ngọt tự nhiên.",
        category: "Nước ép",
        stock: 20
    },
    {
        id: 8,
        name: "Smoothie dâu tây",
        price: 38000,
        image: "https://images.unsplash.com/photo-1638176531213-0b8b58a023ab?q=80&w=300",
        description: "Smoothie dâu tây thơm ngọt, mát lạnh, giàu vitamin. Được làm từ dâu tây tươi ngon, xay nhuyễn cùng sữa chua và mật ong, tạo nên thức uống vừa ngon vừa bổ dưỡng.",
        category: "Smoothie",
        stock: 15
    }
];

// Hàm lưu dữ liệu mẫu vào localStorage nếu chưa có
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Hàm lấy tất cả sản phẩm
function getAllProducts() {
    const productsData = localStorage.getItem('products');
    return productsData ? JSON.parse(productsData) : [];
}

// Hàm lấy sản phẩm theo ID
function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id === parseInt(id));
}

// Hàm lấy giỏ hàng từ localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Hàm lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Khởi tạo dữ liệu sản phẩm mẫu
initializeProducts();