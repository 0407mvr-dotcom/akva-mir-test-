
// ============================================
// КОРЗИНА — УПРОЩЁННАЯ ВЕРСИЯ
// ============================================

const CART_KEY = 'akva_mir_cart';

// ===== ПОЛУЧИТЬ КОРЗИНУ =====
function getCart() {
    try {
        const cartData = localStorage.getItem(CART_KEY);
        return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
        return [];
    }
}

// ===== СОХРАНИТЬ КОРЗИНУ =====
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ===== НАЙТИ ТОВАР ПО ID =====
function findProductById(productId) {
    if (window.allProducts && window.allProducts.length > 0) {
        var found = window.allProducts.find(function(p) {
            return p.id === productId;
        });
        if (found) return found;
    }
    
    if (window.products) {
        var found = window.products.find(function(p) {
            return p.id === productId;
        });
        if (found) return found;
    }
    
    var all = [];
    try {
        if (typeof products !== 'undefined') {
            all = all.concat(products);
        }
        if (typeof hitProducts !== 'undefined') {
            all = all.concat(hitProducts);
        }
        if (typeof waterProducts !== 'undefined') {
            all = all.concat(waterProducts);
        }
        if (typeof equipmentProducts !== 'undefined') {
            all = all.concat(equipmentProducts);
        }
        if (typeof promoProducts !== 'undefined') {
            all = all.concat(promoProducts);
        }
    } catch(e) {
        console.log('Ошибка при получении товаров:', e);
    }
    
    var unique = [];
    var ids = {};
    all.forEach(function(item) {
        if (!ids[item.id]) {
            ids[item.id] = true;
            unique.push(item);
        }
    });
    
    return unique.find(function(p) {
        return p.id === productId;
    });
}

// ===== РАССЧИТАТЬ БОНУСЫ И ДОСТАВКУ =====
function calculateCartBonuses() {
    var totalPrice = getCartTotalPrice();
    var cart = getCart();
    
    // Считаем количество бутылей воды (id 1-15 и 21-25 — вода)
    var bottleCount = 0;
    cart.forEach(function(item) {
        if (item.id >= 1 && item.id <= 25 && item.id < 16) {
            bottleCount += item.quantity;
        }
        if (item.id >= 21 && item.id <= 25) {
            bottleCount += item.quantity;
        }
    });
    
    var FREE_DELIVERY_THRESHOLD = 3000;
    var FREE_DELIVERY_BOTTLES = 3;
    var GIFT_THRESHOLD = 2200;
    
    // Доставка
    var deliveryInfo = {
        free: false,
        remaining: 0,
        text: ''
    };
    
    if (totalPrice >= FREE_DELIVERY_THRESHOLD || bottleCount >= FREE_DELIVERY_BOTTLES) {
        deliveryInfo.free = true;
        deliveryInfo.text = '✅ Бесплатная доставка уже включена!';
    } else {
        var remainingPrice = FREE_DELIVERY_THRESHOLD - totalPrice;
        var remainingBottles = FREE_DELIVERY_BOTTLES - bottleCount;
        deliveryInfo.remaining = Math.max(remainingPrice, 0);
        deliveryInfo.text = 'Осталось ' + deliveryInfo.remaining + ' ₽ до бесплатной доставки: при заказе от ' + FREE_DELIVERY_THRESHOLD + ' ₽ или ' + FREE_DELIVERY_BOTTLES + ' бут. воды 19 л';
    }
    
    // Подарок — считаем от всей суммы заказа (ВСЕ ТОВАРЫ)
    var totalWithoutEquipment = getCartTotalPrice();
    
    var giftInfo = {
        available: false,
        remaining: 0,
        text: ''
    };
    
    if (totalWithoutEquipment >= GIFT_THRESHOLD) {
        giftInfo.available = true;
        giftInfo.text = '🎁 Поздравляем! Вы получаете подарок!';
    } else {
        giftInfo.remaining = GIFT_THRESHOLD - totalWithoutEquipment;
        giftInfo.text = 'До получения подарка осталось ' + giftInfo.remaining + ' ₽';
    }
    
    return {
        delivery: deliveryInfo,
        gift: giftInfo,
        totalPrice: totalPrice,
        bottleCount: bottleCount,
        totalWithoutEquipment: totalWithoutEquipment
    };
}

