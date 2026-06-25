document.addEventListener('DOMContentLoaded', function() {

// ===== ФУНКЦИЯ ИЗМЕНЕНИЯ КОЛИЧЕСТВА =====
function changeQuantity(delta) {
    const input = document.getElementById('quantity');
    if (!input) {
        console.error('Элемент quantity не найден!');
        return;
    }
    let value = parseInt(input.value) || 1;
    value += delta;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    input.value = value;
    console.log('Новое количество:', value);
}

window.changeQuantity = changeQuantity;

// ===== БУРГЕР МЕНЮ =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
} else {
    console.warn('Бургер или меню не найдены на этой странице');
}

// ===== ПОДМЕНЮ В МОБИЛЬНОЙ ВЕРСИИ (ТОЛЬКО ПО СТРЕЛКЕ) =====
// Находим все стрелки в меню
const menuArrows = document.querySelectorAll('.mobile-menu__arrow');

menuArrows.forEach(function(arrow) {
    arrow.addEventListener('click', function(e) {
        e.stopPropagation(); // Останавливаем всплытие события
        const parent = this.closest('.has-submenu');
        if (parent) {
            parent.classList.toggle('open');
        }
    });
});

// ===== ПОДМЕНЮ — СТАРЫЙ ВАРИАНТ (для обратной совместимости) =====
// Если есть пункты с подменю, у которых нет стрелки, но есть класс has-submenu
const submenuTriggers = document.querySelectorAll('.has-submenu > a');
submenuTriggers.forEach(function(trigger) {
    // Проверяем, есть ли рядом стрелка (чтобы не дублировать)
    const hasArrow = trigger.parentElement.querySelector('.mobile-menu__arrow');
    if (!hasArrow) {
        // Если стрелки нет, то оставляем старую логику (клик по ссылке)
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle('open');
        });
    }
});

// ===== СЛАЙДЕР =====
const slides = document.querySelectorAll('.slider__slide');
const dots = document.querySelectorAll('.slider__dot');
let currentSlideIndex = 0;
let autoSlideInterval;

function showSlide(index) {
    if (!slides.length || !dots.length) return;
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlideIndex = index;
}

function nextSlide() {
    if (!slides.length) return;
    let nextIndex = currentSlideIndex + 1;
    if (nextIndex >= slides.length) {
        nextIndex = 0;
    }
    showSlide(nextIndex);
}

function startAutoSlide() {
    if (!slides.length) return;
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    autoSlideInterval = setInterval(nextSlide, 6000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

if (dots.length) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });
}

if (slides.length) {
    startAutoSlide();
}

const sliderContainer = document.querySelector('.slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
}

// ===== БЛОК КАТАЛОГА (ТОВАРЫ С МЕТКОЙ ХИТ = 5 ТОВАРОВ) =====
const products = [
    { id: 1, name: "В-Вода 18,9л. Вкусная вода для Вас, 1кат.", price: 260, image: "prod1.jpg", badges: ["hit"] },
    { id: 3, name: "В-Вода 18,9л. Вкусная вода для Вас Premium", price: 300, image: "prod3.jpg", badges: ["hit"] },
    { id: 4, name: "В-Вода 18,9л. Горная Вершина, минер.", price: 470, image: "prod4.jpg", badges: ["hit"] },
    { id: 5, name: "В-Вода 18,9л. Легенда гор, минер.", price: 520, image: "prod5.jpg", badges: ["hit"] },
    { id: 6, name: "В-Вода 18,9л. Эльбрусинка, минер.", price: 520, image: "prod6.jpg", badges: ["hit"] }
];

function getBadgesHTML(badges) {
    if (!badges || badges.length === 0) return '';
    
    let html = '<div class="product-card__badges">';
    if (badges.includes('hit')) {
        html += '<span class="product-card__badge product-card__badge--hit">Хит</span>';
    }
    if (badges.includes('sale')) {
        html += '<span class="product-card__badge product-card__badge--sale">Акция</span>';
    }
    if (badges.includes('new')) {
        html += '<span class="product-card__badge product-card__badge--new">Новинка</span>';
    }
    html += '</div>';
    return html;
}

function renderProducts() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            ${getBadgesHTML(product.badges)}
            <a href="product-detail.html?id=${product.id}" class="product-card__link">
                <div class="product-card__image">
                    <img src="images/${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__price">${product.price} ₽</div>
                <h3 class="product-card__title">${product.name}</h3>
            </a>
            <div class="product-card__info">
                <span class="product-card__stock product-card__stock--in-stock">Есть в наличии</span>
                <span class="product-card__sku">Артикул: ${product.id}</span>
            </div>
            <button class="product-card__btn" onclick="event.stopPropagation(); addToCart(${product.id})">В корзину</button>
        </div>
    `).join('');
}

renderProducts();

// ===== МОБИЛЬНЫЙ ПОДВАЛ — АККОРДЕОН =====
const accordionHeaders = document.querySelectorAll('.footer__accordion-header');
if (accordionHeaders.length) {
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.parentElement;
            accordion.classList.toggle('active');
        });
    });
}

// ===== УМЕНЬШЕНИЕ МЕНЮ ПРИ СКРОЛЛЕ (ПК) =====
const desktopHeader = document.querySelector('.desktop-header');
if (desktopHeader) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            desktopHeader.classList.add('scrolled');
        } else {
            desktopHeader.classList.remove('scrolled');
        }
    });
}

// ===== РАСШИРЯЮЩИЙСЯ БЛОК ВАКАНСИИ (ПЛАВНО) =====
const vacancyToggle = document.querySelector('.vacancy-toggle');
const vacancyBlock = document.querySelector('.vacancy-block');
const vacancyDetails = document.querySelector('.vacancy-details');

if (vacancyToggle && vacancyBlock && vacancyDetails) {
    vacancyDetails.style.maxHeight = '0';
    
    vacancyToggle.addEventListener('click', function() {
        vacancyBlock.classList.toggle('open');
        if (vacancyBlock.classList.contains('open')) {
            vacancyDetails.style.maxHeight = vacancyDetails.scrollHeight + 'px';
        } else {
            vacancyDetails.style.maxHeight = '0';
        }
    });
}

// ===== СЛАЙДЕР В ЛИЧНОМ КАБИНЕТЕ =====
const profileSlides = document.querySelectorAll('.profile-slider__slide');
const profilePrevBtn = document.querySelector('.profile-slider__arrow--prev');
const profileNextBtn = document.querySelector('.profile-slider__arrow--next');
let profileCurrentSlide = 0;
let profileAutoInterval;

function showProfileSlide(index) {
    if (!profileSlides.length) return;
    if (index >= profileSlides.length) index = 0;
    if (index < 0) index = profileSlides.length - 1;
    
    profileSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    profileSlides[index].classList.add('active');
    profileCurrentSlide = index;
}

function nextProfileSlide() {
    showProfileSlide(profileCurrentSlide + 1);
}

function prevProfileSlide() {
    showProfileSlide(profileCurrentSlide - 1);
}

function startProfileAutoSlide() {
    if (profileAutoInterval) clearInterval(profileAutoInterval);
    profileAutoInterval = setInterval(nextProfileSlide, 5000);
}

if (profilePrevBtn && profileNextBtn) {
    profilePrevBtn.addEventListener('click', () => {
        prevProfileSlide();
        startProfileAutoSlide();
    });
    
    profileNextBtn.addEventListener('click', () => {
        nextProfileSlide();
        startProfileAutoSlide();
    });
}

if (profileSlides.length) {
    startProfileAutoSlide();
}

// ===== КАТАЛОГ — КАРТОЧКИ ТОВАРОВ =====
const hitProducts = [
    { id: 1, name: "В-Вода 18,9л. Вкусная вода для Вас, 1кат.", price: 260, image: "prod1.jpg", badge: "hit" },
    { id: 3, name: "В-Вода 18,9л. Вкусная вода для Вас Premium", price: 300, image: "prod3.jpg", badge: "hit" },
    { id: 4, name: "В-Вода 18,9л. Горная Вершина, минер.", price: 470, image: "prod4.jpg", badge: "hit" },
    { id: 5, name: "В-Вода 18,9л. Легенда гор, минер.", price: 520, image: "prod5.jpg", badge: "hit" },
    { id: 6, name: "В-Вода 18,9л. Эльбрусинка, минер.", price: 520, image: "prod6.jpg", badge: "hit" }
];

const waterProducts = [
    { id: 1, name: "В-Вода 18,9л. Вкусная вода для Вас, 1кат.", price: 260, image: "prod1.jpg", badge: "hit" },
    { id: 2, name: "В-Вода 18,9л. Вкусная вода для Кофемашин", price: 280, image: "prod2.jpg", badge: "new" },
    { id: 3, name: "В-Вода 18,9л. Вкусная вода для Вас Premium", price: 300, image: "prod3.jpg", badge: "hit" },
    { id: 4, name: "В-Вода 18,9л. Горная Вершина, минер.", price: 470, image: "prod4.jpg", badge: "hit" },
    { id: 5, name: "В-Вода 18,9л. Легенда гор, минер.", price: 520, image: "prod5.jpg", badge: "hit" },
    { id: 6, name: "В-Вода 18,9л. Эльбрусинка, минер.", price: 520, image: "prod6.jpg", badge: "hit" },
    { id: 7, name: "Бутыль поликарбонатная (залоговая тара)", price: 500, image: "prod7.jpg", badge: null }
];

const equipmentProducts = [
    { id: 8, name: "SMixx 16 LD/Е золотой", price: null, image: "prod8.jpg", badge: null },
    { id: 9, name: "Aqua well 13 ПЭ", price: null, image: "prod9.jpg", badge: null },
    { id: 10, name: "Smixx 03 LD серебро", price: null, image: "prod10.jpg", badge: null },
    { id: 11, name: "89 LD ПЭ серый", price: null, image: "prod11.jpg", badge: null },
    { id: 12, name: "Smixx 08М ПК", price: null, image: "prod12.jpg", badge: null },
    { id: 13, name: "Smixx 16L/E ПК", price: null, image: "prod13.jpg", badge: null },
    { id: 14, name: "Aqua well QK-CЧ", price: null, image: "prod14.jpg", badge: null },
    { id: 15, name: "Aqua well 15JXD CЭ", price: null, image: "prod15.jpg", badge: null },
    { id: 16, name: "Smixx Стандарт (помпа)", price: 700, image: "prod16.jpg", badge: null },
    { id: 17, name: "Помпа мех. HotFrost А25", price: null, image: "prod17.jpg", badge: null },
    { id: 18, name: "Электрическая помпа", price: null, image: "prod18.jpg", badge: null }
];

const accessoryProducts = [
    { id: 19, name: "Чехол на бутыль", price: null, image: "prod19.jpg", badge: null },
    { id: 20, name: "О-Ручка для бутылей Blue Rain", price: null, image: "prod20.jpg", badge: null },
    { id: 21, name: "О-Держатель для стаканов (черный)", price: null, image: "prod21.jpg", badge: null },
    { id: 22, name: "О-Держатель для стаканов (серый)", price: null, image: "prod22.jpg", badge: null },
    { id: 23, name: "О-Держатель для стаканов (белый)", price: null, image: "prod23.jpg", badge: null },
    { id: 24, name: "О-Ручка для бутылей обрезиненная плоская", price: null, image: "prod24.jpg", badge: null },
    { id: 25, name: "Стакан пластиковый 200 мл", price: 105, image: "prod25.jpg", badge: null },
    { id: 26, name: "Х-Салфетки белая, 70шт./уп.", price: 20, image: "prod26.jpg", badge: null }
];

const giftCardProducts = [
    { id: 27, name: "Подарочная карта, номинал 3500 р.", price: 3500, image: "prod27.jpg", badge: null },
    { id: 28, name: "Подарочная карта, номинал 2500 р.", price: 2500, image: "prod28.jpg", badge: null },
    { id: 29, name: "Подарочная карта, номинал 1500 р.", price: 1500, image: "prod29.jpg", badge: null }
];

// ===== ДЕЛАЕМ МАССИВЫ ГЛОБАЛЬНЫМИ =====
window.products = products;
window.hitProducts = hitProducts;
window.waterProducts = waterProducts;
window.equipmentProducts = equipmentProducts;
window.accessoryProducts = accessoryProducts;
window.giftCardProducts = giftCardProducts;

function getCatalogBadgeHTML(badge) {
    if (badge === 'hit') {
        return '<div class="product-card__badges"><span class="product-card__badge--hit">Хит</span></div>';
    } else if (badge === 'new') {
        return '<div class="product-card__badges"><span class="product-card__badge--new">Новинка</span></div>';
    }
    return '';
}

function renderCatalogProducts(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${getCatalogBadgeHTML(product.badge)}
            <a href="product-detail.html?id=${product.id}" class="product-card__link">
                <div class="product-card__image">
                    <img src="images/${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__price">${product.price !== null ? product.price + ' ₽' : 'Цена не указана'}</div>
                <h3 class="product-card__title">${product.name}</h3>
            </a>
            <div class="product-card__info">
                <span class="product-card__stock ${product.price !== null ? 'product-card__stock--in-stock' : 'product-card__stock--out-of-stock'}">${product.price !== null ? 'Есть в наличии' : 'Нет в наличии'}</span>
                <span class="product-card__sku">Артикул: ${product.id}</span>
            </div>
            <button class="product-card__btn" onclick="event.stopPropagation(); addToCart(${product.id})">В корзину</button>
        </div>
    `).join('');
}

