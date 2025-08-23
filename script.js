    // Datos de los productos (extraídos del JSON proporcionado)
       let productsData = { products: [] };

        fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
        productsData = data;
        renderProducts(productsData.products);
        });
        // Función para mostrar los productos
        function renderProducts(products) {
            const container = document.getElementById('productsContainer');
            container.innerHTML = '';
            
            if (products.length === 0) {
                container.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
                return;
            }
            
            products.forEach(product => {
                const discountPrice = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
                const stockStatus = product.stock > 10 ? 'En stock' : (product.stock > 0 ? 'Poco stock' : 'Agotado');
                
                const productCard = document.createElement('div');productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.thumbnail}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
                        ${product.discountPercentage > 0 ? `<span class="discount-badge">-${product.discountPercentage}%</span>` : ''}
                        <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-brand">${product.brand || 'Marca no disponible'}</p>
                        <p class="product-category">${getCategoryName(product.category)}</p>
                        <div class="product-rating">
                            <span class="stars">${getStarRating(product.rating)}</span>
                            <span class="rating-value">${product.rating}</span>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">
                            ${product.discountPercentage > 0 ? `
                                <span class="original-price">$${product.price}</span>
                                <span class="discount-price">$${discountPrice}</span>
                            ` : `
                                <span class="final-price">$${product.price}</span>
                            `}
                        </div>
                        <div class="product-stock ${product.stock > 10 ? 'in-stock' : (product.stock > 0 ? 'low-stock' : 'out-of-stock')}">
                            ${stockStatus} (${product.stock} disponibles)
                        </div>
                        <button class="add-to-cart-btn" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Agotado' : 'Añadir al carrito'} <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                `;
                container.appendChild(productCard);
            });
        }

        // Función para obtener el nombre de la categoría
        function getCategoryName(category) {
            const categories = {
                "beauty": "Belleza",
                "fragrances": "Fragancias",
                "furniture": "Muebles",
                "groceries": "Comestibles"
            };
            return categories[category] || category;
        }

        // Función para generar las estrellas de valoración
        function getStarRating(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            
            let stars = '';
            for (let i = 0; i < fullStars; i++) {
                stars += '★';
            }
            if (halfStar) {stars += '⭐';
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += '☆';
            }
            return stars;
        }
        //ordenar por precio
        function sortProducts(products, order) {
    if (order === 'price-asc') {
        // Menor a mayor
        return products.slice().sort((a, b) => a.price - b.price);
    } else if (order === 'price-desc') {
        // Mayor a menor
        return products.slice().sort((a, b) => b.price - a.price);
    } else if (order === 'rating') {
        // Mejor valorados
        return products.slice().sort((a, b) => b.rating - a.rating);
    }
    return products;
}

        // Función para filtrar productos
        function filterProducts() {
            const category = document.getElementById('categoryFilter').value;
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const sortOrder =document.getElementById(`sortSelect`).value;


            let filteredProducts = productsData.products.filter(product => {
                const matchesCategory = category === 'all' || product.category === category;
                const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                                     product.description.toLowerCase().includes(searchTerm) ||
                                     (product.brand && product.brand.toLowerCase().includes(searchTerm));
                
                return matchesCategory && matchesSearch;
            });
            filteredProducts = sortProducts(filteredProducts, sortOrder);
            
            renderProducts(filteredProducts);
        }

        // Inicializar la página
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts(productsData.products);
            
            // Event listeners para filtros
            document.getElementById('categoryFilter').addEventListener('change', filterProducts);
            document.getElementById('searchBtn').addEventListener('click', filterProducts);
            document.getElementById('searchInput').addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    filterProducts();
                }
            });
            document.getElementById('sortSelect').addEventListener('change', filterProducts);
        });