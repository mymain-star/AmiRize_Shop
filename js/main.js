// Импортируем общие данные
import { productsData, collectionsConfig } from './products-data.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Сайт AMIRIZE загружен!');

    // ===== 1. ОБЩЕЕ БУРГЕР-МЕНЮ (работает на всех страницах) =====
    const burgerIcon = document.getElementById('burgerIcon');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const body = document.body;

    if (burgerIcon) {
        burgerIcon.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            body.classList.add('menu-open');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // ===== 2. УНИВЕРСАЛЬНЫЕ ФУНКЦИИ КАРТОЧЕК =====

    // Стандартная карточка с кнопкой "Посмотреть"
    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}" data-category="${product.category || ''}">
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

    // Карточка для мини-подарков (с кнопкой копирования артикула)
    function createMiniGiftCard(product) {
        return `
            <div class="product-card mini-card" data-id="${product.id}">
                <div class="card-img">
                    <img src="${product.image}" alt="${product.name}">
                </div> 
                <div class="card-info">
                    <h3 class="card-title">${product.name}</h3>
                    <div class="card-price">${product.price}₽</div>
                    <p class="card-desc">${product.description}</p>
                    <div class="card-id">Артикул: ${product.article}</div>
                    <button class="copy-article-btn" data-article="${product.article}">
                        <i class="fas fa-copy"></i> Копировать артикул
                    </button>
                </div>
            </div>
        `;
    }

    // Функция создания секции с выпадающим списком
    function createCollectionSection(collectionKey, products, labelTextCustom = 'Показать коллекцию') {
        const config = collectionsConfig[collectionKey];
        if (!config) return '';
        
        return `
            <section class="catalog-section" data-collection="${collectionKey}">
                <div class="catalog-trigger" id="${config.triggerId}">
                    <div class="catalog-image">
                        <img src="${config.image}" alt="${config.title}">
                        <div class="catalog-label">
                            <span class="label-text">${labelTextCustom}</span>
                            <i class="fas fa-chevron-down label-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="catalog-dropdown" id="${config.dropdownId}">
                    <div class="cards-grid">
                        ${products.map(createProductCard).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    // Настройка логики выпадающих списков
    function setupDropdown(triggerId, dropdownId, showText = 'Показать коллекцию', hideText = 'Скрыть коллекцию') {
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
                labelText.textContent = hideText;
                labelIcon.classList.remove('fa-chevron-down');
                labelIcon.classList.add('fa-chevron-up');
                
                setTimeout(() => {
                    dropdown.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
                labelText.textContent = showText;
                labelIcon.classList.remove('fa-chevron-up');
                labelIcon.classList.add('fa-chevron-down');
            }
        });

        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target) && isOpen) {
                isOpen = false;
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
                labelText.textContent = showText;
                labelIcon.classList.remove('fa-chevron-up');
                labelIcon.classList.add('fa-chevron-down');
            }
        });
    }

    // ===== 3. МАРШРУТИЗАТОР СТРАНИЦ (Определяем, что отрисовывать) =====
    const mainContent = document.getElementById('mainContent');
    const path = window.location.pathname;

    if (mainContent) {
        // Страница мини-подарков
        if (path.includes('mini_gifts.html')) {
            const miniGiftsGrid = document.getElementById('miniGiftsGrid');
            if (miniGiftsGrid) {
                const miniGifts = productsData.mini_gifts || [];
                miniGiftsGrid.innerHTML = [...miniGifts].sort((a, b) => a.id - b.id).map(createMiniGiftCard).join('');
                
                // Обработчики копирования
                document.querySelectorAll('.copy-article-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const article = button.getAttribute('data-article');
                        navigator.clipboard.writeText(`Артикул: ${article}`).then(() => {
                            button.innerHTML = '<span>Скопировано! <i class="fas fa-check"></i></span>';
                            button.classList.add('copied');
                            setTimeout(() => {
                                button.innerHTML = '<i class="fas fa-copy"></i> Копировать артикул';
                                button.classList.remove('copied');
                            }, 1500);
                        });
                    });
                });
            }
            highlightMenu('mini_gifts.html');
        } 
        // Главная / Каталог картин (несколько коллекций)
        else if (path.includes('pictures.html') || path === '/' || path.endsWith('/')) {
            let html = '';
            html += createCollectionSection('picturies', productsData.picturies, 'Показать картины');
            html += createCollectionSection('couple', productsData.couple, 'Показать картины');
            html += createCollectionSection('family', productsData.family, 'Показать картины');
            mainContent.innerHTML = html;

            setupDropdown('catalogTrigger', 'catalogDropdown', 'Показать картины', 'Скрыть картины');
            setupDropdown('catalogTrigger2', 'catalogDropdown2', 'Показать картины', 'Скрыть картины');
            setupDropdown('catalogTrigger3', 'catalogDropdown3', 'Показать картины', 'Скрыть картины');
        } 
        // Страница букетов (pip.html)
        else if (path.includes('pip.html')) {
            const config = collectionsConfig.bouquets;
            if (config) {
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
            highlightMenu('pip.html');
        } 
        // Страница боксов (boxes.html)
        else if (path.includes('boxes.html')) {
            const config = collectionsConfig.boxes;
            if (config) {
                mainContent.innerHTML = createCollectionSection('boxes', productsData.boxes, 'Показать боксы');
                setupDropdown(config.triggerId, config.dropdownId, 'Показать боксы', 'Скрыть боксы');
            }
            highlightMenu('boxes.html');
        } 
        // Страница бижутерии (jewelry.html)
        else if (path.includes('jewelry.html')) {
            const config = collectionsConfig.jewelry;
            if (config) {
                mainContent.innerHTML = createCollectionSection('jewelry', productsData.jewelry, 'Показать коллекцию');
                setupDropdown(config.triggerId, config.dropdownId);
            }
            highlightMenu('jewelry.html');
        }
    }

    // Подсветка активного пункта меню
    function highlightMenu(href) {
        const currentLink = document.querySelector(`a[href="${href}"]`);
        if (currentLink) currentLink.classList.add('active');
    }
});