// ============================================
// РЕНДЕРИМ ТОВАРЫ В ЗАВИСИМОСТИ ОТ СТРАНИЦЫ
// ============================================
const currentPage = window.location.pathname.split('/').pop().toLowerCase();

function renderAllProducts() {
    if (currentPage === 'water.html') {
        if (document.getElementById('waterProductsGrid')) {
            renderCatalogProducts('waterProductsGrid', waterProducts);
        }
    } 
    else if (currentPage === 'equipment.html') {
        if (document.getElementById('equipmentProductsGrid')) {
            renderCatalogProducts('equipmentProductsGrid', equipmentProducts);
        }
    } 
    else if (currentPage === 'accessories.html') {
        if (document.getElementById('accessoryProductsGrid')) {
            renderCatalogProducts('accessoryProductsGrid', accessoryProducts);
        }
    } 
    else if (currentPage === 'gift-cards.html') {
        if (document.getElementById('giftCardProductsGrid')) {
            renderCatalogProducts('giftCardProductsGrid', giftCardProducts);
        }
    } 
    else {
        const hitGrid = document.getElementById('hitProductsGrid');
        if (hitGrid) {
            renderCatalogProducts('hitProductsGrid', hitProducts);
        }
        
        const grids = [
            { id: 'waterProductsGrid', data: waterProducts },
            { id: 'equipmentProductsGrid', data: equipmentProducts },
            { id: 'accessoryProductsGrid', data: accessoryProducts },
            { id: 'giftCardProductsGrid', data: giftCardProducts }
        ];
        
        grids.forEach(grid => {
            if (document.getElementById(grid.id)) {
                renderCatalogProducts(grid.id, grid.data);
            }
        });
    }
}

renderAllProducts();

// ============================================
// ФИЛЬТРЫ — СТАТИЧНАЯ ВЕРСИЯ (ТОЛЬКО UI)
// ============================================

// ===== СОСТОЯНИЕ ФИЛЬТРОВ (НЕ ИСПОЛЬЗУЕТСЯ ДЛЯ ФИЛЬТРАЦИИ) =====
var filterState = {
    hit: false,
    sale: false,
    reusable: false,
    sort: 'popular',
    priceMin: null,
    priceMax: null,
    sortBy: 'price',
    sortOrder: 'asc'
};

// ===== ФУНКЦИЯ ОБНОВЛЕНИЯ ТОВАРОВ (НИЧЕГО НЕ ДЕЛАЕТ) =====
function updateFilteredProducts() {
    // Просто показываем все товары без фильтрации
    var currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    var container = null;
    if (currentPage === 'water.html') {
        container = document.getElementById('waterProductsGrid');
    } else if (currentPage === 'equipment.html') {
        container = document.getElementById('equipmentProductsGrid');
    } else if (currentPage === 'accessories.html') {
        container = document.getElementById('accessoryProductsGrid');
    } else if (currentPage === 'gift-cards.html') {
        container = document.getElementById('giftCardProductsGrid');
    }
    
    if (container) {
        // Показываем все товары без изменений
        renderCatalogProducts(container.id, getCurrentPageProducts());
    }
}

// ===== ПОЛУЧИТЬ ТОВАРЫ ДЛЯ ТЕКУЩЕЙ СТРАНИЦЫ =====
function getCurrentPageProducts() {
    var currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    if (currentPage === 'water.html') {
        return window.waterProducts || waterProducts || [];
    } else if (currentPage === 'equipment.html') {
        return window.equipmentProducts || equipmentProducts || [];
    } else if (currentPage === 'accessories.html') {
        return window.accessoryProducts || accessoryProducts || [];
    } else if (currentPage === 'gift-cards.html') {
        return window.giftCardProducts || giftCardProducts || [];
    } else {
        return [
            ...(window.waterProducts || waterProducts || []),
            ...(window.equipmentProducts || equipmentProducts || []),
            ...(window.accessoryProducts || accessoryProducts || []),
            ...(window.giftCardProducts || giftCardProducts || [])
        ];
    }
}

// ============================================
// ПК ФИЛЬТРЫ — СТАТИЧНАЯ ВЕРСИЯ
// ============================================

