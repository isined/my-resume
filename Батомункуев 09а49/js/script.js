// ====================================================
// 1. АКТУАЛЬНЫЙ ГОД В ПОДВАЛЕ
// ====================================================
const yearEl = document.querySelector('#year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}


// ====================================================
// 2. ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ ТЕМЫ И РЕЖИМ СЛАБОВИДЯЩИХ
// ====================================================
const themeBtn = document.querySelector('#theme-toggle');
const a11yBtn = document.querySelector('#accessibility-toggle');

// Проверка сохранённого режима для слабовидящих при загрузке страницы
if (a11yBtn) {
    if (localStorage.getItem('accessibility') === 'enabled') {
        document.body.classList.add('accessibility-mode');
        a11yBtn.textContent = '👁️ Обычная версия';
        // Принудительно отключаем тёмную тему, чтобы стили не конфликтовали
        document.documentElement.classList.remove('dark'); 
    }

    a11yBtn.addEventListener('click', () => {
        document.body.classList.toggle('accessibility-mode');
        const isActive = document.body.classList.contains('accessibility-mode');
        
        if (isActive) {
            a11yBtn.textContent = '👁️ Обычная версия';
            localStorage.setItem('accessibility', 'enabled');
            // Если включили спецрежим — сбрасываем обычную тёмную тему
            document.documentElement.classList.remove('dark');
        } else {
            a11yBtn.textContent = '👁️ Версия для слабовидящих';
            localStorage.setItem('accessibility', 'disabled');
            // Возвращаем исходную луну на кнопку темы
            if (themeBtn) themeBtn.textContent = '🌙';
        }
    });
}

// Логика работы кнопки смены темы
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        // Если активирован режим слабовидящих, обычную тему переключать нельзя
        if (document.body.classList.contains('accessibility-mode')) return;

        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    });
}


// ====================================================
// 3. ОТПРАВКА ФОРМЫ БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
// ====================================================
const form = document.querySelector('form');
const statusMsg = document.querySelector('#form-status');

if (form && statusMsg) {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // отменяем перезагрузку

        const name = document.querySelector('#name').value.trim();

        statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
        statusMsg.classList.add('visible');

        form.reset(); // очищаем поля
    });
}


// ====================================================
// 4. КНОПКА «НАВЕРХ» ПОЯВЛЯЕТСЯ ПРИ ПРОКРУТКЕ
// ====================================================
const upBtn = document.querySelector('#to-top');

if (upBtn) {
    window.addEventListener('scroll', () => {
        upBtn.classList.toggle('visible', window.scrollY > 400);
    });

    upBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ====================================================
// 5. СМЕНА КАРТИНКИ В КНОПКЕ ПРИ КЛИКЕ
// ====================================================
const toggleBtn = document.querySelector('#avatar-toggle-btn');
const toggleIcon = document.querySelector('#toggle-icon');

if (toggleBtn && toggleIcon) {
    const img1 = './img/wojak_PNG109609.png';
    const img2 = './img/wojak_PNG109616.png';

    toggleBtn.addEventListener('click', () => {
        if (toggleIcon.getAttribute('src') === img1) {
            toggleIcon.setAttribute('src', img2);
        } else {
            toggleIcon.setAttribute('src', img1);
        }
    });
}
// ====================================================
// 7. ОЗВУЧКА ТЕКСТА ДЛЯ СЛЕПЫХ (TEXT-TO-SPEECH)
// ====================================================
const ttsBtn = document.querySelector('#tts-toggle');
let isSpeaking = false;

if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
        // Если звук уже идет — выключаем его
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            ttsBtn.textContent = '🔊 Озвучить текст';
            isSpeaking = false;
            return;
        }

        // Собираем текст из основных текстовых блоков резюме
        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        // Берем текстовое содержимое, очищая от лишних пробелов
        const textToRead = mainContent.innerText;

        // Создаем объект озвучки
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'ru-RU'; // Устанавливаем русский язык
        utterance.rate = 1.0;     // Скорость чтения (1.0 — нормальная)

        // Меняем состояние кнопки при старте и завершении
        utterance.onstart = () => {
            isSpeaking = true;
            ttsBtn.textContent = '🛑 Остановить озвучку';
        };

        utterance.onend = () => {
            isSpeaking = false;
            ttsBtn.textContent = '🔊 Озвучить текст';
        };

        utterance.onerror = () => {
            isSpeaking = false;
            ttsBtn.textContent = '🔊 Озвучить текст';
        };

        // Запускаем синтез речи
        window.speechSynthesis.speak(utterance);
    });
}

// Принудительно глушим звук, если пользователь закрывает или обновляет вкладку
window.addEventListener('beforeunload', () => {
    window.speechSynthesis.cancel();
});