// ===== ДОБАВИТЬ ТОВАР В КОРЗИНУ (С УЧЕТОМ КОЛИЧЕСТВА ИЗ ПОЛЯ) =====
function addToCart(productId) {
    if (!productId) {
        console.error('ID товара не передан');
        return false;
    }
    
    // Получаем количество из поля на странице товара
    const quantityInput = document.getElementById('quantity');
    let quantity = 1;
    if (quantityInput) {
        const parsed = parseInt(quantityInput.value);
        if (!isNaN(parsed) && parsed > 0) {
            quantity = parsed;
        }
    }
    
    var product = findProductById(productId);
    if (!product) {
        console.error('Товар не найден:', productId);
        alert('Товар не найден. Пожалуйста, обновите страницу.');
        return false;
    }
    
    var cart = getCart();
    var existingItem = cart.find(function(item) {
        return item.id === productId;
    });
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name || 'Товар',
            price: product.price || 0,
            image: product.image || 'product1.jpg.png',
            badge: product.badge || (product.badges ? product.badges[0] : null) || null,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    updateCartCounter();
    showNotification(product.name || 'Товар');
    return true;
}

// ===== УДАЛИТЬ ТОВАР =====
function removeFromCart(productId) {
    var cart = getCart();
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });
    saveCart(cart);
    updateCartCounter();
    renderCart();
    updateCartTotal();
}

// ===== ИЗМЕНИТЬ КОЛИЧЕСТВО =====
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    var cart = getCart();
    var item = cart.find(function(i) {
        return i.id === productId;
    });
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartCounter();
        renderCart();
        updateCartTotal();
    }
}

// ===== ОЧИСТИТЬ КОРЗИНУ =====
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        saveCart([]);
        updateCartCounter();
        renderCart();
        updateCartTotal();
    }
}

// ===== ПОЛУЧИТЬ ОБЩЕЕ КОЛИЧЕСТВО =====
function getCartTotalItems() {
    var cart = getCart();
    var total = 0;
    cart.forEach(function(item) {
        total += item.quantity;
    });
    return total;
}

// ===== ПОЛУЧИТЬ ИТОГОВУЮ СУММУ =====
function getCartTotalPrice() {
    var cart = getCart();
    var total = 0;
    cart.forEach(function(item) {
        total += item.price * item.quantity;
    });
    return total;
}

// ===== ОБНОВИТЬ ИТОГОВУЮ СТОИМОСТЬ В ПРАВОЙ КОЛОНКЕ =====
function updateCartTotal() {
    var totalPrice = getCartTotalPrice();
    
    var totalOld = document.getElementById('cartTotalOld');
    var totalNew = document.getElementById('cartTotalNew');
    
    if (totalOld) {
        totalOld.textContent = totalPrice + ' ₽';
    }
    
    if (totalNew) {
        totalNew.textContent = totalPrice + ' ₽';
    }
}

// ===== ОБНОВИТЬ СЧЁТЧИК =====
function updateCartCounter() {
    var total = getCartTotalItems();
    var counters = document.querySelectorAll('.cart-counter');
    var bottomCounter = document.getElementById('bottomCartCounter');
    
    counters.forEach(function(el) {
        if (total > 0) {
            el.textContent = total;
            el.style.display = 'flex';
            el.classList.add('active');
        } else {
            el.style.display = 'none';
            el.classList.remove('active');
        }
    });
    
    // Обновляем счетчик в нижнем меню
    if (bottomCounter) {
        if (total > 0) {
            bottomCounter.textContent = total;
            bottomCounter.style.display = 'flex';
            bottomCounter.classList.add('active');
        } else {
            bottomCounter.style.display = 'none';
            bottomCounter.classList.remove('active');
        }
    }
}

