import React, { useRef, useEffect } from 'react';

const CameraWithFilter = () => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const getCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const ctx = canvasRef.current.getContext('2d');
      const draw = () => {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);

        let frame = ctx.getImageData(0, 0, 640, 480);
        let data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
          // Bikin kulit lebih cerah & halus
          data[i] = data[i] + 10;     // R (red)
          data[i + 1] = data[i + 1] + 10; // G (green)
          data[i + 2] = data[i + 2] + 10; // B (blue)
        }

        ctx.putImageData(frame, 0, 0);
        requestAnimationFrame(draw);
      };

      draw();
    };

    getCamera();
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} style={{ display: 'none' }} width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" className="rounded-2xl shadow-md" />
    </div>
  );
};

export default CameraWithFilter;