function initFilters() {
    var currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    if (currentPage === 'catalog.html' || currentPage === '') {
        return;
    }
    
    // === БЫСТРЫЕ ФИЛЬТРЫ (ТОЛЬКО ВИЗУАЛЬНО) ===
    var hitBtn = document.querySelector('.filter-btn--hit');
    var saleBtn = document.querySelector('.filter-btn--sale');
    var reusableBtn = document.querySelector('.filter-btn--reusable');
    
    if (hitBtn) {
        hitBtn.removeEventListener('click', hitBtn._listener);
        hitBtn._listener = function() {
            this.classList.toggle('active');
            // Обновляем счетчик (визуально)
            updateFilterCount();
        };
        hitBtn.addEventListener('click', hitBtn._listener);
    }
    if (saleBtn) {
        saleBtn.removeEventListener('click', saleBtn._listener);
        saleBtn._listener = function() {
            this.classList.toggle('active');
            updateFilterCount();
        };
        saleBtn.addEventListener('click', saleBtn._listener);
    }
    if (reusableBtn) {
        reusableBtn.removeEventListener('click', reusableBtn._listener);
        reusableBtn._listener = function() {
            this.classList.toggle('active');
            updateFilterCount();
        };
        reusableBtn.addEventListener('click', reusableBtn._listener);
    }
    
    // === ПОПУЛЯРНЫЕ (ТОЛЬКО ВИЗУАЛЬНО) ===
    var popularDropdown = document.querySelector('.filter-dropdown .dropdown-menu');
    if (popularDropdown) {
        var options = popularDropdown.querySelectorAll('input[type="checkbox"]');
        options.forEach(function(option) {
            option.removeEventListener('change', option._listener);
            option._listener = function() {
                options.forEach(function(o) { o.checked = false; });
                this.checked = true;
                updateFilterCount();
            };
            option.addEventListener('change', option._listener);
        });
    }
    
    // === ЦЕНА (ТОЛЬКО ВИЗУАЛЬНО) ===
    var priceMinInput = document.querySelector('.price-min');
    var priceMaxInput = document.querySelector('.price-max');
    var priceApplyBtn = document.querySelector('.price-apply');
    
    if (priceApplyBtn) {
        priceApplyBtn.removeEventListener('click', priceApplyBtn._listener);
        priceApplyBtn._listener = function() {
            var dropdown = this.closest('.filter-dropdown');
            if (dropdown) dropdown.classList.remove('active');
            updateFilterCount();
        };
        priceApplyBtn.addEventListener('click', priceApplyBtn._listener);
    }
    
    // === СОРТИРОВКА ПО ЦЕНЕ (ТОЛЬКО ВИЗУАЛЬНО) ===
    var sortPriceBtn = document.querySelector('.sort-price');
    if (sortPriceBtn) {
        sortPriceBtn.removeEventListener('click', sortPriceBtn._listener);
        sortPriceBtn._listener = function() {
            // Снимаем активность с других кнопок сортировки
            document.querySelector('.sort-name')?.classList.remove('active');
            this.classList.toggle('active');
            updateFilterCount();
        };
        sortPriceBtn.addEventListener('click', sortPriceBtn._listener);
    }
    
    // === СОРТИРОВКА ПО НАИМЕНОВАНИЮ (ТОЛЬКО ВИЗУАЛЬНО) ===
    var sortNameBtn = document.querySelector('.sort-name');
    if (sortNameBtn) {
        sortNameBtn.removeEventListener('click', sortNameBtn._listener);
        sortNameBtn._listener = function() {
            // Снимаем активность с других кнопок сортировки
            document.querySelector('.sort-price')?.classList.remove('active');
            this.classList.toggle('active');
            updateFilterCount();
        };
        sortNameBtn.addEventListener('click', sortNameBtn._listener);
    }
    
    // === СБРОС (ТОЛЬКО ВИЗУАЛЬНО) ===
    var resetBtn = document.querySelector('.mobile-filters-reset');
    if (resetBtn) {
        resetBtn.removeEventListener('click', resetBtn._listener);
        resetBtn._listener = function() {
            // Сбрасываем все визуальные состояния
            document.querySelectorAll('.filter-btn--hit, .filter-btn--sale, .filter-btn--reusable').forEach(function(btn) {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.filter-dropdown .dropdown-menu input[type="checkbox"]').forEach(function(input) {
                input.checked = false;
            });
            document.querySelectorAll('.price-min, .price-max').forEach(function(input) {
                input.value = '';
            });
            document.querySelectorAll('.sort-price, .sort-name').forEach(function(btn) {
                btn.classList.remove('active');
            });
            updateFilterCount();
        };
        resetBtn.addEventListener('click', resetBtn._listener);
    }
    
    // Обновляем счетчик
    updateFilterCount();
}

// ===== ОБНОВЛЕНИЕ СЧЕТЧИКА (ВСЕГДА ПОКАЗЫВАЕТ ВСЕ ТОВАРЫ) =====
function updateFilterCount() {
    var counter = document.getElementById('filterCount');
    if (counter) {
        var products = getCurrentPageProducts();
        counter.textContent = products.length;
    }
}

// ============================================
// МОБИЛЬНЫЕ ФИЛЬТРЫ — СТАТИЧНАЯ ВЕРСИЯ
// ============================================

var mobileFilterBtn = document.querySelector('.mobile-filter-btn');
var mobileFiltersOverlay = document.getElementById('mobileFiltersOverlay');
var closeFiltersBtn = document.getElementById('closeFiltersBtn');

