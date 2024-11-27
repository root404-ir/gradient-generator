const $ = document;

// انتخاب عناصر DOM
const colorContainer = $.querySelector('#color-container');
const addColorBtn = $.querySelector('#add-color');
const directionsBtn = $.querySelectorAll('.direction_buttons button');
const textArea = $.querySelector('#code');
const copyBtn = $.querySelector('#copy');
const alertCopyCode = $.querySelector('.copy-code-alert');
const gradientPreview = $.querySelector('.gradient-preview');
const radialMode = $.querySelector('#radial-mode');
const gradientType = $.querySelector('#gradient-type');
const angleInput = $.querySelector('#angle');
const saveSettingsBtn = $.querySelector('#save-settings');
const loadSettingsBtn = $.querySelector('#load-settings');
const resetSettingsBtn = $.querySelector('#reset-settings');
const downloadCssBtn = $.querySelector('#download-css');
const downloadImageBtn = $.querySelector('#download-image');

// متغیرهای اصلی
let currentDirection = 'to bottom';
let colorCounter = colorContainer.children.length;
let cssCode;

// تولید کد گرادیانت
const generateCode = () => {
    const colors = [...colorContainer.querySelectorAll('input[type="color"]')].map(input => input.value);

    if (gradientType.value === 'linear') {
        cssCode = `background: linear-gradient(${angleInput.value}deg, ${colors.join(',')})`;
    } else if (gradientType.value === 'radial') {
        cssCode = `background: radial-gradient(${colors.join(',')})`;
    }

    textArea.value = cssCode;
    gradientPreview.style.cssText = cssCode;
    document.body.style.cssText = cssCode;
};

// افزودن رنگ جدید
const addColor = (color = '#000', index) => {
    const newColorItem = $.createElement('div');
    newColorItem.classList.add('color-item');
    newColorItem.innerHTML = `
        <input type="color" value="${color}"/>
        <span>انتخاب رنگ ${index}</span>
        <button class="remove-color">حذف</button>`;
    colorContainer.appendChild(newColorItem);
    handlerRemoveColor(newColorItem.querySelector('.remove-color'));
    newColorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
};

// مدیریت حذف رنگ
const handlerRemoveColor = (button) => {
    button.addEventListener('click', () => {
        if (colorContainer.children.length > 2) {
            button.closest('.color-item').remove();
            generateCode();
        } else {
            alert('حداقل دو رنگ باید باقی بماند!');
        }
    });
};

// کپی کردن CSS
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(textArea.value);
    alertCopyCode.classList.remove('d-none');
    setTimeout(() => alertCopyCode.classList.add('d-none'), 3000);
});

// تغییر زاویه
angleInput.addEventListener('input', generateCode);

// تغییر نوع گرادیانت
gradientType.addEventListener('change', generateCode);

// مدیریت دکمه‌های جهت
directionsBtn.forEach(directionBtn => {
    directionBtn.addEventListener('click', (event) => {
        directionsBtn.forEach(btn => btn.classList.remove('active'));
        const button = event.target.closest('button');
        button.classList.add('active');
        currentDirection = button.dataset.direction;
        generateCode();
    });
});

// ذخیره تنظیمات در localStorage
saveSettingsBtn.addEventListener('click', () => {
    const colors = [...colorContainer.querySelectorAll('input[type="color"]')].map(input => input.value);
    const settings = {
        type: gradientType.value,
        angle: angleInput.value,
        colors
    };
    localStorage.setItem('gradientSettings', JSON.stringify(settings));
    alert('تنظیمات ذخیره شد!');
});

// بارگذاری تنظیمات از localStorage
loadSettingsBtn.addEventListener('click', () => {
    const savedSettings = JSON.parse(localStorage.getItem('gradientSettings'));
    if (savedSettings) {
        gradientType.value = savedSettings.type;
        angleInput.value = savedSettings.angle;
        colorContainer.innerHTML = '';
        savedSettings.colors.forEach((color, index) => addColor(color, index + 1));
        generateCode();
    } else {
        alert('تنظیماتی ذخیره نشده است!');
    }
});

// بازنشانی تنظیمات
resetSettingsBtn.addEventListener('click', () => {
    colorContainer.innerHTML = '';
    addColor('#1488cc', 1);
    addColor('#2b32b2', 2);
    gradientType.value = 'linear';
    angleInput.value = 90;
    generateCode();
});

// دانلود CSS
downloadCssBtn.addEventListener('click', () => {
    const blob = new Blob([textArea.value], { type: 'text/css' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'gradient.css';
    link.click();
});

// دانلود تصویر
downloadImageBtn.addEventListener('click', () => {
    html2canvas(gradientPreview).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'gradient.png';
        link.click();
    });
});

// افزودن رنگ‌های اولیه
addColorBtn.addEventListener('click', () => addColor('#000', ++colorCounter));

// افزودن قابلیت حذف برای رنگ‌های موجود
colorContainer.querySelectorAll('.color-item').forEach((colorItem, index) => {
    handlerRemoveColor(colorItem.querySelector('.remove-color'));
    colorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
});

// تولید اولیه گرادیانت
generateCode();
