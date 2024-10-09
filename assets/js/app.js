const $ = document

//selectors
const colorContainer = $.querySelector('#color-container');
const addColorBtn = $.querySelector('#add-color');
const directionsBtn = $.querySelectorAll('.direction_buttons button');
const textArea = $.querySelector('#code');
const copyBtn = $.querySelector('#copy');
const alertCopyCode = $.querySelector('.copy-code-alert');
const gradientPreview = $.querySelector('.gradient-preview');

//function to set direction and manage active class
let currentDirection = 'to bottom';
const setDirection = (direction, directionElem) => {
    const button = directionElem.closest('button');
    if (!button.classList.contains('active')) {
        directionsBtn.forEach(item => item.classList.remove('active'));
        button.classList.add('active');
    }
    currentDirection = direction;
};

// Function to generate CSS gradient code
let cssCode;
const generateCode = () => {
    const colors = [...colorContainer.querySelectorAll('input[type="color"]')].map(input => input.value);
    cssCode = `background: linear-gradient(${currentDirection},${colors.join(',')})`;
    textArea.value = cssCode;
    document.body.style.cssText = cssCode;
    gradientPreview.style.cssText = cssCode;
    copyBtn.style.cssText = cssCode;
};

//function to copy css code
const copyCssCode = () => {
    navigator.clipboard.writeText(textArea.value);
    alertCopyCode.classList.remove('d-none');
    setTimeout(() => {
        alertCopyCode.classList.add('d-none');
    }, 3000);
};

// Add event listeners to direction buttons
directionsBtn.forEach(directionsItem => {
    directionsItem.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        const direction = button.dataset.direction;
        setDirection(direction, button);
        generateCode();
    });
});

// Add color remove functionality
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

// Add event listener to add color button
addColorBtn.addEventListener('click', () => {
    const newColorItem = $.createElement('div');
    newColorItem.classList.add('color-item');
    newColorItem.innerHTML = `<input type="color" value="#000"/>
    <button class="remove-color">حذف</button>`;
    colorContainer.appendChild(newColorItem);
    handlerRemoveColor(newColorItem.querySelector('.remove-color'));
    newColorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
    generateCode();
});

// Initializing remove color functionality for existing colors
colorContainer.querySelectorAll('.color-item').forEach(colorItem => {
    handlerRemoveColor(colorItem.querySelector('.remove-color'));
    colorItem.querySelector('input[type="color"]').addEventListener('input', generateCode);
});

// Generate the initial gradient
copyBtn.addEventListener('click', copyCssCode);
generateCode();
