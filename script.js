// ========== ПЕРЕМЕННЫЕ ==========
let coins = parseFloat(localStorage.getItem('coins')) || 0;
let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
let energy = parseFloat(localStorage.getItem('energy')) || 500;
let maxEnergy = parseFloat(localStorage.getItem('maxEnergy')) || 500;
let level = parseInt(localStorage.getItem('level')) || 1;
let passiveIncome = parseFloat(localStorage.getItem('passiveIncome')) || 0;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let totalEarned = parseFloat(localStorage.getItem('totalEarned')) || 0;
let prestige = parseInt(localStorage.getItem('prestige')) || 0;
let comboCount = 0;
let maxCombo = 0;
let taxTimer = 60;
let offshore = parseInt(localStorage.getItem('offshore')) || 0;
let investments = parseInt(localStorage.getItem('investments')) || 0;
let autoClicker = parseInt(localStorage.getItem('autoClicker')) || 0;
let regenSpeed = parseFloat(localStorage.getItem('regenSpeed')) || 1;
let playTime = parseInt(localStorage.getItem('playTime')) || 0;
let luckActive = false;
let luckTimer = null;

// Достижения
let achievements = {
    clicks100: false, clicks1000: false, clicks10000: false,
    clicks100000: false, clicks1m: false,
    level10: false, level50: false, level100: false,
    prestige1: false, prestige5: false
};

// Бизнесы
const businesses = [
    { level: 0, cost: 500, income: 10, name: 'Ларёк' },
    { level: 0, cost: 2000, income: 50, name: 'Магазин' },
    { level: 0, cost: 10000, income: 300, name: 'Супермаркет' },
    { level: 0, cost: 50000, income: 1500, name: 'Завод' },
    { level: 0, cost: 200000, income: 8000, name: 'Логистика' },
    { level: 0, cost: 1000000, income: 50000, name: 'Стройка' },
    { level: 0, cost: 5000000, income: 300000, name: 'Нефть' },
    { level: 0, cost: 25000000, income: 2000000, name: 'Космос' },
    { level: 0, cost: 100000000, income: 15000000, name: 'Банк' },
    { level: 0, cost: 500000000, income: 100000000, name: 'Корпорация' }
];

// Загружаем бизнесы
for (let i = 0; i < businesses.length; i++) {
    businesses[i].level = parseInt(localStorage.getItem('business_' + i)) || 0;
}

// Загружаем достижения
for (let key in achievements) {
    achievements[key] = localStorage.getItem('ach_' + key) === 'true';
}

// ========== ЗВЁЗДНЫЙ ФОН ==========
function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = (1 + Math.random() * 3) + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
        star.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(star);
    }
}
createStars();

// ========== ЭЛЕМЕНТЫ UI ==========
const coinCounter = document.getElementById('coinCounter');
const energyCounter = document.getElementById('energyCounter');
const energyFill = document.getElementById('energyFill');
const tapPowerDisplay = document.getElementById('tapPowerDisplay');
const incomeDisplay = document.getElementById('incomeDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const prestigeDisplay = document.getElementById('prestigeDisplay');
const comboDisplay = document.getElementById('comboDisplay');
const comboCountEl = document.getElementById('comboCount');
const maxEnergyDisplay = document.getElementById('maxEnergyDisplay');
const regenSpeedDisplay = document.getElementById('regenSpeedDisplay');
const totalEarnedEl = document.getElementById('totalEarned');
const totalClicksDisplay = document.getElementById('totalClicksDisplay');
const businessCountEl = document.getElementById('businessCount');
const prestigeStatEl = document.getElementById('prestigeStat');
const achievementCountEl = document.getElementById('achievementCount');
const playTimeEl = document.getElementById('playTime');
const taxTimerEl = document.getElementById('taxTimer');
const coinImage = document.getElementById('coinImage');

// ========== ВКЛАДКИ ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + tabName).classList.add('active');
        if (tabName === 'stats') updateStats();
    });
});

