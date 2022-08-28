

// TODO - pass in as an environment variable
const serverUrl = 'http://localhost:3000'

let segmentPromise;

const realizeSegment = async (priorDrawingId, priorPlacement) => {
    let drawing = await realizeDrawing(priorDrawingId, priorPlacement);

    let placement;

    if (!drawing.hasOwnProperty('top') && priorPlacement !== 'top') {
        placement = 'top';
    } else if (!drawing.hasOwnProperty('middle') && priorPlacement !== 'middle') {
        placement = 'middle';
    } else if (!drawing.hasOwnProperty('bottom') && priorPlacement !== 'bottom') {
        placement = 'bottom';
    } else {
        throw Error('drawing has all segments');
    }

    return {
        placement: placement,
        drawing: drawing
    }
}

const realizeDrawing = async (priorDrawingId, priorPlacement) => {
    const url = serverUrl + '/drawings';

    const getDrawingsRequest = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors"
    }

    const getDrawingsResponse = await fetch(url, getDrawingsRequest);
    const drawings = await getDrawingsResponse.json();

    // Find a drawing that's missing a segment other than the segment we just created
    const drawing = drawings.find(drawing =>
        (!drawing.hasOwnProperty('top') && (drawing.id !== priorDrawingId || priorPlacement !== 'top')) ||
        (!drawing.hasOwnProperty('middle') && (drawing.id !== priorDrawingId || priorPlacement !== 'middle')) ||
        (!drawing.hasOwnProperty('bottom') && (drawing.id !== priorDrawingId || priorPlacement !== 'bottom')));

    if (drawing) {
        return drawing;
    }

    // No drawing found, create a drawing
    const body = {
        createdBy: "Dawn Drawing"
    }

    const createDrawingRequest = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors"
    }

    const response = await fetch(url, createDrawingRequest);
    return await response.json();
}

const SaveImage = async (ev) => {
    document.getElementsByClassName('save')[0].setAttribute('disabled', 'true')

    let canvas = document.getElementById("canvas")
    let data = canvas.toDataURL("image/jpeg")
    const blobData = dataURItoBlob(data);
    await uploadFile(blobData)
}

function dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

const ClearCanvas = async () => {
    let canvas = document.getElementById("canvas")

    if(canvas) {
        let ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
}

const reset = (priorDrawingId, priorPlacement) => {
    segmentPromise = realizeSegment(priorDrawingId, priorPlacement);

    segmentPromise.then((segment) => {
        document.getElementById('currentSegment').innerHTML = 'You are creating the '  + segment.placement + ' of an Exquisite Corpse';
    });
    ClearCanvas();
}

const uploadFile = async (file) => {
    let segment = await segmentPromise;

    if (!segment)
        throw Error('Segment not selected')

    const body = {
        contentType: "image/jpeg",
        ext: "jpg",
        createdBy: "Sam Segment"
    }

    const requestObject = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors"
    }

    const url = serverUrl + '/drawings/' + segment.drawing.id + '/segments/' + segment.placement;

    fetch(url, requestObject)
        .then(res => res.json())
        .then(data => {
            fetch(data.preSignedUrl, {
                method: 'PUT',
                body: file
            }).then((res) => {
                console.log('Upload succeeded!')
                reset(segment.drawing.id,segment.placement);
                document.getElementsByClassName('save')[0].removeAttribute('disabled')
            }).catch(err => {
                alert('Error uploading segment')
                console.log(err)
            })
        })
}

reset(0,0);

export {SaveImage, ClearCanvas};
