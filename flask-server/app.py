import cv2
import onnxruntime as ort
import numpy as np
from flask import Flask, Response

# 1. Initialize the Flask application
app = Flask(__name__)

# 2. Load the ONNX model and set the execution provider
# This assumes your ONNX model is named 'your_model.onnx' and is in the same directory.
# This will explicitly target the Snapdragon X Elite NPU.
try:
    session = ort.InferenceSession(
        "flask-server/toddler-knife-yolo.onnx",
        providers=['QNNExecutionProvider']
    )
    print("ONNX model loaded successfully on the NPU.")
except Exception as e:
    print(f"Failed to load model on NPU, falling back to CPU. Error: {e}")
    session = ort.InferenceSession(
        "flask-server/toddler-knife-yolo.onnx",
        providers=['CPUExecutionProvider']
    )

# 3. Define the video capture function to process and annotate frames
def gen_frames():
    # Use 0 for the default webcam, or provide a path to a video file.
    # e.g., video = cv2.VideoCapture('path/to/your/video.mp4')
    camera = cv2.VideoCapture(0) #
    if not camera.isOpened():
        print("Error: Could not open video source.")
        return

    while True:
        # Read a frame from the camera
        success, frame = camera.read() #
        if not success:
            break
        else:
            # --- Start of the inference pipeline on each frame ---
            
            # 4. Pre-processing: Resize the frame to match the model's expected input
            # You'll need to know your model's input size. For example, YOLOv8-N uses 640x640.
            # input_size = (640, 640)
            # preprocessed_frame = cv2.resize(frame, input_size)
            # preprocessed_frame = np.expand_dims(preprocessed_frame, axis=0)
            
            # 5. Inference: Pass the pre-processed frame to the ONNX session
            # Note: The input name 'images' is common for models like YOLOv8.
            # input_name = session.get_inputs().name
            # outputs = session.run(None, {input_name: preprocessed_frame})
            
            # 6. Post-processing and Annotation: Process the model output and draw on the frame
            # This is where you'd implement the logic to draw bounding boxes and keypoints.
            # For a demo, you can start with a simple text overlay.
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, 'Processing with Snapdragon X Elite NPU', (10, 30), font, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
            
            # --- End of the inference pipeline on each frame ---

            # Encode the annotated frame as a JPEG image for streaming
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the frame in the correct multipart format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# 7. Define the Flask route for the video stream
@app.route('/video_feed')
def video_feed():
    """Video streaming route. It provides a real-time stream with annotations."""
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# 8. Run the Flask server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)