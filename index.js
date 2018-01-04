const render = (canvas, image, x, y, drawImage) => {
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    canvas.style.width = image.width + 'px';
    canvas.style.height = image.height + 'px';

    if(drawImage) {
        ctx.drawImage(image, 0, 0);
    } else {
        ctx.clearRect(0, 0, image.width, image.height);
    }

    for(let i = 0; i < x; i++) {
        ctx.beginPath();
        ctx.moveTo(image.width * (i + 1) / (x + 1), 0);
        ctx.lineTo(image.width * (i + 1) / (x + 1), image.height);
        ctx.stroke();
    }

    for(let i = 0; i < y; i++) {
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
    const x = Number(xInput.value);
    const y = Number(yInput.value);

    document.getElementById('xValue').innerHTML = String(x);
    document.getElementById('yValue').innerHTML = String(y);

    if (currentImage) {
        const canvas = document.getElementById('canvas');
        const line = document.getElementById('line');
        line.style.display = 'block';
        render(canvas, currentImage, x, y, true);
        render(line, currentImage, x, y, false);
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
    if(dt.items) {
        for(let i = 0; i < dt.items.length; i++) {
            dt.items.remove(i);
        }
    } else {
        ev.dataTransfer.clearData();
    }
};

const handleDraggedFile = event => {
    const file = event.dataTransfer.files[0];

    const fileReader = new FileReader();

    fileReader.onload = function(event) {
        const image = new Image();
        image.src = fileReader.result;
        image.onload = function() {
            currentImage = image;
            updateCanvas();
        };
    };

    fileReader.readAsDataURL(file);
    return false;
};

const init = () => {
    const canvas = document.getElementById('canvas');

    canvas.ondragend = dragend;
    canvas.ondragover = dragover;
    canvas.ondrop = handleDraggedFile;

    updateCanvas();
}