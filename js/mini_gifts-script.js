// Импортируем данные
import { productsData } from './products-data.js';

// ===== БУРГЕР-МЕНЮ =====
const burgerIcon = document.getElementById('burgerIcon');
const menuOverlay = document.getElementById('menuOverlay');
const closeBtn = document.getElementById('closeBtn');
const body = document.body;
const miniGiftsGrid = document.getElementById('miniGiftsGrid');

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

// ===== ФУНКЦИИ ДЛЯ КАРТОЧЕК =====

// Функция копирования артикула
function copyArticle(article, button) {
    const text = `Артикул: ${article}`;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span>Скопировано! <i class="fas fa-check"></i></span>';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 1500);
        })
        .catch(err => {
            console.error('Ошибка копирования:', err);
            alert('Не удалось скопировать артикул');
        });
}

// Функция создания карточки мини-подарка
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

// Функция для отображения всех карточек
function renderMiniGifts() {
    if (!miniGiftsGrid) return;
    
    // Берем данные из productsData.mini_gifts
    const miniGifts = productsData.mini_gifts || [];
    
    // Сортируем по цене или ID
    const sortedGifts = [...miniGifts].sort((a, b) => a.id - b.id);
    
    // Создаем HTML всех карточек
    const cardsHTML = sortedGifts.map(createMiniGiftCard).join('');
    miniGiftsGrid.innerHTML = cardsHTML;
    
    // Добавляем обработчики для кнопок копирования
    document.querySelectorAll('.copy-article-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const article = button.getAttribute('data-article');
            copyArticle(article, button);
        });
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Раздел мини-подарков AMIRIZE загружен!');
    
    // Отображаем карточки
    renderMiniGifts();
    
    // Добавляем активный класс к текущей странице
    const currentLink = document.querySelector('a[href="mini_gifts.html"]');
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    // Анимация при наведении на карточки (опционально)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Экспортируем для возможности использования в других модулях
export { renderMiniGifts };