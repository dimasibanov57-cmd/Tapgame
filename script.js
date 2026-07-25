// ========== ИГРОВЫЕ ПЕРЕМЕННЫЕ ==========
let coins = parseInt(localStorage.getItem('coins')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let energy = parseInt(localStorage.getItem('energy')) || 500;
const MAX_ENERGY = 500;

// ========== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ==========
function updateUI() {
    document.getElementById('coinCounter').textContent = coins;
    document.getElementById('energyCounter').textContent = energy;
}

// ========== ГЛАВНАЯ ФУНКЦИЯ ТАПА ==========
function tap() {
    if (energy <= 0) {
        alert('❌ Нет энергии! Восстановите её в магазине.');
        return;
    }

    // Тратим энергию и даём монеты
    energy--;
    coins += clickPower;

    // Вибрация на телефоне (если поддерживается)
    if (navigator.vibrate) navigator.vibrate(10);

    // Анимация "+число" над монеткой
    showFloatingText('+' + clickPower);

    // Сохраняем и обновляем
    saveGame();
    updateUI();
}

// ========== АНИМАЦИЯ ПАРЯЩЕГО ТЕКСТА ==========
function showFloatingText(text) {
    const container = document.getElementById('floatingTexts');
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (40 + Math.random() * 20) + '%';
    el.style.top = (30 + Math.random() * 30) + '%';
    container.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// ========== МАГАЗИН ==========
function buyUpgrade(cost, power) {
    if (coins < cost) {
        alert('😅 Не хватает монет! Нужно: ' + cost);
        return;
    }
    coins -= cost;
    clickPower += power;
    saveGame();
    updateUI();
    alert('✅ Улучшение куплено! Теперь +' + clickPower + ' за тап');
}

function buyEnergy(cost) {
    if (coins < cost) {
        alert('😅 Не хватает монет!');
        return;
    }
    if (energy >= MAX_ENERGY) {
        alert('⚡ Энергия уже полная!');
        return;
    }
    coins -= cost;
    energy = MAX_ENERGY;
    saveGame();
    updateUI();
    alert('🔋 Энергия восстановлена!');
}

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ПО ВРЕМЕНИ ==========
setInterval(() => {
    if (energy < MAX_ENERGY) {
        energy++;
        updateUI();
        saveGame();
    }
}, 2000); // +1 энергии каждые 2 секунды

// ========== АВТОСОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', energy);
}

// ========== ЗАПУСК ==========
updateUI();

// Обработчик клика по картинке
document.getElementById('coinImage').addEventListener('click', tap);

// На случай, если игра свёрнута — сохраняем
document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame();
});