// ===== УВЕДОМЛЕНИЕ =====
function showNotification(productName) {
    var notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="cart-notification__icon">✅</div>
        <div class="cart-notification__text">
            <strong>${productName}</strong>
            <span>добавлен в корзину</span>
        </div>
        <a href="cart.html" class="cart-notification__btn">В корзину</a>
    `;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== ОБНОВИТЬ БЛОК ДОСТАВКИ =====
function updateDeliveryBlock() {
    var deliveryContainer = document.getElementById('cartDeliveryBlock');
    if (!deliveryContainer) return;
    
    var bonuses = calculateCartBonuses();
    
    if (bonuses.delivery.free) {
        deliveryContainer.innerHTML = `
            <div class="cart-delivery-block" style="background: #E8F5E9; border: 2px solid #4CAF50;">
                <div class="cart-delivery-text">
                    <p style="font-size: 16px; font-weight: 700; color: #2E7D32;">🚚 Бесплатная доставка!</p>
                    <p style="font-size: 14px; color: #333;">Ваш заказ уже включает бесплатную доставку</p>
                </div>
            </div>
        `;
    } else {
        var remainingBottles = 3 - bonuses.bottleCount;
        deliveryContainer.innerHTML = `
            <div class="cart-delivery-block">
                <div class="cart-delivery-text">
                    <p>${bonuses.delivery.text}</p>
                    <p style="font-size: 13px; color: #666; margin-top: 5px;">
                        Добавьте товаров на ${bonuses.delivery.remaining} ₽ или ${Math.max(remainingBottles, 0)} бут. воды 19 л
                    </p>
                </div>
            </div>
        `;
    }
}

// ===== ОТОБРАЗИТЬ КОРЗИНУ =====
function renderCart() {
    var container = document.querySelector('.cart-left');
    
    console.log('renderCart вызвана, контейнер:', container);
    
    if (!container) {
        console.error('Контейнер .cart-left не найден!');
        return;
    }
    
    var cart = getCart();
    console.log('Товаров в корзине:', cart.length);
    
    if (cart.length === 0) {
        console.log('Корзина пуста, показываем сообщение');
        
        var cartWrapper = document.getElementById('cartWrapper');
        if (cartWrapper) cartWrapper.style.display = 'flex';
        
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty__icon">🛒</div>
                <h3 class="cart-empty__title">Ваша корзина пуста</h3>
                <p class="cart-empty__text">
                    Похоже, вы ещё не выбрали товары.<br>
                    Перейдите в каталог, чтобы найти что-то интересное!
                </p>
                <a href="catalog.html" class="cart-empty__btn">Перейти в каталог</a>
                <div class="cart-empty__suggestions">
                    <span>🔥 Хиты продаж</span>
                    <span>💧 Вода 19л</span>
                    <span>🔧 Кулеры</span>
                </div>
            </div>
        `;
        
        updateCartTotal();
        updateDeliveryBlock();
        return;
    }
    
    console.log('Показываем товары, количество:', cart.length);
    
    var cartWrapper = document.getElementById('cartWrapper');
    if (cartWrapper) cartWrapper.style.display = 'flex';
    
    var html = '';
    var totalPrice = 0;
    
    var bonuses = calculateCartBonuses();
    
    if (bonuses.gift.available) {
        html += `
            <div class="cart-gift-block" style="background: #E3F8FF; border: 2px solid #4CAF50;">
                <div class="cart-gift-text">
                    <p style="font-size: 18px; font-weight: 700; color: #2E7D32;">🎁 Поздравляем!</p>
                    <p style="font-size: 16px; color: #333;">Вы получаете подарок при заказе от 2200 ₽</p>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="cart-gift-block">
                <div class="cart-gift-text">
                    <p>Получите подарок при заказе от 2200 ₽</p>
                </div>
            </div>
        `;
    }
    
    cart.forEach(function(item) {
        totalPrice += item.price * item.quantity;
        
        var badgeHtml = '';
        if (item.badge === 'hit') {
            badgeHtml = '<span class="product-card__badge--hit">Хит</span>';
        } else if (item.badge === 'sale') {
            badgeHtml = '<span class="product-card__badge--sale">Акция</span>';
        } else if (item.badge === 'new') {
            badgeHtml = '<span class="product-card__badge--new">Новинка</span>';
        }
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="images/${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item__info">
                    <div class="cart-item__mobile">
                        <div class="cart-item__top-row">
                            <div class="cart-item__badges">${badgeHtml}</div>
                            <button class="cart-item__remove" onclick="removeFromCart(${item.id})">
                                <img src="images/trash.svg" alt="Удалить">
                            </button>
                        </div>
                        <div class="cart-item__title">${item.name}</div>
                        <div class="cart-item__sku">Артикул: ${item.id}</div>
                        <div class="cart-item__bottom-row">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <div class="cart-item__total-price">${item.price * item.quantity} ₽</div>
                        </div>
                    </div>
                    <div class="cart-item__desktop">
                        <div class="cart-item__badges">${badgeHtml}</div>
                        <div class="cart-item__title">${item.name}</div>
                        <div class="cart-item__sku">Артикул: ${item.id}</div>
                        <div class="cart-item__desktop-row">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <div class="cart-item__price-desktop">${item.price} ₽ / 1 шт</div>
                            <div class="cart-item__total">
                                <div class="cart-item__total-price">${item.price * item.quantity} ₽</div>
                                <button class="cart-item__remove" onclick="removeFromCart(${item.id})">
                                    <img src="images/trash.svg" alt="Удалить">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="cart-bottle-checkbox">
            <div class="checkbox-wrapper">
                <input type="checkbox" id="return-bottle" class="custom-checkbox">
                <label for="return-bottle">Хочу сдать бутылку</label>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    updateCartTotal();
    updateDeliveryBlock();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        updateCartTotal();
    }
    setTimeout(updateCartCounter, 100);
});