// Открытие/закрытие мобильных фильтров
if (mobileFilterBtn && mobileFiltersOverlay) {
    mobileFilterBtn.addEventListener('click', function() {
        mobileFiltersOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeFiltersBtn && mobileFiltersOverlay) {
    closeFiltersBtn.addEventListener('click', function() {
        mobileFiltersOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (mobileFiltersOverlay) {
    mobileFiltersOverlay.addEventListener('click', function(e) {
        if (e.target === mobileFiltersOverlay) {
            mobileFiltersOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// === КЛИК ПО МОБИЛЬНЫМ КНОПКАМ (ТОЛЬКО ВИЗУАЛЬНО) ===
document.querySelectorAll('.mobile-filter-btn-filter').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        // Синхронизируем с ПК-кнопкой
        var filterType = this.dataset.filter;
        var desktopBtn = document.querySelector('.filter-btn--' + filterType);
        if (desktopBtn) {
            if (this.classList.contains('active')) {
                desktopBtn.classList.add('active');
            } else {
                desktopBtn.classList.remove('active');
            }
        }
        updateFilterCount();
    });
});

// === ЦЕНА (ТОЛЬКО ВИЗУАЛЬНО) ===
var mobilePriceApply = document.querySelector('.mobile-price-apply');
var mobilePriceMin = document.querySelector('.mobile-price-min');
var mobilePriceMax = document.querySelector('.mobile-price-max');

if (mobilePriceApply) {
    mobilePriceApply.addEventListener('click', function(e) {
        e.stopPropagation();
        // Копируем значения в ПК-поля
        var desktopMin = document.querySelector('.price-min');
        var desktopMax = document.querySelector('.price-max');
        if (desktopMin) desktopMin.value = mobilePriceMin ? mobilePriceMin.value : '';
        if (desktopMax) desktopMax.value = mobilePriceMax ? mobilePriceMax.value : '';
        updateFilterCount();
        // Закрываем мобильные фильтры
        if (mobileFiltersOverlay) {
            mobileFiltersOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// === ПРИМЕНИТЬ (ТОЛЬКО ЗАКРЫВАЕТ МОДАЛКУ) ===
var mobileApplyBtn = document.querySelector('.mobile-filters-apply');
if (mobileApplyBtn) {
    mobileApplyBtn.addEventListener('click', function() {
        if (mobileFiltersOverlay) {
            mobileFiltersOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        updateFilterCount();
    });
}

// === СБРОС ===
var mobileResetBtn = document.querySelector('.mobile-filters-reset');
if (mobileResetBtn) {
    mobileResetBtn.addEventListener('click', function() {
        // Сбрасываем мобильные кнопки
        document.querySelectorAll('.mobile-filter-btn-filter').forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        // Сбрасываем цену
        if (mobilePriceMin) mobilePriceMin.value = '';
        if (mobilePriceMax) mobilePriceMax.value = '';
        
        // Сбрасываем сортировку
        document.querySelectorAll('.mobile-filters-content input[name="mobile-sort"]').forEach(function(cb) {
            cb.checked = false;
        });
        
        // Сбрасываем ПК-фильтры
        document.querySelectorAll('.filter-btn--hit, .filter-btn--sale, .filter-btn--reusable').forEach(function(btn) {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.filter-dropdown .dropdown-menu input[type="checkbox"]').forEach(function(cb) {
            cb.checked = false;
        });
        document.querySelectorAll('.price-min, .price-max').forEach(function(input) {
            input.value = '';
        });
        document.querySelectorAll('.sort-price, .sort-name').forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        updateFilterCount();
    });
}

// ===== ЗАПУСК =====
var currentPageForFilters = window.location.pathname.split('/').pop().toLowerCase();
if (currentPageForFilters === 'water.html' || 
    currentPageForFilters === 'equipment.html' ||
    currentPageForFilters === 'accessories.html' ||
    currentPageForFilters === 'gift-cards.html') {
    setTimeout(initFilters, 300);
}

window.updateFilteredProducts = updateFilteredProducts;
window.filterState = filterState;

console.log('✅ Фильтры (статичные) загружены!');

// ===== ТОВАРЫ ПО АКЦИИ (ХИТЫ + НОВИНКИ) =====
const promoProducts = [];

waterProducts.forEach(p => {
    if (p.badge === 'hit' || p.badge === 'new') {
        promoProducts.push(p);
    }
});

equipmentProducts.forEach(p => {
    if (p.badge === 'hit' || p.badge === 'new') {
        if (!promoProducts.some(existing => existing.id === p.id)) {
            promoProducts.push(p);
        }
    }
});

accessoryProducts.forEach(p => {
    if (p.badge === 'hit' || p.badge === 'new') {
        if (!promoProducts.some(existing => existing.id === p.id)) {
            promoProducts.push(p);
        }
    }
});

giftCardProducts.forEach(p => {
    if (p.badge === 'hit' || p.badge === 'new') {
        if (!promoProducts.some(existing => existing.id === p.id)) {
            promoProducts.push(p);
        }
    }
});

function renderPromoProducts() {
    const container = document.getElementById('promoProductsGrid');
    if (!container) return;
    
    if (promoProducts.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">Товары по акции скоро появятся</p>';
        return;
    }
    
    container.innerHTML = promoProducts.map(p => `
        <div class="product-card">
            <div class="product-card__badges">
                ${p.badge === 'hit' ? '<span class="product-card__badge--hit">Хит</span>' : ''}
                ${p.badge === 'new' ? '<span class="product-card__badge--new">Новинка</span>' : ''}
            </div>
            <a href="product-detail.html?id=${p.id}" class="product-card__link">
                <div class="product-card__image"><img src="images/${p.image}" alt="${p.name}"></div>
                <div class="product-card__price">${p.price !== null ? p.price + ' ₽' : 'Цена не указана'}</div>
                <h3 class="product-card__title">${p.name}</h3>
            </a>
            <div class="product-card__info">
                <span class="product-card__stock ${p.price !== null ? 'product-card__stock--in-stock' : 'product-card__stock--out-of-stock'}">${p.price !== null ? 'Есть в наличии' : 'Нет в наличии'}</span>
                <span class="product-card__sku">Артикул: ${p.id}</span>
            </div>
            <button class="product-card__btn" onclick="event.stopPropagation(); addToCart(${p.id})">В корзину</button>
        </div>
    `).join('');
}

// ===== СЛАЙДЕР АКЦИЙ =====
const promoSlidesData = [
    { img: "images/ac1.png", link: "promo-detail 3.html" },
    { img: "images/ac2.png", link: "promo-detail.html" },
    { img: "images/ac3.png", link: "promo-detail 2.html" },
    { img: "images/ac4.png", link: "promo-detail 5.html" },
    { img: "images/ac5.png", link: "promo-detail 4.html" },
    { img: "images/ac1.png", link: "promo-detail 3.html" },
    { img: "images/ac2.png", link: "promo-detail.html" },
    { img: "images/ac3.png", link: "promo-detail 2.html" },
    { img: "images/ac4.png", link: "promo-detail 5.html" },
    { img: "images/ac5.png", link: "promo-detail 4.html" }
];

if (window.location.pathname.includes('promo-detail')) {
    
    renderPromoProducts();
    
    let currentPromoIndex = 0;
    const promoSlidesContainer = document.getElementById('promoSliderSlides');
    const promoPrevBtn = document.querySelector('.promo-slider__arrow--prev');
    const promoNextBtn = document.querySelector('.promo-slider__arrow--next');
    let promoAutoInterval;
    
    function getSlidesToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 4;
    }
    
    function renderPromoSlides() {
        if (!promoSlidesContainer) return;
        const doubledSlides = [...promoSlidesData, ...promoSlidesData, ...promoSlidesData];
        promoSlidesContainer.innerHTML = doubledSlides.map(slide => `
            <div class="promo-slider__slide" onclick="location.href='${slide.link}'">
                <img src="${slide.img}" alt="Акция">
            </div>
        `).join('');
    }
    
    function updatePromoSlider() {
        if (!promoSlidesContainer || !promoSlidesContainer.children[0]) return;
        const slideWidth = promoSlidesContainer.children[0].offsetWidth + 20;
        promoSlidesContainer.style.transform = `translateX(-${currentPromoIndex * slideWidth}px)`;
    }
    
    function nextPromoSlide() {
        const slidesToShow = getSlidesToShow();
        const totalSlides = document.querySelectorAll('.promo-slider__slide').length;
        const maxIndex = totalSlides - slidesToShow;
        currentPromoIndex = currentPromoIndex < maxIndex ? currentPromoIndex + 1 : 0;
        updatePromoSlider();
    }
    
    function prevPromoSlide() {
        if (currentPromoIndex > 0) {
            currentPromoIndex--;
        } else {
            const totalSlides = document.querySelectorAll('.promo-slider__slide').length;
            const slidesToShow = getSlidesToShow();
            currentPromoIndex = totalSlides - slidesToShow;
        }
        updatePromoSlider();
    }
    
    function startPromoAutoSlide() {
        if (promoAutoInterval) clearInterval(promoAutoInterval);
        promoAutoInterval = setInterval(nextPromoSlide, 5000);
    }
    
    if (promoPrevBtn && promoNextBtn && promoSlidesContainer) {
        renderPromoSlides();
        setTimeout(() => {
            currentPromoIndex = promoSlidesData.length;
            updatePromoSlider();
            startPromoAutoSlide();
        }, 100);
        
        promoPrevBtn.onclick = function(e) {
            e.preventDefault();
            prevPromoSlide();
            startPromoAutoSlide();
        };
        
        promoNextBtn.onclick = function(e) {
            e.preventDefault();
            nextPromoSlide();
            startPromoAutoSlide();
        };
        
        window.addEventListener('resize', function() {
            updatePromoSlider();
        });
    }
    
    const promoCatalogBtn = document.getElementById('promoCatalogBtn');
    if (promoCatalogBtn) {
        promoCatalogBtn.onclick = function() {
            window.location.href = 'catalog.html';
        };
    }
}

// ===== СТРАНИЦА ТОВАРА =====
if (window.location.pathname.includes('product-detail.html')) {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    window.currentProductId = productId;
    
    const productsDatabase = {
        1: { 
            id: 1, 
            name: "В-Вода 18,9л. Вкусная вода для Вас, 1кат.", 
            price: 260, 
            oldPrice: null, 
            image: "prod1.jpg",
            bigImage: "prod1-big.jpg",
            badge: "hit", 
            sku: "W001", 
            category: "Вода", 
            inStock: true, 
            description: "Вода питьевая 'Вкусная вода для Вас' Питьевая вода первой категории - Подходит для ежедневного употребления без ограничений - Имеет сбалансированный минеральный состав, оптимальный для каждого человека - Добывается из артезианских скважин. Общая минерализация: 50 - 500 мг/л", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Питьевая" }, { name: "Минерализация", value: "50 - 500 мг/л" }] 
        },
        2: { 
            id: 2, 
            name: "В-Вода 18,9л. Вкусная вода для Кофемашин", 
            price: 280, 
            oldPrice: null, 
            image: "prod2.jpg",
            bigImage: "prod2-big.jpg",
            badge: "new", 
            sku: "W002", 
            category: "Вода", 
            inStock: true, 
            description: "Уменьшенное содержания солей жесткости придает воде особо мягкий вкус, питьевая вода 'Вкусная вода для Кофемашин' практически не дает накипи. Рекомендована для применения в электрических чайниках и кофейных аппаратах. Общая минерализация: до 100 мг/л", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Питьевая" }, { name: "Минерализация", value: "до 100 мг/л" }] 
        },
        3: { 
            id: 3, 
            name: "В-Вода 18,9л. Вкусная вода для Вас Premium", 
            price: 300, 
            oldPrice: null, 
            image: "prod3.jpg",
            bigImage: "prod3-big.jpg",
            badge: "hit", 
            sku: "W003", 
            category: "Вода", 
            inStock: true, 
            description: "Вода питьевая 'Вкусная вода для Вас Premium' с добавлением йода и фтора Питьевая вода высшей категории - Может поддерживать уровень фтора в костях и зубной эмали - Фтор жизненно необходим для нормального роста и развития - Йод помогает улучшить ассоциативные способности и память - Добывается из артезианских скважин. Общая минерализация: 200 - 500 мг/л", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Питьевая" }, { name: "Минерализация", value: "200 - 500 мг/л" }] 
        },
        4: { 
            id: 4, 
            name: "В-Вода 18,9л. Горная Вершина, минер.", 
            price: 470, 
            oldPrice: null, 
            image: "prod4.jpg",
            bigImage: "prod4-big.jpg",
            badge: "hit", 
            sku: "W004", 
            category: "Вода", 
            inStock: true, 
            description: "Горная питьевая вода Горная вершина добывается на высоте 1 100 м над уровнем моря в поселке Нижний Архыз (Карачаево-Черкесская республика), на границе с Тебердинским биосферным заповедником. Экологическую чистоту этого места десятки лет патронирует ЮНЕСКО, признавая его одним из заповедных уголков Земли. Общая минерализация: 100 - 350 мг/л. Цена действительна при заказе от 2-х бутылей.", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Минеральная" }, { name: "Минерализация", value: "100 - 350 мг/л" }] 
        },
        5: { 
            id: 5, 
            name: "В-Вода 18,9л. Легенда гор, минер.", 
            price: 520, 
            oldPrice: null, 
            image: "prod5.jpg",
            bigImage: "prod5-big.jpg",
            badge: "hit", 
            sku: "W005", 
            category: "Вода", 
            inStock: true, 
            description: "Минеральная столовая питьевая вода 'Легенда гор' – уникальный, заключенный в воду природный код молодости. Она обладает особым свойством стимулировать природный механизм самовосстановления человеческого организма. Общая минерализация: 100 - 250 мг/л", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Минеральная столовая" }, { name: "Минерализация", value: "100 - 250 мг/л" }] 
        },
        6: { 
            id: 6, 
            name: "В-Вода 18,9л. Эльбрусинка, минер.", 
            price: 520, 
            oldPrice: null, 
            image: "prod6.jpg",
            bigImage: "prod6-big.jpg",
            badge: "hit", 
            sku: "W006", 
            category: "Вода", 
            inStock: true, 
            description: "Вода Эльбрусинка ДЕТСКАЯ - полезная вода. Она содержит 16 природных макро и микроминералов, которые нужны растущему организму как кирпичи для стройки дома. Общая минерализация: 100 - 300 мг/л", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Тип", value: "Минеральная" }, { name: "Минерализация", value: "100 - 300 мг/л" }] 
        },
        7: { 
            id: 7, 
            name: "Бутыль поликарбонатная (залоговая тара)", 
            price: 500, 
            oldPrice: null, 
            image: "prod7.jpg",
            bigImage: "prod7-big.jpg",
            badge: null, 
            sku: "W007", 
            category: "Вода", 
            inStock: true, 
            description: "Бутыли отдельно не продаются. 1. В случае окончательного возврата Бутылей залоговая стоимость Бутыли возвращается Покупателю в том объеме, в котором Покупатель вносил ее, на основании выставленных Поставщиком расчетных документов. Возврат залоговой стоимости Бутылей возможен исключительно при условии возврата Бутылей Поставщику в течении 30 (тридцати) календарных дней с момента последнего заказа воды; Бутыли должны быть возвращены Поставщику в первоначальном состоянии с учетом нормального износа. 2. В случае расторжения Договора сторонами, стоимость выезда водителя за тарой для последующего возврата залоговых сумм, внесенных ранее наличными средствами, составляет 400 рублей. Также тара может быть доставлена на склад Поставщика собственными силами Покупателя. 3. К обмену принимаются исключительно бутыли Поставщика, имеющие фирменную наклейку Поставщика, если с даты последней поставки/покупки прошло не более 3-х месяцев. Бутыли должны быть в первоначальном состоянии, с учетом нормального износа. Не битые, не треснутые, без сколов, трещин, потертостей, без следов наличия зеленой водоросли на стенках бутыли и, если ранее не хранили в ней каки-либо жидкости, кроме воды. Если с даты последней поставки/покупки прошло 3 и более месяца, то Компания оставляет за собой право не принимать такую тару. В этом случае необходимо внести залог. 4. Количество Бутылей, находящихся у Покупателя, не должно превышать количества оплаченных залоговых сумм. При увеличении заказываемого количества Бутылей с питьевой водой Покупатель обязан дополнительно оплатить залоговую стоимость за каждую не оплаченную ранее Бутыль.", 
            characters: [{ name: "Объем", value: "18.9 л" }, { name: "Материал", value: "Поликарбонат" }] 
        },
        8: { 
            id: 8, 
            name: "SMixx 16 LD/Е золотой", 
            price: null, 
            oldPrice: null, 
            image: "prod8.jpg",
            bigImage: "prod8-big.jpg",
            badge: null, 
            sku: "E001", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 550 Вт Мощность охлаждения: 70 Вт Нагрев: 5 л/ч – 90 ° С Охлаждение: 1 л/ч – 12-15° С Тип охлаждения: электронный Тип шкафчика: без шкафчика Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "550 Вт" }, { name: "Мощность охлаждения", value: "70 Вт" }, { name: "Тип охлаждения", value: "Электронный" }] 
        },
        9: { 
            id: 9, 
            name: "Aqua well 13 ПЭ", 
            price: null, 
            oldPrice: null, 
            image: "prod9.jpg",
            bigImage: "prod9-big.jpg",
            badge: null, 
            sku: "E002", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 550 Вт Мощность охлаждения: 70 Вт Нагрев: 5 л/ч – 90 ° С Охлаждение: 0,5 л/ч – 10° С Тип охлаждения: электронный Тип шкафчика: нет Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "550 Вт" }, { name: "Мощность охлаждения", value: "70 Вт" }, { name: "Тип охлаждения", value: "Электронный" }] 
        },
        10: { 
            id: 10, 
            name: "Smixx 03 LD серебро", 
            price: null, 
            oldPrice: null, 
            image: "prod10.jpg",
            bigImage: "prod10-big.jpg",
            badge: null, 
            sku: "E003", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 500 Вт Мощность охлаждения: 60 Вт Нагрев: 5 л/ч – 90 ° С Охлаждение: 0,7 л/ч – 12-15° С Тип охлаждения: электронное Тип шкафчика: без шкафчика Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "500 Вт" }, { name: "Мощность охлаждения", value: "60 Вт" }, { name: "Тип охлаждения", value: "Электронный" }] 
        },
        11: { 
            id: 11, 
            name: "89 LD ПЭ серый", 
            price: null, 
            oldPrice: null, 
            image: "prod11.jpg",
            bigImage: "prod11-big.jpg",
            badge: null, 
            sku: "E004", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 550 Вт Мощность охлаждения: 75 Вт Нагрев: 5 л/ч – 90 ° С Охлаждение: 0,7 л/ч – 12-15° С Тип охлаждения: электронное Тип шкафчика: без шкафчика Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "550 Вт" }, { name: "Мощность охлаждения", value: "75 Вт" }, { name: "Тип охлаждения", value: "Электронный" }] 
        },
        12: { 
            id: 12, 
            name: "Smixx 08М ПК", 
            price: null, 
            oldPrice: null, 
            image: "prod12.jpg",
            bigImage: "prod12-big.jpg",
            badge: null, 
            sku: "E005", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 500 Вт Мощность охлаждения: 112 Вт Нагрев: 5л/ч – 90 ° С Охлаждение: 3л/ч – 7° С Тип охлаждения: компрессорный Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "500 Вт" }, { name: "Мощность охлаждения", value: "112 Вт" }, { name: "Тип охлаждения", value: "Компрессорный" }] 
        },
        13: { 
            id: 13, 
            name: "Smixx 16L/E ПК", 
            price: null, 
            oldPrice: null, 
            image: "prod13.jpg",
            bigImage: "prod13-big.jpg",
            badge: null, 
            sku: "E006", 
            category: "Оборудование", 
            inStock: false, 
            description: "Тип загрузки: верхняя Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 500 Вт Мощность охлаждения: 112 Вт Нагрев: 5 л/ч – 90 ° С Охлаждение: 2 л/ч – 5-7° С Тип охлаждения: компрессорное Тип шкафчика: без шкафчика Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "500 Вт" }, { name: "Мощность охлаждения", value: "112 Вт" }, { name: "Тип охлаждения", value: "Компрессорный" }] 
        },
        14: { 
            id: 14, 
            name: "Aqua well QK-CЧ", 
            price: null, 
            oldPrice: null, 
            image: "prod14.jpg",
            bigImage: "prod14-big.jpg",
            badge: null, 
            sku: "E007", 
            category: "Оборудование", 
            inStock: false, 
            description: "Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 500 Вт Нагрев: 5л/ч – 90° С Охлаждение: комнатной температуры Тип охлаждения: без охлаждения Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "500 Вт" }, { name: "Тип охлаждения", value: "Без охлаждения" }] 
        },
        15: { 
            id: 15, 
            name: "Aqua well 15JXD CЭ", 
            price: null, 
            oldPrice: null, 
            image: "prod15.jpg",
            bigImage: "prod15-big.jpg",
            badge: null, 
            sku: "E008", 
            category: "Оборудование", 
            inStock: false, 
            description: "Напряжение: 220 В Частота: 50 Гц Мощность нагрева: 640 Вт Мощность охлаждения: 75 Вт Нагрев: 5л/ч – 90° С Охлаждение: 0,7л/ч - от 10° С Тип охлаждения: электронный Производитель: Китай", 
            characters: [{ name: "Тип загрузки", value: "Верхняя" }, { name: "Мощность нагрева", value: "640 Вт" }, { name: "Мощность охлаждения", value: "75 Вт" }, { name: "Тип охлаждения", value: "Электронный" }] 
        },
        16: { 
            id: 16, 
            name: "Smixx Стандарт (помпа)", 
            price: 700, 
            oldPrice: null, 
            image: "prod16.jpg",
            bigImage: "prod16-big.jpg",
            badge: null, 
            sku: "E009", 
            category: "Оборудование", 
            inStock: true, 
            description: "Гарантия на помпу - 1 месяц.", 
            characters: [{ name: "Тип", value: "Помпа" }, { name: "Гарантия", value: "1 месяц" }] 
        },
        17: { 
            id: 17, 
            name: "Помпа мех. HotFrost А25", 
            price: null, 
            oldPrice: null, 
            image: "prod17.jpg",
            bigImage: "prod17-big.jpg",
            badge: null, 
            sku: "E010", 
            category: "Оборудование", 
            inStock: false, 
            description: "Помпа для воды Hotfrost A25 механического типа предназначена для использования с бутылями объемом 19 л. Изделие подает воду порционно после несильного нажатия. Модель имеет легкую сборную конструкцию и фиксируется при помощи прижимной гайки.", 
            characters: [{ name: "Тип", value: "Механическая" }, { name: "Объем бутыли", value: "19 л" }] 
        },
        18: { 
            id: 18, 
            name: "Электрическая помпа", 
            price: null, 
            oldPrice: null, 
            image: "prod18.jpg",
            bigImage: "prod18-big.jpg",
            badge: null, 
            sku: "E011", 
            category: "Оборудование", 
            inStock: false, 
            description: "Электрическая помпа, имеет встроенный аккумулятор и заряжается по usb. Полная зарядка за 2 часа, заряда хватает приблизительно на 5 бутылей.", 
            characters: [{ name: "Тип", value: "Электрическая" }, { name: "Зарядка", value: "USB" }, { name: "Время зарядки", value: "2 часа" }] 
        },
        19: { 
            id: 19, 
            name: "Чехол на бутыль", 
            price: null, 
            oldPrice: null, 
            image: "prod19.jpg",
            bigImage: "prod19-big.jpg",
            badge: null, 
            sku: "A001", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Мастхев! Чехол сделан из сверхпрочной водонепроницаемой ткани, которая защищает воду от ультрафиолетовых лучей, сохраняя ее полезные свойства и вкус. Не только стильный аксессуар, но и крайне полезная штука. Налетайте, тираж небольшой!", 
            characters: [{ name: "Материал", value: "Водонепроницаемая ткань" }] 
        },
        20: { 
            id: 20, 
            name: "О-Ручка для бутылей Blue Rain", 
            price: null, 
            oldPrice: null, 
            image: "prod20.jpg",
            bigImage: "prod20-big.jpg",
            badge: null, 
            sku: "A002", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Ручка для бутылей Blue Rain.", 
            characters: [{ name: "Тип", value: "Ручка" }] 
        },
        21: { 
            id: 21, 
            name: "О-Держатель для стаканов (черный)", 
            price: null, 
            oldPrice: null, 
            image: "prod21.jpg",
            bigImage: "prod21-big.jpg",
            badge: null, 
            sku: "A003", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Держатель для стаканов (черный).", 
            characters: [{ name: "Цвет", value: "Черный" }] 
        },
        22: { 
            id: 22, 
            name: "О-Держатель для стаканов (серый)", 
            price: null, 
            oldPrice: null, 
            image: "prod22.jpg",
            bigImage: "prod22-big.jpg",
            badge: null, 
            sku: "A004", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Держатель для стаканов (серый).", 
            characters: [{ name: "Цвет", value: "Серый" }] 
        },
        23: { 
            id: 23, 
            name: "О-Держатель для стаканов (белый)", 
            price: null, 
            oldPrice: null, 
            image: "prod23.jpg",
            bigImage: "prod23-big.jpg",
            badge: null, 
            sku: "A005", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Держатель для стаканов (белый).", 
            characters: [{ name: "Цвет", value: "Белый" }] 
        },
        24: { 
            id: 24, 
            name: "О-Ручка для бутылей обрезиненная плоская", 
            price: null, 
            oldPrice: null, 
            image: "prod24.jpg",
            bigImage: "prod24-big.jpg",
            badge: null, 
            sku: "A006", 
            category: "Доп. продукция", 
            inStock: false, 
            description: "Обрезиненная плоская ручка для бутылей.", 
            characters: [{ name: "Тип", value: "Ручка" }, { name: "Материал", value: "Обрезиненная" }] 
        },
        25: { 
            id: 25, 
            name: "Стакан пластиковый 200 мл", 
            price: 105, 
            oldPrice: null, 
            image: "prod25.jpg",
            bigImage: "prod25-big.jpg",
            badge: null, 
            sku: "A007", 
            category: "Доп. продукция", 
            inStock: true, 
            description: "Пластиковый стакан 200 мл.", 
            characters: [{ name: "Объем", value: "200 мл" }, { name: "Материал", value: "Пластик" }] 
        },
        26: { 
            id: 26, 
            name: "Х-Салфетки белая, 70шт./уп.", 
            price: 20, 
            oldPrice: null, 
            image: "prod26.jpg",
            bigImage: "prod26-big.jpg",
            badge: null, 
            sku: "A008", 
            category: "Доп. продукция", 
            inStock: true, 
            description: "Белые салфетки, 70 штук в упаковке.", 
            characters: [{ name: "Количество", value: "70 шт." }, { name: "Цвет", value: "Белый" }] 
        },
        27: { 
            id: 27, 
            name: "Подарочная карта, номинал 3500 р.", 
            price: 3500, 
            oldPrice: null, 
            image: "prod27.jpg",
            bigImage: "prod27-big.jpg",
            badge: null, 
            sku: "G001", 
            category: "Подарочные карты", 
            inStock: true, 
            description: "Подарочная карта ООО «Компания «Аква-мир» - это прекрасный подарок для Ваших родных и друзей к любому празднику! Приобрести карту можно, заказав ее по телефону, на сайте или в мобильном приложении Вода Аква-Мир. Подарочная карта ООО «Компания «Аква-мир». Становясь держателем данной Карты, Вы принимаете условия и правила: Подарочная карта «Аква-мир» (далее Карта) является собственностью ООО «Компания «Аква-мир». Карта не является чеком, банковской картой, скидкой, не может быть использована для приобретения другой Карты, не может быть обналичена. ООО «Компания «Аква-мир» не несет ответственности за утерю, кражу, повреждение карты. Как работает Карта: При заказе сообщите оператору, что оплата будет производиться подарочной картой и отдайте её курьеру, когда он привезёт Вам заказ. Остаток по карте перейдет на Ваш виртуальный счет в нашей компании. Наша рекомендация: Предлагаем Вам приобрести пакетное предложение «Лёгкий старт. Помпа».", 
            characters: [{ name: "Номинал", value: "3500 ₽" }] 
        },
        28: { 
            id: 28, 
            name: "Подарочная карта, номинал 2500 р.", 
            price: 2500, 
            oldPrice: null, 
            image: "prod28.jpg",
            bigImage: "prod28-big.jpg",
            badge: null, 
            sku: "G002", 
            category: "Подарочные карты", 
            inStock: true, 
            description: "Подарочная карта ООО «Компания «Аква-мир» - это прекрасный подарок для Ваших родных и друзей к любому празднику! Приобрести карту можно, заказав ее по телефону, на сайте или в мобильном приложении Вода Аква-Мир. Подарочная карта ООО «Компания «Аква-мир». Становясь держателем данной Карты, Вы принимаете условия и правила: Подарочная карта «Аква-мир» (далее Карта) является собственностью ООО «Компания «Аква-мир». Карта не является чеком, банковской картой, скидкой, не может быть использована для приобретения другой Карты, не может быть обналичена. ООО «Компания «Аква-мир» не несет ответственности за утерю, кражу, повреждение карты. Как работает Карта: При заказе сообщите оператору, что оплата будет производиться подарочной картой и отдайте её курьеру, когда он привезёт Вам заказ. Остаток по карте перейдет на Ваш виртуальный счет в нашей компании. Наша рекомендация: Предлагаем Вам приобрести пакетное предложение «Лёгкий старт. Помпа».", 
            characters: [{ name: "Номинал", value: "2500 ₽" }] 
        },
        29: { 
            id: 29, 
            name: "Подарочная карта, номинал 1500 р.", 
            price: 1500, 
            oldPrice: null, 
            image: "prod29.jpg",
            bigImage: "prod29-big.jpg",
            badge: null, 
            sku: "G003", 
            category: "Подарочные карты", 
            inStock: true, 
            description: "Подарочная карта ООО «Компания «Аква-мир» - это прекрасный подарок для Ваших родных и друзей к любому празднику! Приобрести карту можно, заказав ее по телефону, на сайте или в мобильном приложении Вода Аква-Мир. Подарочная карта ООО «Компания «Аква-мир». Становясь держателем данной Карты, Вы принимаете условия и правила: Подарочная карта «Аква-мир» (далее Карта) является собственностью ООО «Компания «Аква-мир». Карта не является чеком, банковской картой, скидкой, не может быть использована для приобретения другой Карты, не может быть обналичена. ООО «Компания «Аква-мир» не несет ответственности за утерю, кражу, повреждение карты. Как работает Карта: При заказе сообщите оператору, что оплата будет производиться подарочной картой и отдайте её курьеру, когда он привезёт Вам заказ. Остаток по карте перейдет на Ваш виртуальный счет в нашей компании. Наша рекомендация: Предлагаем Вам приобрести пакетное предложение «Лёгкий старт. Помпа».", 
            characters: [{ name: "Номинал", value: "1500 ₽" }] 
        }
    };
    
    const product = productsDatabase[productId];
    
    if (product) {
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').innerHTML = product.price !== null ? product.price + ' ₽' : 'Цена не указана';
        if (product.oldPrice) {
            document.getElementById('productOldPrice').innerHTML = product.oldPrice + ' ₽';
        }
        document.getElementById('productStock').innerHTML = product.inStock ? 'В наличии' : 'Нет в наличии';
        document.getElementById('productStock').className = 'product-stock ' + (product.inStock ? 'in-stock' : 'out-of-stock');
        document.getElementById('productSku').innerHTML = `Артикул: ${product.sku}`;
        
        document.getElementById('productImage').src = `images/${product.bigImage || product.image}`;
        document.getElementById('productImage').alt = product.name;
        
        document.getElementById('productDescription').innerHTML = `<h3>Описание</h3><p>${product.description || 'Описание товара временно недоступно.'}</p>`;
        
        let badgesHtml = '';
        if (product.badge === 'hit') badgesHtml = '<span class="product-badge hit">Хит</span>';
        if (product.badge === 'sale') badgesHtml = '<span class="product-badge sale">Акция</span>';
        if (product.badge === 'new') badgesHtml = '<span class="product-badge new">Новинка</span>';
        document.getElementById('productBadges').innerHTML = badgesHtml;
        
        let charsHtml = '';
        if (product.characters && product.characters.length > 0) {
            product.characters.forEach(char => {
                charsHtml += `<tr><td>${char.name}</td><td>${char.value}</td></tr>`;
            });
        } else {
            charsHtml = '<tr><td colspan="2">Нет данных</td></tr>';
        }
        document.getElementById('charactersTable').innerHTML = charsHtml;
        
        document.title = `${product.name} — Аква Мир`;
    } else {
        document.getElementById('productDetailWrapper').innerHTML = '<div style="text-align:center;padding:60px"><h2>Товар не найден</h2><a href="catalog.html" style="color:#003968">Вернуться в каталог</a></div>';
    }
}