// ========== ОБНОВЛЕНИЕ UI ==========
function updateUI() {
    coinCounter.textContent = Math.floor(coins);
    energyCounter.textContent = `${Math.floor(energy)}/${maxEnergy}`;
    energyFill.style.width = (energy / maxEnergy * 100) + '%';
    tapPowerDisplay.textContent = clickPower;
    incomeDisplay.textContent = Math.floor(passiveIncome);
    levelDisplay.textContent = level;
    prestigeDisplay.textContent = prestige;
    maxEnergyDisplay.textContent = maxEnergy;
    regenSpeedDisplay.textContent = regenSpeed + '/сек';
    comboCountEl.textContent = comboCount;

    // Цены
    const energyCost = Math.floor(50 + level * 5);
    document.getElementById('energyCostDisplay').textContent = energyCost + ' 💵';
    const maxEnergyCost = Math.floor(100 + (maxEnergy - 500) * 0.5);
    document.getElementById('maxEnergyCostDisplay').textContent = maxEnergyCost + ' 💵';
    const regenCost = Math.floor(200 + regenSpeed * 100);
    document.getElementById('regenCostDisplay').textContent = regenCost + ' 💵';
    const autoPrice = 5000 + autoClicker * 5000;
    document.getElementById('autoPrice').textContent = autoPrice + ' 💵';
    const offshorePrice = 5000 + offshore * 10000;
    document.getElementById('offshorePrice').textContent = offshorePrice + ' 💵';
    const investmentPrice = 10000 + investments * 15000;
    document.getElementById('investmentPrice').textContent = investmentPrice + ' 💵';

    // Бизнесы
    for (let i = 0; i < businesses.length; i++) {
        const costEl = document.getElementById('businessCost' + i);
        if (costEl) {
            const cost = Math.floor(businesses[i].cost * (1 + businesses[i].level * 0.5));
            costEl.textContent = cost + ' 💵';
        }
    }
}

// ========== ТАП ==========
function tap() {
    if (energy <= 0) {
        showFloatingText('❌ Нет энергии!');
        return;
    }
    energy--;
    let earned = clickPower;
    if (luckActive) earned *= 2;
    
    // Комбо
    comboCount++;
    if (comboCount > maxCombo) maxCombo = comboCount;
    if (comboCount > 5) {
        earned *= (1 + comboCount * 0.05);
        comboDisplay.textContent = '🔥 x' + (1 + comboCount * 0.05).toFixed(1);
        comboDisplay.style.animation = 'none';
        setTimeout(() => comboDisplay.style.animation = 'comboPulse 0.5s ease', 10);
    }
    
    coins += earned;
    totalClicks++;
    totalEarned += earned;
    
    if (navigator.vibrate) navigator.vibrate(10);
    showFloatingText('+' + Math.floor(earned) + '💵');
    
    checkLevelUp();
    checkAchievements();
    saveGame();
    updateUI();
}

// ====== ========= ПОВЫШЕНИЕ УРОВНЯ ==========
function checkLevelUp() {
    const needed = level * 100;
    if (totalClicks >= needed) {
        level++;
        totalClicks = 0;
        clickPower += 2;
        showFloatingText('🎉 УРОВЕНЬ ' + level + '!');
        coins += level * 50;
        updateUI();
    }
}

// ========== ПАРЯЩИЙ ТЕКСТ ==========
function showFloatingText(text) {
    const container = document.getElementById('floatingTexts');
    const el = document.createElement('div');
    el.className = 'float-text';
    el.textContent = text;
    el.style.left = (25 + Math.random() * 50) + '%';
    el.style.top = (25 + Math.random() * 40) + '%';
    
    if (text.includes('🎉')) el.style.color = '#ff6bff';
    else if (text.includes('✅')) el.style.color = '#6fdf8a';
    else if (text.includes('⚡')) el.style.color = '#7cf9ff';
    else if (text.includes('❌')) el.style.color = '#ff6b6b';
    else if (text.includes('🔋')) el.style.color = '#7cf9ff';
    else if (text.includes('📈')) el.style.color = '#c084fc';
    else if (text.includes('💵')) el.style.color = '#6fdf8a';
    else el.style.color = '#ffd700';
    
    container.appendChild(el);
    setTimeout(() => el.remove(), 900);
}

