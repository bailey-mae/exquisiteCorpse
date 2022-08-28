import {useOnDraw} from './Hooks';
import {useRef} from "react";
import {SaveImage, ClearCanvas} from "../Utils/UploadImageToS3";


const Canvas = ({width,height}) => {
    const {
        setCanvasRef,
        onCanvasMouseDown
    } = useOnDraw(onDraw);

    function onDraw(ctx, point, prevPoint) {
        draw(prevPoint, point, ctx, '#000000', 5);
    }


    function draw(
        start,
        end,
        ctx,
        color,
        width
    ) {
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        ctx.fill();

    }

    return(
        <div>
            <canvas
                id="canvas"
                width={width}
                height={height}
                onMouseDown={onCanvasMouseDown}
                ref={setCanvasRef}
            />
            <div className="buttonContainer">
                <button className='submitButton save' onClick={SaveImage}> Submit your Piece </button>
                <button className='clearButton' onClick={ClearCanvas}>Clear your Canvas</button>
            </div>
        </div>
    );
}

export default Canvas;