// ===== МОДАЛЬНЫЕ ОКНА =====
(function() {
    window.openModal = function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Модальное окно не найдено:', modalId);
        }
    };
    
    window.closeModal = function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
    
    document.addEventListener('mousedown', function(event) {
        var target = event.target;
        if (target.classList && target.classList.contains('modal')) {
            target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            var modals = document.querySelectorAll('.modal');
            modals.forEach(function(modal) {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    console.log('Модальные окна загружены');
})();

// ===== МАСКА ТЕЛЕФОНА =====
function setupPhoneMask(inputId, errorId) {
    const phoneInput = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('keydown', function(e) {
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (allowedKeys.includes(e.key)) return;
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    });
    
    phoneInput.addEventListener('input', function(e) {
        let digits = this.value.replace(/\D/g, '');
        
        if (digits.length === 0) {
            this.value = '';
            return;
        }
        
        if (digits.startsWith('9')) {
            digits = '7' + digits;
        }
        
        if (!digits.startsWith('7') && !digits.startsWith('8')) {
            digits = '7' + digits;
        }
        
        if (digits.length > 11) {
            digits = digits.substring(0, 11);
        }
        
        let formatted = '';
        let numberPart = digits;
        
        if (digits.startsWith('8')) {
            numberPart = '7' + digits.substring(1);
        }
        
        if (numberPart.length === 0) {
            formatted = '';
        } else if (numberPart.length <= 1) {
            formatted = '+' + numberPart;
        } else if (numberPart.length <= 4) {
            formatted = '+' + numberPart.substring(0, 1) + ' (' + numberPart.substring(1);
        } else if (numberPart.length <= 7) {
            formatted = '+' + numberPart.substring(0, 1) + ' (' + numberPart.substring(1, 4) + ') ' + numberPart.substring(4);
        } else if (numberPart.length <= 9) {
            formatted = '+' + numberPart.substring(0, 1) + ' (' + numberPart.substring(1, 4) + ') ' + numberPart.substring(4, 7) + '-' + numberPart.substring(7);
        } else {
            formatted = '+' + numberPart.substring(0, 1) + ' (' + numberPart.substring(1, 4) + ') ' + numberPart.substring(4, 7) + '-' + numberPart.substring(7, 9) + '-' + numberPart.substring(9, 11);
        }
        
        this.value = formatted;
        
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            if (errorElement) errorElement.classList.remove('show');
        }
    });
    
    phoneInput.addEventListener('blur', function() {
        const digits = this.value.replace(/\D/g, '');
        if (digits.length > 0 && digits.length < 11) {
            this.classList.add('error');
            if (errorElement) {
                errorElement.classList.add('show');
                errorElement.textContent = 'Введите полный номер (10 цифр)';
            }
        } else if (digits.length === 0) {
            this.classList.remove('error');
            if (errorElement) errorElement.classList.remove('show');
        } else {
            this.classList.remove('error');
            if (errorElement) errorElement.classList.remove('show');
        }
    });
}

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (digits.charAt(0) !== '7' && digits.charAt(0) !== '8') return false;
    return true;
}

// ===== ФОРМА ВХОДА =====
window.sendCode = function(event) {
    event.preventDefault();
    var phone = document.getElementById('phoneNumber');
    var agree = document.getElementById('agreePersonal');
    
    if (!agree.checked) {
        alert('Подтвердите согласие на обработку персональных данных');
        return;
    }
    
    if (!phone.value || !validatePhone(phone.value)) {
        alert('Введите корректный номер телефона (11 цифр)');
        phone.classList.add('error');
        return;
    }
    
    alert('Код подтверждения отправлен на номер ' + phone.value);
};

// ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
window.submitCallForm = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('callName');
    const phone = document.getElementById('callPhone');
    const agree = document.getElementById('callAgreePersonal');
    let isValid = true;
    
    if (!name.value || name.value.trim().length < 2) {
        name.classList.add('error');
        document.getElementById('callNameError').classList.add('show');
        isValid = false;
    } else {
        name.classList.remove('error');
        name.classList.add('success');
        document.getElementById('callNameError').classList.remove('show');
    }
    
    if (!validatePhone(phone.value)) {
        phone.classList.add('error');
        document.getElementById('callPhoneError').classList.add('show');
        document.getElementById('callPhoneError').textContent = 'Введите корректный номер (11 цифр)';
        isValid = false;
    } else {
        phone.classList.remove('error');
        phone.classList.add('success');
        document.getElementById('callPhoneError').classList.remove('show');
    }
    
    if (!agree.checked) {
        document.getElementById('callAgreeError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('callAgreeError').classList.remove('show');
    }
    
    if (!isValid) return;
    
    const btn = document.querySelector('#callForm .modal__btn');
    btn.disabled = true;
    btn.textContent = 'Отправка...';
    
    console.log('Заявка на звонок:', { name: name.value, phone: phone.value });
    
    setTimeout(function() {
        document.querySelector('#callForm').style.display = 'none';
        document.querySelector('#callModal .checkbox-group').style.display = 'none';
        document.getElementById('callSuccess').style.display = 'block';
        
        btn.disabled = false;
        btn.textContent = 'Отправить';
        
        setTimeout(function() {
            closeModal('callModal');
            setTimeout(function() {
                document.querySelector('#callForm').reset();
                document.querySelector('#callForm').style.display = 'block';
                document.querySelector('#callModal .checkbox-group').style.display = 'block';
                document.getElementById('callSuccess').style.display = 'none';
                agree.checked = false;
                name.classList.remove('success', 'error');
                phone.classList.remove('success', 'error');
                document.getElementById('callNameError').classList.remove('show');
                document.getElementById('callPhoneError').classList.remove('show');
                document.getElementById('callAgreeError').classList.remove('show');
            }, 300);
        }, 3000);
    }, 1500);
};

// ===== АВТОФОКУС =====
const observer = new MutationObserver(function() {
    const modal = document.getElementById('callModal');
    if (modal && modal.classList.contains('show')) {
        setTimeout(function() {
            const nameInput = document.getElementById('callName');
            if (nameInput) nameInput.focus();
        }, 300);
    }
});

const modal = document.getElementById('callModal');
if (modal) {
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

setupPhoneMask('phoneNumber', null);
setupPhoneMask('callPhone', 'callPhoneError');
setupPhoneMask('resumePhone', 'resumePhoneError');

// ===== КНОПКА "СВЯЗАТЬСЯ" =====
const aboutContactBtn = document.querySelector('.about-contact-btn');
if (aboutContactBtn) {
    aboutContactBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('callModal');
    });
}

