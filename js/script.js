const fileinput = document.querySelector(".file-input"),
chooseimabtn = document.querySelector(".choose-img"),
previewimg = document.querySelector(".preview-img img"),
filteroptions = document.querySelectorAll(".filter button"),
rotateoptions = document.querySelectorAll(".rotate button"),
filterslider = document.querySelector(".slider input"),
filtervalue = document.querySelector(".filter-info .value"),
filtername = document.querySelector(".filter-info .name"),
resetfilterbtn = document.querySelector(".reset-filter");
saveimgbtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, fliphorizontal = 1, flipvertical = 1;


const applyfilters = () => {
    previewimg.style.transform = `rotate(${rotate}deg) scale(${fliphorizontal}, ${flipvertical})`;
    previewimg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadimage = () => {
    let file = fileinput.files[0];
    if(!file) return;
    previewimg.src = URL.createObjectURL(file);
    previewimg.addEventListener("load", () => {
        resetfilterbtn.click();
        document.querySelector(".container").classList.remove("disable");
    })
}

filteroptions.forEach(Option => {
    Option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        Option.classList.add("active");
        filtername.innerText = Option.innerText;

        if(Option.id === "brightness"){
            filterslider.max = "200";
            filterslider.value = brightness;
            filtervalue.innerText = `${brightness}%`;
        } else if(Option.id === "saturation") {
            filterslider.max = "200";
            filterslider.value = saturation;
            filtervalue.innerText = `${saturation}%`;
        } else if(Option.id === "inversion") {
            filterslider.max = "100";
            filterslider.value = inversion;
            filtervalue.innerText = `${inversion}%`;
        } else {
            filterslider.max = "100";
            filterslider.value = grayscale;
            filtervalue.innerText = `${grayscale}%`;
        }
    });
});

const updatefilter = () => {
    filtervalue.innerText = `${filterslider.value}%`;
    const selectedfilter = document.querySelector(".filter .active");

    if(selectedfilter.id === "brightness") {
       brightness = filterslider.value;
    }else if(selectedfilter.id === "saturation") {
        saturation = filterslider.value;
     }else if(selectedfilter.id === "inversion") {
        inversion = filterslider.value;
     }else {
        grayscale = filterslider.value;
     }

     applyfilters()
}

rotateoptions.forEach(Option => {
    Option.addEventListener("click", () => {
        if(Option.id === "left"){
            rotate -= 90;
        }else if(Option.id === "right"){
            rotate += 90;
        }else if(Option.id === "horizontal"){
            fliphorizontal = fliphorizontal ===  1 ? -1 : 1;
        }else{
            flipvertical = flipvertical ===  1 ? -1 : 1;
        }
        applyfilters();
    });
});

const resetfilter = () => {
     brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
     rotate = 0; fliphorizontal = 1; flipvertical = 1;
     filteroptions[0].click();
     applyfilters();
}

const saveimg = () => {
     const canvas = document.createElement("canvas");
     const ctx = canvas.getContext("2d");
     canvas.width = previewimg.naturalWidth;
     canvas.height = previewimg.naturalHeight;

     ctx.translate(canvas.width / 2,canvas.height / 2)
     if(rotate !== 0) {
        ctx.rotate(rotate* Math.PI / 180);
     }
     ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
     ctx.scale(fliphorizontal, flipvertical)
     ctx.drawImage(previewimg, -canvas.width / 2,  -canvas.height / 2, canvas.width,  canvas.height);
     
     const link = document.createElement("a");
     link.download = "image.jpg";
     link.href = canvas.toDataURL();
     link.click();
}

fileinput.addEventListener("change", loadimage);
filterslider.addEventListener("input", updatefilter);
resetfilterbtn.addEventListener("click", resetfilter);
saveimgbtn.addEventListener("click", saveimg);
chooseimabtn.addEventListener("click", () => fileinput.click());