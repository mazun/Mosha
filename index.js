const render = (canvas, image, x, y, size, drawImage) => {
    const ctx = canvas.getContext('2d');
    const width = image.width * (size / 100.0);
    const height = image.height * (size / 100.0);

    canvas.width = image.width;
    canvas.height = image.height;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.lineWidth = 1 * (100.0 / size);

    if (drawImage) {
        ctx.drawImage(image, 0, 0);
    } else {
        ctx.clearRect(0, 0, image.width, image.height);
    }

    for (let i = 0; i < x; i++) {
        ctx.beginPath();
        ctx.moveTo(image.width * (i + 1) / (x + 1), 0);
        ctx.lineTo(image.width * (i + 1) / (x + 1), image.height);
        ctx.stroke();
    }

    for (let i = 0; i < y; i++) {
        ctx.beginPath();
        ctx.moveTo(0, image.height * (i + 1) / (y + 1));
        ctx.lineTo(image.width, image.height * (i + 1) / (y + 1));
        ctx.stroke();
    }
}

let currentImage;

const updateCanvas = () => {
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');
    const sizeInput = document.getElementById('size');
    const x = Number(xInput.value);
    const y = Number(yInput.value);
    const size = Number(sizeInput.value);

    document.getElementById('xValue').innerHTML = String(x);
    document.getElementById('yValue').innerHTML = String(y);
    document.getElementById('sizeValue').innerHTML = String(size);

    if (currentImage) {
        const canvas = document.getElementById('canvas');
        const line = document.getElementById('line');
        line.style.display = 'block';
        render(canvas, currentImage, x, y, size, true);
        render(line, currentImage, x, y, size, false);
    }
};

const dragover = event => {
    console.log(event.dataTransfer.files.length);
    event.preventDefault();
    event.stopPropagation();
    return false;
};

const dragend = event => {
    const dt = event.dataTransfer;
    if (dt.items) {
        for (let i = 0; i < dt.items.length; i++) {
            dt.items.remove(i);
        }
    } else {
        ev.dataTransfer.clearData();
    }
};

const handleDraggedFile = event => {
    const file = event.dataTransfer.files[0];
    handleFile(file);
};

const handleFile = url => {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
        const image = new Image();
        image.src = fileReader.result;
        image.onload = function () {
            currentImage = image;
            updateCanvas();
        };
    };

    fileReader.readAsDataURL(url);
    return false;
}

const handlePaste = pasteEvent => {
    const item = pasteEvent.clipboardData.items[0];

    if (item.type.indexOf("image") === 0) {
        handleFile(item.getAsFile());
    }
}

const init = () => {
    const canvas = document.getElementById('canvas');

    canvas.ondragend = dragend;
    canvas.ondragover = dragover;
    canvas.ondrop = handleDraggedFile;
    document.onpaste = handlePaste;

    updateCanvas();
}