// ===== ФОРМА ОТПРАВКИ РЕЗЮМЕ =====
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupFileUpload() {
    const fileInput = document.getElementById('resumeFile');
    const fileName = document.getElementById('fileName');
    const fileLabel = document.getElementById('fileLabel');
    
    if (!fileInput || !fileName) return;
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const maxSize = 5 * 1024 * 1024;
            
            if (file.size > maxSize) {
                alert('Файл слишком большой. Максимальный размер 5MB');
                this.value = '';
                fileName.textContent = '';
                return;
            }
            
            fileName.textContent = '📎 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
            fileLabel.classList.remove('error');
            document.getElementById('resumeFileError').classList.remove('show');
        } else {
            fileName.textContent = '';
        }
    });
}

window.submitResumeForm = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('resumeName');
    const phone = document.getElementById('resumePhone');
    const email = document.getElementById('resumeEmail');
    const position = document.getElementById('resumePosition');
    const fileInput = document.getElementById('resumeFile');
    const agree = document.getElementById('resumeAgreePersonal');
    let isValid = true;
    
    if (!name.value || name.value.trim().length < 2) {
        name.classList.add('error');
        document.getElementById('resumeNameError').classList.add('show');
        isValid = false;
    } else {
        name.classList.remove('error');
        name.classList.add('success');
        document.getElementById('resumeNameError').classList.remove('show');
    }
    
    if (!validatePhone(phone.value)) {
        phone.classList.add('error');
        document.getElementById('resumePhoneError').classList.add('show');
        document.getElementById('resumePhoneError').textContent = 'Введите корректный номер (11 цифр)';
        isValid = false;
    } else {
        phone.classList.remove('error');
        phone.classList.add('success');
        document.getElementById('resumePhoneError').classList.remove('show');
    }
    
    if (!validateEmail(email.value)) {
        email.classList.add('error');
        document.getElementById('resumeEmailError').classList.add('show');
        isValid = false;
    } else {
        email.classList.remove('error');
        email.classList.add('success');
        document.getElementById('resumeEmailError').classList.remove('show');
    }
    
    if (!position.value) {
        position.classList.add('error');
        document.getElementById('resumePositionError').classList.add('show');
        isValid = false;
    } else {
        position.classList.remove('error');
        document.getElementById('resumePositionError').classList.remove('show');
    }
    
    if (!fileInput.files || !fileInput.files[0]) {
        document.getElementById('fileLabel').classList.add('error');
        document.getElementById('resumeFileError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('fileLabel').classList.remove('error');
        document.getElementById('resumeFileError').classList.remove('show');
    }
    
    if (!agree.checked) {
        document.getElementById('resumeAgreeError').classList.add('show');
        isValid = false;
    } else {
        document.getElementById('resumeAgreeError').classList.remove('show');
    }
    
    if (!isValid) return;
    
    const btn = document.querySelector('#resumeForm .modal__btn');
    btn.disabled = true;
    btn.textContent = 'Отправка...';
    
    const formData = {
        name: name.value,
        phone: phone.value,
        email: email.value,
        position: position.value,
        experience: document.getElementById('resumeExperience').value,
        file: fileInput.files[0].name
    };
    
    console.log('Резюме отправлено:', formData);
    
    setTimeout(function() {
        document.querySelector('#resumeForm').style.display = 'none';
        document.querySelector('#resumeModal .checkbox-group').style.display = 'none';
        document.getElementById('resumeSuccess').style.display = 'block';
        
        btn.disabled = false;
        btn.textContent = 'Отправить резюме';
        
        setTimeout(function() {
            closeModal('resumeModal');
            setTimeout(function() {
                document.querySelector('#resumeForm').reset();
                document.querySelector('#resumeForm').style.display = 'block';
                document.querySelector('#resumeModal .checkbox-group').style.display = 'block';
                document.getElementById('resumeSuccess').style.display = 'none';
                document.getElementById('fileName').textContent = '';
                agree.checked = false;
                name.classList.remove('success', 'error');
                phone.classList.remove('success', 'error');
                email.classList.remove('success', 'error');
                position.classList.remove('error');
                document.getElementById('fileLabel').classList.remove('error');
                document.querySelectorAll('#resumeForm .form-error').forEach(function(el) {
                    el.classList.remove('show');
                });
            }, 300);
        }, 3000);
    }, 1500);
};