// ========== МАГАЗИН (УЛУЧШЕНИЯ) ==========
function buyUpgrade(cost, power) {
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    clickPower += power;
    saveGame();
    updateUI();
    showFloatingText('✅ +' + power + ' силы!');
}

// ========== АВТО-КЛИКЕР ==========
function buyAutoClicker() {
    const cost = 5000 + autoClicker * 5000;
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    autoClicker++;
    saveGame();
    updateUI();
    showFloatingText('🤖 Авто-кликер куплен!');
}

// ========== БИЗНЕС ==========
function buyBusiness(index) {
    const biz = businesses[index];
    const cost = Math.floor(biz.cost * (1 + biz.level * 0.5));
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    biz.level++;
    passiveIncome += biz.income;
    saveGame();
    updateUI();
    showFloatingText('🏢 ' + biz.name + ' куплен!');
}

// ========== ЭНЕРГИЯ ==========
function buyEnergy() {
    const cost = Math.floor(50 + level * 5);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    if (energy >= maxEnergy) {
        showFloatingText('⚡ Энергия полная!');
        return;
    }
    coins -= cost;
    energy = Math.min(energy + Math.floor(maxEnergy * 0.5), maxEnergy);
    saveGame();
    updateUI();
    showFloatingText('🔋 +' + Math.floor(maxEnergy * 0.5) + ' энергии!');
}

function buyMaxEnergy() {
    const cost = Math.floor(100 + (maxEnergy - 500) * 0.5);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    maxEnergy += 50;
    energy = Math.min(energy + 25, maxEnergy);
    saveGame();
    updateUI();
    showFloatingText('📈 Максимум +50!');
}

function buyRegenSpeed() {
    const cost = Math.floor(200 + regenSpeed * 100);
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    regenSpeed += 0.5;
    saveGame();
    updateUI();
    showFloatingText('⚡ Регенерация +0.5/сек!');
}

// ========== БОНУСЫ ==========
function buyLuck() {
    if (coins < 300) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    if (luckActive) {
        showFloatingText('⏳ Удача уже активна!');
        return;
    }
    coins -= 300;
    luckActive = true;
    showFloatingText('🍀 УДАЧА x2 НА 30 СЕК!');
    updateUI();
    
    if (luckTimer) clearTimeout(luckTimer);
    luckTimer = setTimeout(() => {
        luckActive = false;
        showFloatingText('⏰ Удача закончилась');
    }, 30000);
    saveGame();
}

function playLottery() {
    if (coins < 100) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= 100;
    const multiplier = Math.floor(Math.random() * 9) + 2;
    const win = 100 * multiplier;
    coins += win;
    showFloatingText('🎰 x' + multiplier + '! +' + win + '💵');
    saveGame();
    updateUI();
}

function buyOffshore() {
    const cost = 5000 + offshore * 10000;
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    offshore++;
    saveGame();
    updateUI();
    showFloatingText('🛡️ Офшор куплен!');
}

function buyInvestment() {
    const cost = 10000 + investments * 15000;
    if (coins < cost) {
        showFloatingText('😅 Не хватает!');
        return;
    }
    coins -= cost;
    investments++;
    saveGame();
    updateUI();
    showFloatingText('💼 Инвестиция +5%!');
}

// ========== ЕЖЕДНЕВНЫЙ БОНУС ==========
let lastBonusDate = localStorage.getItem('lastBonusDate') || '';

function claimDailyBonus() {
    const today = new Date().toDateString();
    if (lastBonusDate === today) {
        showFloatingText('⏳ Бонус уже получен!');
        document.getElementById('bonusTimer').textContent = '⏳ Завтра';
        return;
    }
    const bonus = 100 + level * 20 + prestige * 100;
    coins += bonus;
    lastBonusDate = today;
    localStorage.setItem('lastBonusDate', today);
    showFloatingText('🎁 +' + bonus + '💵 бонус!');
    document.getElementById('bonusTimer').textContent = '✅ Получен!';
    updateUI();
    saveGame();
}

