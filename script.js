document.addEventListener('DOMContentLoaded', () => {

    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
if (carouselInner && carouselItems.length > 0) {
    const totalItems = carouselItems.length;
    let currentIndex = 0;

    function updateCarousel() {
    const offset = -currentIndex * 100; 
    carouselInner.style.transform = `translateX(${offset}%)`;
}

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems; 
        updateCarousel();
    }

    setInterval(nextSlide, 3000);
}


    const buyButtons = document.querySelectorAll('.buy-button');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartLink = document.getElementById('cart-link');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.querySelector('.checkout-button');

    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutForm = document.getElementById('checkout-form');

    const isRussian = document.documentElement.lang === 'ru';
    const currencySymbol = isRussian ? '₽' : '₴';
    const quantityText = isRussian ? 'Количество' : 'Кількість';
    const sumText = isRussian ? 'Сумма' : 'Сума';
    const emptyMessageText = isRussian ? 'Корзина пуста. Время что-нибудь приобрести!' : 'Кошик порожній. Час щось придбати!';
    const buyButtonText = isRussian ? 'Купить' : 'Купити';
    const addedButtonText = isRussian ? 'Добавлено!' : 'Додано!';
    const checkoutAlertText = isRussian ?
        'Заказ оформлен! Мы свяжемся с вами в ближайшее время.' :
        'Замовлення оформлено! Ми зв\'яжемося з вами найближчим часом.';
    const formHeaderText = isRussian ? 'Контактные данные' : 'Контактні дані';
    const namePlaceholder = isRussian ? "Ваше имя" : "Ваше ім'я";
    const phonePlaceholder = isRussian ? "Номер телефона" : "Номер телефону";
    const emailPlaceholder = isRussian ? "Email (необязательно)" : "Email (не обов'язково)";
    const submitButtonText = isRussian ? 'Подтвердить заказ' : 'Підтвердити замовлення';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpan.style.display = totalItems > 0 ? 'block' : 'none';

        if (checkoutFormContainer) {
            checkoutFormContainer.style.display = 'none';
        }
    }

    function calculateTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        return total.toFixed(0);
    }

    function removeItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="text-align: center; color: #ccc;">${emptyMessageText}</p>`;
            if (checkoutButton) {
                checkoutButton.disabled = true;
                checkoutButton.style.opacity = 0.5;
                checkoutButton.style.display = 'block';
            }
            if (checkoutFormContainer) {
                checkoutFormContainer.style.display = 'none';
            }
        } else {
            if (checkoutButton) {
                checkoutButton.disabled = false;
                checkoutButton.style.opacity = 1;
                if (checkoutFormContainer && checkoutFormContainer.style.display !== 'block') {
                    checkoutButton.style.display = 'block';
                }
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

            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const itemId = event.currentTarget.dataset.id;
                    removeItem(itemId);
                });
            });

            if (checkoutFormContainer) {
                document.getElementById('checkout-form-container').querySelector('h3').textContent = formHeaderText;
                document.getElementById('user-name').placeholder = namePlaceholder;
                document.getElementById('user-phone').placeholder = phonePlaceholder;
                document.getElementById('user-email').placeholder = emailPlaceholder;
                checkoutForm.querySelector('.submit-order-button').textContent = submitButtonText;
            }
        }
        cartTotalSpan.textContent = `${calculateTotal()}${currencySymbol}`;
    }

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
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

            button.textContent = addedButtonText;
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.textContent = buyButtonText;
                button.style.backgroundColor = '#007bff';
            }, 1000);
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

    if (checkoutButton && checkoutFormContainer) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                checkoutButton.style.display = 'none';
                checkoutFormContainer.style.display = 'block';
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const email = document.getElementById('user-email').value;
            const total = calculateTotal();
            const orderItems = cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const orderData = {
                customer: { name, phone, email },
                totalAmount: `${total}${currencySymbol}`,
                items: orderItems
            };

            console.log('Order data (server submission simulation):', orderData);

            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount();

            checkoutForm.reset();
            checkoutFormContainer.style.display = 'none';
            checkoutButton.style.display = 'block';

            alert(checkoutAlertText);

            cartModal.style.display = 'none';
        });
    }

    updateCartCount();

    const reviewForm = document.getElementById('add-review-form');
    const reviewsContainer = document.getElementById('all-reviews');

    if (reviewForm && reviewsContainer) {

        const initialReviews = [
            {
                name: "Олександр К.",
                text: "Замовив нову відеокарту RTX 5080. Доставили дуже швидко, запаковано надійно. Карта працює відмінно, жодних нарікань. Рекомендую цей магазин!",
                rating: 5,
                date: "15.09.2025"
            },
            {
                name: "Ірина В.",
                text: "Купувала материнську плату. Консультант допоміг вибрати потрібну модель. Єдиний мінус — кур'єр запізнився на 30 хвилин. Загалом, задоволена.",
                rating: 4,
                date: "10.09.2025"
            }
        ];

        function getReviews() {
            const storedReviews = localStorage.getItem('productReviews');
            if (storedReviews) {
                return JSON.parse(storedReviews);
            }
            localStorage.setItem('productReviews', JSON.stringify(initialReviews));
            return initialReviews;
        }

        function saveReviews(reviews) {
            localStorage.setItem('productReviews', JSON.stringify(reviews));
        }

        function createStarRating(rating) {
            const fullStar = '★';
            const emptyStar = '☆';
            return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
        }

        function renderReviews() {
            reviewsContainer.innerHTML = '';
            const reviews = getReviews();

            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';

                reviewCard.innerHTML = `
                    <h4>
                        ${review.name} 
                        <span class="rating">${createStarRating(review.rating)}</span>
                    </h4>
                    <p>${review.text}</p>
                    <span class="date">${review.date}</span>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        }

        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('review-name').value;
            const text = document.getElementById('review-text').value;
            const rating = parseInt(document.getElementById('review-rating').value, 10);

            if (rating < 1 || rating > 5) {
                alert("Будь ласка, оберіть оцінку від 1 до 5.");
                return;
            }

            const now = new Date();
            const dateString = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

            const newReview = {
                name: name,
                text: text,
                rating: rating,
                date: dateString
            };

            const currentReviews = getReviews();
            currentReviews.unshift(newReview);

            saveReviews(currentReviews);
            renderReviews();

            reviewForm.reset();
            alert("Дякуємо! Ваш відгук успішно додано.");
        });

        renderReviews();
    }
});
