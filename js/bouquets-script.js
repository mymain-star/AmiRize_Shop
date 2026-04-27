// Импортируем данные из общего файла
import { productsData, collectionsConfig } from './products-data.js';

// ===== БУРГЕР-МЕНЮ =====
const burgerIcon = document.getElementById('burgerIcon');
const menuOverlay = document.getElementById('menuOverlay');
const closeBtn = document.getElementById('closeBtn');
const body = document.body;

// Открытие меню
if (burgerIcon) {
    burgerIcon.addEventListener('click', () => {
        menuOverlay.classList.add('active');
        body.classList.add('menu-open');
    });
}

// Закрытие через крестик
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
}

// Закрытие при клике вне меню
if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Закрытие при клике на пункт меню
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// ===== ФУНКЦИИ ДЛЯ ГЕНЕРАЦИИ КАРТОЧЕК =====

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
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

function initCollections() {
    const mainContent = document.getElementById('mainContent');
    // Берем конфиг именно для букетов
    const config = collectionsConfig.bouquets;
    
    if (!mainContent || !config) return;

    // Генерируем секцию
    mainContent.innerHTML = `
        <section class="catalog-section" data-collection="bouquets">
            <div class="catalog-trigger" id="${config.triggerId}">
                <div class="catalog-image">
                    <img src="${config.image}" alt="${config.title}">
                    <div class="catalog-label">
                        <span class="label-text">Показать коллекцию</span>
                        <i class="fas fa-chevron-down label-icon"></i>
                    </div>
                </div>
            </div>
            <div class="catalog-dropdown" id="${config.dropdownId}">
                <div class="cards-grid">
                    ${productsData.bouquets.map(createProductCard).join('')}
                </div>
            </div>
        </section>
    `;
    
    setupDropdown(config.triggerId, config.dropdownId);
}

// ===== ЛОГИКА ВЫПАДАЮЩЕГО СПИСКА =====

function setupDropdown(triggerId, dropdownId) {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!trigger || !dropdown) return;

    const labelText = trigger.querySelector('.label-text');
    const labelIcon = trigger.querySelector('.label-icon');
    let isOpen = false;

    trigger.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            dropdown.classList.add('show');
            trigger.classList.add('active');
            labelText.textContent = 'Скрыть коллекцию';
            labelIcon.classList.remove('fa-chevron-down');
            labelIcon.classList.add('fa-chevron-up');
            
            // Плавный скролл к началу коллекции
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

    // Закрытие при клике в любое другое место экрана
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

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Раздел букетов AMIRIZE загружен!');
    
    initCollections();
    
    // Подсвечиваем "Букеты" в сайдбаре как активный пункт
    // В твоем HTML ссылка на букеты имеет href="pip.html"
    const currentLink = document.querySelector('a[href="pip.html"]');
    if (currentLink) {
        currentLink.classList.add('active');
    }
});