// ========== ЕЖЕНЕДЕЛЬНЫЙ БОНУС ==========
let lastWeeklyDate = localStorage.getItem('lastWeeklyDate') || '';

function claimWeeklyBonus() {
    const today = new Date().toDateString();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (lastWeeklyDate && new Date(lastWeeklyDate) > weekAgo) {
        showFloatingText('⏳ Бонус через ' + Math.ceil((new Date(lastWeeklyDate).getTime() + 7*24*60*60*1000 - Date.now()) / (24*60*60*1000)) + ' дней');
        return;
    }
    const bonus = 1000 + level * 100 + prestige * 500;
    coins += bonus;
    lastWeeklyDate = today;
    localStorage.setItem('lastWeeklyDate', today);
    showFloatingText('🎁 ЕЖЕНЕДЕЛЬНЫЙ +' + bonus + '💵!');
    updateUI();
    saveGame();
}

// ========== ПРЕСТИЖ ==========
function prestige() {
    if (coins < 1000000) {
        showFloatingText('😅 Нужно 1 000 000 💵!');
        return;
    }
    if (prestige > 0 && coins < 1000000 * (prestige + 1)) {
        showFloatingText('😅 Нужно ' + (1000000 * (prestige + 1)) + ' 💵!');
        return;
    }
    coins = 0;
    clickPower = 1 + prestige * 5;
    energy = 500;
    maxEnergy = 500 + prestige * 50;
    passiveIncome = 0;
    level = 1;
    totalClicks = 0;
    businesses.forEach(b => b.level = 0);
    prestige++;
    showFloatingText('🔄 ПРЕСТИЖ ' + prestige + '! +' + (prestige * 5) + ' силы!');
    saveGame();
    updateUI();
}

// ========== СТАТИСТИКА ==========
function updateStats() {
    totalEarnedEl.textContent = Math.floor(totalEarned);
    totalClicksDisplay.textContent = totalClicks;
    let bizCount = 0;
    businesses.forEach(b => bizCount += b.level);
    businessCountEl.textContent = bizCount;
    prestigeStatEl.textContent = prestige;
    
    let achieved = 0;
    for (let key in achievements) {
        if (achievements[key]) achieved++;
    }
    achievementCountEl.textContent = achieved + '/10';
    playTimeEl.textContent = Math.floor(playTime / 60) + ' мин';
    
    // Список достижений
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    const achList = [
        { key: 'clicks100', text: '🏆 100 кликов - +50💵' },
        { key: 'clicks1000', text: '🏆 1000 кликов - +500💵' },
        { key: 'clicks10000', text: '🏆 10 000 кликов - +5000💵' },
        { key: 'clicks100000', text: '🏆 100 000 кликов - +50 000💵' },
        { key: 'clicks1m', text: '🏆 1 000 000 кликов - +500 000💵' },
        { key: 'level10', text: '🏆 Уровень 10 - +1000💵' },
        { key: 'level50', text: '🏆 Уровень 50 - +10 000💵' },
        { key: 'level100', text: '🏆 Уровень 100 - +100 000💵' },
        { key: 'prestige1', text: '🏆 Престиж 1 - +50 000💵' },
        { key: 'prestige5', text: '🏆 Престиж 5 - +1 000 000💵' }
    ];
    achList.forEach(a => {
        const div = document.createElement('div');
        div.className = 'achievement' + (achievements[a.key] ? ' unlocked' : '');
        div.textContent = a.text + (achievements[a.key] ? ' ✅' : ' ❌');
        list.appendChild(div);
    });
}