// ===== КНОПКА "ОТПРАВИТЬ РЕЗЮМЕ" =====
const vacanciesBtn = document.querySelector('.vacancies-btn');
if (vacanciesBtn) {
    vacanciesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('resumeModal');
    });
}

// ============================================
// ПОИСК ДЛЯ ПК
// ============================================
(function() {
    const searchInput = document.getElementById('desktopSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchDropdown || !searchResults) {
        return;
    }
    
    var allProducts = [];
    try {
        if (typeof products !== 'undefined') {
            products.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof hitProducts !== 'undefined') {
            hitProducts.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof waterProducts !== 'undefined') {
            waterProducts.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof equipmentProducts !== 'undefined') {
            equipmentProducts.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof promoProducts !== 'undefined') {
            promoProducts.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof accessoryProducts !== 'undefined') {
            accessoryProducts.forEach(function(p) { allProducts.push(p); });
        }
        if (typeof giftCardProducts !== 'undefined') {
            giftCardProducts.forEach(function(p) { allProducts.push(p); });
        }
        var unique = [];
        var ids = {};
        allProducts.forEach(function(item) {
            if (!ids[item.id]) {
                ids[item.id] = true;
                unique.push(item);
            }
        });
        allProducts = unique;
    } catch(e) {}
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 1) {
            searchDropdown.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        var results = allProducts.filter(function(product) {
            return product.name && product.name.toLowerCase().includes(query);
        });
        
        if (results.length > 0) {
            searchResults.innerHTML = results.slice(0, 10).map(function(item) {
                return '<a href="product-detail.html?id=' + item.id + '" class="search-dropdown__item">' +
                    '<img src="images/' + item.image + '" alt="' + item.name + '" loading="lazy">' +
                    '<div class="info">' +
                        '<div class="name">' + item.name + '</div>' +
                        '<div class="price">' + (item.price !== null ? item.price + ' ₽' : 'Цена не указана') + '</div>' +
                    '</div>' +
                '</a>';
            }).join('');
            searchDropdown.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="search-dropdown__empty">Ничего не найдено 😕</div>';
            searchDropdown.classList.add('active');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header__search')) {
            searchDropdown.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchDropdown.classList.remove('active');
            searchInput.blur();
        }
    });
})();

