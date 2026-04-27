// Импортируем данные
import { productsData, collectionsConfig } from './products-data.js';

// ===== БУРГЕР-МЕНЮ =====
const burgerIcon = document.getElementById('burgerIcon');
const menuOverlay = document.getElementById('menuOverlay');
const closeBtn = document.getElementById('closeBtn');
const body = document.body;
const mainContent = document.getElementById('mainContent');

// Открытие меню
burgerIcon.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    body.classList.add('menu-open');
});

// Закрытие через крестик
closeBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    body.classList.remove('menu-open');
});

// Закрытие при клике вне меню
menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Закрытие при клике на пункт меню
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// ===== ФУНКЦИИ ДЛЯ ГЕНЕРАЦИИ КАРТОЧЕК =====

// Функция для создания HTML карточки товара
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="card-img">
                <img src="${product.image}" alt="${product.name}">
            </div> 
            <div class="card-info">
                <h3 class="card-title">${product.name}</h3>
                <div class="card-price">${product.price}₽</div>
                ${product.description ? `<p class="card-desc">${product.description}</p>` : ''}
                <div class="card-id">Артикул: ${product.article}</div>
                <a class="button" href="${product.link}">Посмотреть</a>
            </div>
        </div>
    `;
}

// Функция для создания секции коллекции
function createCollectionSection(collectionKey, products) {
    const config = collectionsConfig[collectionKey];
    
    return `
        <section class="catalog-section" data-collection="${collectionKey}">
            <div class="catalog-trigger" id="${config.triggerId}">
                <div class="catalog-image">
                    <img src="${config.image}" alt="${config.title}">
                    <div class="catalog-label">
                        <span class="label-text">Показать коллекцию</span>
                        <i class="fas fa-chevron-down label-icon"></i>
                    </div>
                </div>
            </div>

            <!-- Выпадающий блок с карточками -->
            <div class="catalog-dropdown" id="${config.dropdownId}">
                <div class="cards-grid">
                    ${products.map(createProductCard).join('')}
                </div>
            </div>
        </section>
    `;
}

// Функция для инициализации всех коллекций
function initCollections() {
    let html = '';
    
    // JEWELRY COLLECTION (только одна коллекция на этой странице)
    html += createCollectionSection('jewelry', productsData.jewelry);
    
    mainContent.innerHTML = html;
    
    // Инициализируем выпадающие меню после генерации HTML
    initDropdowns();
}

// Функция для инициализации выпадающих меню
function initDropdowns() {
    function setupDropdown(triggerId, dropdownId) {
        const trigger = document.getElementById(triggerId);
        const dropdown = document.getElementById(dropdownId);
        
        if (!trigger || !dropdown) return;
        
        const labelText = trigger.querySelector('.label-text');
        const labelIcon = trigger.querySelector('.label-icon');
        let isOpen = false;
        
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            isOpen = !isOpen;
            
            if (isOpen) {
                dropdown.classList.add('show');
                trigger.classList.add('active');
                labelText.textContent = 'Скрыть коллекцию';
                labelIcon.classList.remove('fa-chevron-down');
                labelIcon.classList.add('fa-chevron-up');
                
                setTimeout(() => {
                    dropdown.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            } else {
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
                labelText.textContent = 'Показать коллекцию';
                labelIcon.classList.remove('fa-chevron-up');
                labelIcon.classList.add('fa-chevron-down');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target) && isOpen) {
                isOpen = false;
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
                labelText.textContent = 'Показать коллекцию';
                labelIcon.classList.remove('fa-chevron-up');
                labelIcon.classList.add('fa-chevron-down');
            }
        });
    }
    
    // Инициализируем выпадающее меню для бижутерии
    setupDropdown('jewelryTrigger', 'jewelryDropdown');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Раздел бижутерии AMIRIZE загружен!');
    
    // Генерируем коллекцию
    initCollections();
    
    // Добавляем активный класс к текущей странице в меню
    document.querySelector('a[href="jewelry.html"]').classList.add('active');
    
    // Добавляем обработчик для всех кнопок "Посмотреть"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('button')) {
            console.log('Переход к товару:', e.target.href);
        }
    });
});