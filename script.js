document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Получение всех элементов DOM
    const buyButtons = document.querySelectorAll('.buy-button');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartLink = document.getElementById('cart-link');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.querySelector('.checkout-button'); 

    // Определяем язык и валюту по содержимому cartTotalSpan
    const isRussian = document.documentElement.lang === 'ru';
    const currencySymbol = isRussian ? '₽' : '₴'; 
    const quantityText = isRussian ? 'Количество' : 'Кількість';
    const sumText = isRussian ? 'Сумма' : 'Сума';
    const emptyMessageText = isRussian ? 'Корзина пуста. Время что-нибудь приобрести!' : 'Кошик порожній. Час щось придбати!';
    const buyButtonText = isRussian ? 'Купить' : 'Купити';
    const addedButtonText = isRussian ? 'Добавлено!' : 'Додано!';
    const checkoutAlertText = isRussian ? 'Заказ оформлен! Мы свяжемся с вами в ближайшее время.' : 'Замовлення оформлено! Ми зв\'яжемося з вами найближчим часом.';

    // 2. Инициализация корзины с Local Storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 3. Функция обновления счетчика в шапке
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // 4. Функция подсчета общей суммы
    function calculateTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        return total.toFixed(0);
    }
    
    // Функция: УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ
    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems(); 
    }

    // 5. Функция отображения товаров в модальном окне
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="text-align: center; color: #ccc;">${emptyMessageText}</p>`;
            if (checkoutButton) {
                 checkoutButton.disabled = true;
                 checkoutButton.style.opacity = 0.5;
            }
        } else {
            if (checkoutButton) {
                 checkoutButton.disabled = false;
                 checkoutButton.style.opacity = 1;
            }
            
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                
                const itemTotal = (item.price * item.quantity).toFixed(0);

                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${quantityText}: <strong>${item.quantity}</strong></p> 
                        <p>${sumText}: <strong>${itemTotal}${currencySymbol}</strong></p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
            
            // Обработчик для кнопок "Удалить"
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const itemId = event.currentTarget.dataset.id;
                    removeItem(itemId);
                });
            });
        }
        cartTotalSpan.textContent = `${calculateTotal()}${currencySymbol}`;
    }

    // 6. Обработка нажатия на кнопку "Купить"
    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Используем data-атрибуты, которые мы добавили в HTML
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            const productImage = button.dataset.image;

            if (!productId || isNaN(productPrice)) {
                console.error('Ошибка: Не найден data-id или data-price на кнопке.', button);
                return;
            }
            
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const newItem = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                cart.push(newItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Визуальный отклик
            button.textContent = addedButtonText;
            button.style.backgroundColor = '#28a745'; // Зеленый
            setTimeout(() => {
                button.textContent = buyButtonText;
                button.style.backgroundColor = '#007bff'; // Возвращаем синий
            }, 1000);
        });
    });

    // 7. Обработка открытия/закрытия модального окна
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
    
    // Обработка оформления заказа
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                // Логика очистки корзины после "оформления"
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                
                updateCartCount();
                renderCartItems();
                
                alert(checkoutAlertText);
                
                cartModal.style.display = 'none';
            }
        });
    }

    // Инициализация счетчика при загрузке страницы
    updateCartCount();
});