// ============================================
// МОБИЛЬНЫЙ ПОИСК
// ============================================
(function() {
    const searchIcon = document.querySelector('.mobile-icons .mobile-icon img[alt="Поиск"]');
    const searchContainer = document.getElementById('mobileSearch');
    const searchInput = document.getElementById('mobileSearchInput');
    const searchClose = document.getElementById('mobileSearchClose');
    const searchResults = document.getElementById('mobileSearchResults');
    
    if (!searchIcon || !searchContainer || !searchInput) return;
    
    var allMobileProducts = [];
    try {
        if (typeof products !== 'undefined') products.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof hitProducts !== 'undefined') hitProducts.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof waterProducts !== 'undefined') waterProducts.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof equipmentProducts !== 'undefined') equipmentProducts.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof promoProducts !== 'undefined') promoProducts.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof accessoryProducts !== 'undefined') accessoryProducts.forEach(function(p) { allMobileProducts.push(p); });
        if (typeof giftCardProducts !== 'undefined') giftCardProducts.forEach(function(p) { allMobileProducts.push(p); });
        var unique = [];
        var ids = {};
        allMobileProducts.forEach(function(item) {
            if (!ids[item.id]) {
                ids[item.id] = true;
                unique.push(item);
            }
        });
        allMobileProducts = unique;
    } catch(e) {}
    
    const searchParent = searchIcon.closest('.mobile-icon');
    if (searchParent) {
        searchParent.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(function() { searchInput.focus(); }, 300);
        });
    }
    
    function closeSearch() {
        searchContainer.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    searchContainer.addEventListener('click', function(e) {
        if (e.target === searchContainer) closeSearch();
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }
        
        var results = allMobileProducts.filter(function(product) {
            return product.name && product.name.toLowerCase().includes(query);
        });
        
        if (results.length > 0) {
            searchResults.innerHTML = results.slice(0, 10).map(function(item) {
                return '<a href="product-detail.html?id=' + item.id + '" class="mobile-search__result-item">' +
                    '<img src="images/' + item.image + '" alt="' + item.name + '" loading="lazy">' +
                    '<div class="info">' +
                        '<div class="name">' + item.name + '</div>' +
                        '<div class="price">' + (item.price !== null ? item.price + ' ₽' : 'Цена не указана') + '</div>' +
                    '</div>' +
                '</a>';
            }).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="mobile-search__not-found">Ничего не найдено 😕</div>';
            searchResults.classList.add('active');
        }
    });
})();

// ===== ПОП-АП ПРИ УХОДЕ С САЙТА =====
(function() {
    const exitPopup = document.getElementById('exitPopup');
    const exitPopupClose = document.getElementById('exitPopupClose');
    
    const isPopupAlreadyShown = sessionStorage.getItem('exitPopupShown');
    
    if (!exitPopup) return;
    if (isPopupAlreadyShown) return;
    
    let isMouseOut = false;
    let isPopupShown = false;
    
    if (exitPopupClose) {
        exitPopupClose.addEventListener('click', function() {
            exitPopup.classList.remove('show');
            isPopupShown = true;
            sessionStorage.setItem('exitPopupShown', 'true');
        });
    }
    
    exitPopup.addEventListener('click', function(e) {
        if (e.target === exitPopup || e.target.classList.contains('exit-popup__overlay')) {
            exitPopup.classList.remove('show');
            isPopupShown = true;
            sessionStorage.setItem('exitPopupShown', 'true');
        }
    });
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY < 0 && !isPopupShown && !isMouseOut) {
            isMouseOut = true;
            
            setTimeout(function() {
                exitPopup.classList.add('show');
                isPopupShown = true;
                sessionStorage.setItem('exitPopupShown', 'true');
            }, 300);
            
            setTimeout(function() {
                isMouseOut = false;
            }, 2000);
        }
    });
    
    document.addEventListener('mouseenter', function(e) {
        if (isMouseOut) {
            isMouseOut = false;
        }
    });
})();

// ===== ГЛОБАЛЬНЫЙ ОБЪЕКТ ДЛЯ ТОВАРОВ =====
window.allProducts = [];

function updateGlobalProducts() {
    window.allProducts = [];
    if (typeof products !== 'undefined') {
        window.allProducts = window.allProducts.concat(products);
    }
    if (typeof hitProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(hitProducts);
    }
    if (typeof waterProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(waterProducts);
    }
    if (typeof equipmentProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(equipmentProducts);
    }
    if (typeof promoProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(promoProducts);
    }
    if (typeof accessoryProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(accessoryProducts);
    }
    if (typeof giftCardProducts !== 'undefined') {
        window.allProducts = window.allProducts.concat(giftCardProducts);
    }
}

setTimeout(updateGlobalProducts, 100);

// ============================================
// ХЛЕБНЫЕ КРОШКИ — ИСПРАВЛЕННАЯ ВЕРСИЯ
// ============================================
function renderBreadcrumbs() {
    const container = document.getElementById('breadcrumbs');
    if (!container) {
        console.warn('⚠️ Элемент #breadcrumbs не найден на этой странице, пропускаем');
        return;
    }
    
    // Получаем имя файла и убираем лишние пробелы
    let currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    // Декодируем URL-кодированные символы (например, %20 -> пробел)
    currentPage = decodeURIComponent(currentPage);
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // БАЗОВЫЕ НАЗВАНИЯ СТРАНИЦ (с учетом всех вариантов)
    const pageNames = {
        'index.html': 'Главная',
        'about.html': 'О компании',
        'catalog.html': 'Каталог',
        'water.html': 'Вода',
        'equipment.html': 'Оборудование',
        'accessories.html': 'Доп. продукция',
        'gift-cards.html': 'Подарочные карты',
        'promo.html': 'Акции',
        'promo-detail.html': 'Акция',
        'promo-detail 2.html': 'Акция',
        'promo-detail 3.html': 'Акция',
        'promo-detail 4.html': 'Акция',
        'promo-detail 5.html': 'Акция',
        'product-detail.html': 'Товар',
        'contacts.html': 'Контакты',
        'pickup.html': 'Самовывоз',
        'cart.html': 'Корзина',
        'cabinet.html': 'Личный кабинет',
        'vacancies.html': 'Вакансии',
        'production.html': 'Производство',
        'cooperation.html': 'Сотрудничество',
        'sitemap.html': 'Карта сайта',
        'app.html': 'Мобильное приложение',
        'privacy.html': 'Политика конфиденциальности',
        'oferta.html': 'Договор оферты'
    };
    
    // РОДИТЕЛЬСКИЕ СТРАНИЦЫ
    const parentPages = {
        'water.html': { name: 'Каталог', url: 'catalog.html' },
        'equipment.html': { name: 'Каталог', url: 'catalog.html' },
        'accessories.html': { name: 'Каталог', url: 'catalog.html' },
        'gift-cards.html': { name: 'Каталог', url: 'catalog.html' },
        'product-detail.html': { name: 'Каталог', url: 'catalog.html' },
        'vacancies.html': { name: 'О компании', url: 'about.html' },
        'production.html': { name: 'О компании', url: 'about.html' },
        'cooperation.html': { name: 'О компании', url: 'about.html' }
    };
    
    // ВСЕ СТРАНИЦЫ АКЦИЙ (для проверки)
    const promoDetailPages = [
        'promo-detail.html',
        'promo-detail 2.html',
        'promo-detail 3.html',
        'promo-detail 4.html',
        'promo-detail 5.html'
    ];
    
    let breadcrumbs = '';
    
    // ===== ГЛАВНАЯ =====
    if (currentPage === 'index.html' || currentPage === '') {
        breadcrumbs = 'Главная';
    }
    
    // ===== ДЕТАЛЬНЫЕ СТРАНИЦЫ АКЦИЙ =====
    else if (promoDetailPages.includes(currentPage)) {
        breadcrumbs = `
            <a href="index.html">Главная</a>
            / <a href="promo.html">Акции</a>
            / <span>Акция</span>
        `;
    }
    
    // ===== СТРАНИЦА ТОВАРА =====
    else if (currentPage === 'product-detail.html') {
        const productId = parseInt(urlParams.get('id'));
        let productName = 'Товар';
        try {
            const allData = [
                ...(typeof products !== 'undefined' ? products : []),
                ...(typeof waterProducts !== 'undefined' ? waterProducts : []),
                ...(typeof equipmentProducts !== 'undefined' ? equipmentProducts : []),
                ...(typeof accessoryProducts !== 'undefined' ? accessoryProducts : []),
                ...(typeof giftCardProducts !== 'undefined' ? giftCardProducts : [])
            ];
            const found = allData.find(p => p.id === productId);
            if (found) productName = found.name;
        } catch(e) {}
        
        breadcrumbs = `
            <a href="index.html">Главная</a>
            / <a href="catalog.html">Каталог</a>
            / <span>${productName}</span>
        `;
    }
    
    // ===== СТРАНИЦЫ С РОДИТЕЛЯМИ =====
    else if (parentPages[currentPage]) {
        const parent = parentPages[currentPage];
        const pageName = pageNames[currentPage] || currentPage.replace('.html', '');
        breadcrumbs = `
            <a href="index.html">Главная</a>
            / <a href="${parent.url}">${parent.name}</a>
            / <span>${pageName}</span>
        `;
    }
    
    // ===== ВСЕ ОСТАЛЬНЫЕ СТРАНИЦЫ =====
    else {
        const pageName = pageNames[currentPage] || currentPage.replace('.html', '');
        breadcrumbs = `
            <a href="index.html">Главная</a>
            / <span>${pageName}</span>
        `;
    }
    
    container.innerHTML = breadcrumbs;
}

// Вызываем хлебные крошки
renderBreadcrumbs();



});