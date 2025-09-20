document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-button');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartLink = document.getElementById('cart-link');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        cartCountSpan.textContent = cart.length;
    }

    function calculateTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        return total.toFixed(0);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Кошик порожній.</p>';
        } else {
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}₴</p>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        }
        cartTotalSpan.textContent = calculateTotal();
    }

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.new-price').textContent.replace('₴', '').replace(' ', ''));
            const productImage = productCard.querySelector('.product-image-placeholder img').src;

            const newItem = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            cart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${productName} додано до кошика!`);
        });
    });

    cartLink.addEventListener('click', (event) => {
        event.preventDefault();
        renderCartItems();
        cartModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Оновлення лічильника при завантаженні сторінки
    updateCartCount();
});
