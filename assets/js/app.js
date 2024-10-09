const $ = document

// انتخاب عناصر DOM مورد نیاز
const colorContainer = $.querySelector('#color-container');
const addColorBtn = $.querySelector('#add-color');
const directionsBtn = $.querySelectorAll('.direction_buttons button');
const textArea = $.querySelector('#code');
const copyBtn = $.querySelector('#copy');
const alertCopyCode = $.querySelector('.copy-code-alert');
const gradientPreview = $.querySelector('.gradient-preview');

// متغیر برای نگهداری جهت فعلی گرادیانت و شمارش رنگ‌ها
let currentDirection = 'to bottom';
let colorCounter = colorContainer.children.length; // شمارش تعداد رنگ‌های موجود

// (active) برای دکمه‌هاتنظیم جهت گرادیانت و مدیریت کلاس فعال 
const setDirection = (direction, directionElem) => {
    const button = directionElem.closest('button');
    if (!button.classList.contains('active')) {
        directionsBtn.forEach(item => item.classList.remove('active'));
        button.classList.add('active');
    }
    currentDirection = direction;
};

//  برای گرادیانت بر اساس رنگ‌ها و جهت فعلی  CSS  تولید کد
let cssCode;
const generateCode = () => {
    const colors = [...colorContainer.querySelectorAll('input[type="color"]')].map(input => input.value);
    cssCode = `background: linear-gradient(${currentDirection},${colors.join(',')})`;
    textArea.value = cssCode;
    document.body.style.cssText = cssCode;
    gradientPreview.style.cssText = cssCode;
    copyBtn.style.cssText = cssCode;
};

//  CSS کپی کردن کد
const copyCssCode = () => {
    navigator.clipboard.writeText(textArea.value);
    alertCopyCode.classList.remove('d-none');
    setTimeout(() => {
        alertCopyCode.classList.add('d-none');
    }, 3000);
};

// افزودن رویداد کلیک برای دکمه‌های تغییر جهت گرادیانت
directionsBtn.forEach(directionsItem => {
    directionsItem.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        const direction = button.dataset.direction;
        setDirection(direction, button);
        generateCode();
    });
});

// افزودن قابلیت حذف رنگ از لیست رنگ‌ها
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

// افزودن رویداد کلیک برای دکمه افزودن رنگ جدید
addColorBtn.addEventListener('click', () => {
    colorCounter++; // افزایش شمارنده رنگ‌ها
    const newColorItem = $.createElement('div');
    newColorItem.classList.add('color-item');
    newColorItem.innerHTML = `
    <input type="color" value="#000"/>
    <span>انتخاب رنگ ${colorCounter}</span> <!-- نمایش شماره رنگ -->
    <button class="remove-color">حذف</button>`;
    colorContainer.appendChild(newColorItem);
    handlerRemoveColor(newColorItem.querySelector('.remove-color'));
    newColorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
    generateCode();
});

// افزودن قابلیت حذف برای رنگ‌های موجود
colorContainer.querySelectorAll('.color-item').forEach(colorItem => {
    handlerRemoveColor(colorItem.querySelector('.remove-color'));
    colorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
});

// تولید اولیه گرادیانت
copyBtn.addEventListener('click', copyCssCode);
generateCode();