// ========== ДОСТИЖЕНИЯ ==========
function checkAchievements() {
    let newAch = false;
    if (!achievements.clicks100 && totalClicks >= 100) {
        achievements.clicks100 = true; coins += 50; newAch = true;
    }
    if (!achievements.clicks1000 && totalClicks >= 1000) {
        achievements.clicks1000 = true; coins += 500; newAch = true;
    }
    if (!achievements.clicks10000 && totalClicks >= 10000) {
        achievements.clicks10000 = true; coins += 5000; newAch = true;
    }
    if (!achievements.clicks100000 && totalClicks >= 100000) {
        achievements.clicks100000 = true; coins += 50000; newAch = true;
    }
    if (!achievements.clicks1m && totalClicks >= 1000000) {
        achievements.clicks1m = true; coins += 500000; newAch = true;
    }
    if (!achievements.level10 && level >= 10) {
        achievements.level10 = true; coins += 1000; newAch = true;
    }
    if (!achievements.level50 && level >= 50) {
        achievements.level50 = true; coins += 10000; newAch = true;
    }
    if (!achievements.level100 && level >= 100) {
        achievements.level100 = true; coins += 100000; newAch = true;
    }
    if (!achievements.prestige1 && prestige >= 1) {
        achievements.prestige1 = true; coins += 50000; newAch = true;
    }
    if (!achievements.prestige5 && prestige >= 5) {
        achievements.prestige5 = true; coins += 1000000; newAch = true;
    }
    if (newAch) {
        showFloatingText('🏆 НОВОЕ ДОСТИЖЕНИЕ!');
        updateUI();
        saveGame();
    }
}

// ========== НАЛОГИ ==========
setInterval(() => {
    taxTimer--;
    taxTimerEl.textContent = taxTimer;
    if (taxTimer <= 0) {
        if (offshore === 0) {
            const tax = coins * 0.1;
            coins -= tax;
            showFloatingText('📉 Налог -' + Math.floor(tax) + '💵');
        } else {
            showFloatingText('🛡️ Офшор защитил от налогов!');
        }
        taxTimer = 60;
        saveGame();
        updateUI();
    }
}, 1000);

// ========== ПАССИВНЫЙ ДОХОД ==========
setInterval(() => {
    if (passiveIncome > 0) {
        let income = passiveIncome;
        if (luckActive) income *= 2;
        coins += income;
        totalEarned += income;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== АВТО-КЛИКЕР ==========
setInterval(() => {
    if (autoClicker > 0 && energy > 0) {
        let earned = clickPower * autoClicker;
        if (luckActive) earned *= 2;
        coins += earned;
        totalEarned += earned;
        energy = Math.max(0, energy - autoClicker * 0.5);
        updateUI();
        saveGame();
    }
}, 1000);

// ========== ИНВЕСТИЦИИ ==========
setInterval(() => {
    if (investments > 0) {
        const bonus = totalEarned * 0.05 * investments;
        coins += bonus;
        updateUI();
        saveGame();
    }
}, 30000);

// ========== ВОССТАНОВЛЕНИЕ ЭНЕРГИИ ==========
setInterval(() => {
    if (energy < maxEnergy) {
        energy += regenSpeed * 0.5;
        if (energy > maxEnergy) energy = maxEnergy;
        updateUI();
        saveGame();
    }
}, 1000);

// ========== ВРЕМЯ В ИГРЕ ==========
setInterval(() => {
    playTime++;
    localStorage.setItem('playTime', playTime);
}, 60000);

// ========== СОХРАНЕНИЕ ==========
function saveGame() {
    localStorage.setItem('coins', Math.floor(coins));
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('energy', Math.floor(energy));
    localStorage.setItem('maxEnergy', maxEnergy);
    localStorage.setItem('level', level);
    localStorage.setItem('passiveIncome', passiveIncome);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('totalEarned', totalEarned);
    localStorage.setItem('prestige', prestige);
    localStorage.setItem('offshore', offshore);
    localStorage.setItem('investments', investments);
    localStorage.setItem('autoClicker', autoClicker);
    localStorage.setItem('regenSpeed', regenSpeed);
    localStorage.setItem('playTime', playTime);
    
    for (let i = 0; i < businesses.length; i++) {
        localStorage.setItem('business_' + i, businesses[i].level);
    }
    for (let key in achievements) {
        localStorage.setItem('ach_' + key, achievements