// ===== ГЛОБАЛЬНЫЙ ДОСТУП =====
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.renderCart = renderCart;
window.getCart = getCart;
window.getCartTotalPrice = getCartTotalPrice;
window.getCartTotalItems = getCartTotalItems;
window.updateCartTotal = updateCartTotal;
// ============================================
// КНОПКА "В КОРЗИНУ" → СЧЕТЧИК (КАК НА ВАЛБЕРРИС)
// ============================================

// ===== ОБНОВИТЬ СОСТОЯНИЕ ВСЕХ КНОПОК =====
function updateAllCartButtons() {
    const cart = getCart();
    const cartIds = {};
    cart.forEach(item => {
        cartIds[item.id] = item.quantity;
    });

    // Находим все кнопки "В корзину" на странице
    const buttons = document.querySelectorAll('.product-card__btn');
    
    buttons.forEach(btn => {
        // Получаем ID товара из onclick атрибута
        const onclickAttr = btn.getAttribute('onclick');
        if (!onclickAttr) return;
        
        const match = onclickAttr.match(/addToCart\((\d+)\)/);
        if (!match) return;
        
        const productId = parseInt(match[1]);
        const quantity = cartIds[productId] || 0;
        
        // Удаляем старый счетчик если есть
        const existingCounter = btn.parentElement.querySelector('.product-card__counter');
        if (existingCounter) {
            existingCounter.remove();
        }
        
        if (quantity > 0) {
            // Прячем кнопку
            btn.style.display = 'none';
            
            // Создаем счетчик
            const counter = document.createElement('div');
            counter.className = 'product-card__counter';
            counter.innerHTML = `
                <button class="counter-btn counter-btn--minus" onclick="event.stopPropagation(); changeCartItemQuantity(${productId}, -1)">−</button>
                <span class="counter-value">${quantity}</span>
                <button class="counter-btn counter-btn--plus" onclick="event.stopPropagation(); changeCartItemQuantity(${productId}, 1)">+</button>
            `;
            
            // Вставляем после кнопки
            btn.parentElement.insertBefore(counter, btn.nextSibling);
        } else {
            // Показываем кнопку
            btn.style.display = 'block';
            btn.textContent = 'В корзину';
            btn.onclick = function(e) {
                e.stopPropagation();
                addToCart(productId);
                // После добавления обновляем все кнопки
                setTimeout(updateAllCartButtons, 100);
            };
        }
    });
}

// ===== ИЗМЕНИТЬ КОЛИЧЕСТВО В КОРЗИНЕ =====
function changeCartItemQuantity(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (!item) {
        // Если товара нет — добавляем
        addToCart(productId);
        setTimeout(updateAllCartButtons, 100);
        return;
    }
    
    const newQuantity = item.quantity + delta;
    
    if (newQuantity <= 0) {
        // Удаляем товар
        removeFromCart(productId);
        // Обновляем счетчик у всех кнопок
        setTimeout(updateAllCartButtons, 100);
        return;
    }
    
    // Обновляем количество
    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCounter();
    renderCart();
    updateCartTotal();
    
    // Обновляем все кнопки
    setTimeout(updateAllCartButtons, 50);
}

// ===== ПЕРЕХВАТЫВАЕМ ORIGINAL addToCart =====
const originalAddToCart = window.addToCart;

window.addToCart = function(productId) {
    const result = originalAddToCart(productId);
    setTimeout(updateAllCartButtons, 100);
    return result;
};

// ===== ПЕРЕХВАТЫВАЕМ removeFromCart =====
const originalRemoveFromCart = window.removeFromCart;

window.removeFromCart = function(productId) {
    const result = originalRemoveFromCart(productId);
    setTimeout(updateAllCartButtons, 100);
    return result;
};

// ===== ПЕРЕХВАТЫВАЕМ updateCartItemQuantity =====
const originalUpdateCartItemQuantity = window.updateCartItemQuantity;

window.updateCartItemQuantity = function(productId, newQuantity) {
    const result = originalUpdateCartItemQuantity(productId, newQuantity);
    setTimeout(updateAllCartButtons, 100);
    return result;
};

// ===== ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateAllCartButtons, 300);
});

// Обновляем кнопки после любого изменения корзины
setInterval(updateAllCartButtons, 1000);