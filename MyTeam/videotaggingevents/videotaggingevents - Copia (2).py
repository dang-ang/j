import sys
import cv2
import csv
from PyQt5.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QVBoxLayout,
    QHBoxLayout, QFileDialog, QListWidget, QSlider
)
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QImage, QPixmap


class VideoTagger(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Video Tagging Events (Qt Edition)")
        self.resize(900, 600)

        self.video_path = None
        self.cap = None
        self.frame_pos = 0
        self.total_frames = 0
        self.fps = 30

        self.tags = []

        # --- UI ---
        self.video_label = QLabel("Carica un video per iniziare")
        self.video_label.setAlignment(Qt.AlignCenter)

        self.slider = QSlider(Qt.Horizontal)
        self.slider.setEnabled(False)
        self.slider.sliderMoved.connect(self.seek_frame)

        self.btn_load = QPushButton("Carica Video")
        self.btn_load.clicked.connect(self.load_video)

        self.btn_tag = QPushButton("Aggiungi Tag")
        self.btn_tag.setEnabled(False)
        self.btn_tag.clicked.connect(self.add_tag)

        self.btn_export = QPushButton("Esporta Tag (CSV)")
        self.btn_export.setEnabled(False)
        self.btn_export.clicked.connect(self.export_tags)

        self.tag_list = QListWidget()

        # Layout
        controls = QHBoxLayout()
        controls.addWidget(self.btn_load)
        controls.addWidget(self.btn_tag)
        controls.addWidget(self.btn_export)

        layout = QVBoxLayout()
        layout.addWidget(self.video_label)
        layout.addWidget(self.slider)
        layout.addLayout(controls)
        layout.addWidget(self.tag_list)

        self.setLayout(layout)

        # Timer per aggiornare il video
        self.timer = QTimer()
        self.timer.timeout.connect(self.next_frame)

    def load_video(self):
        path, _ = QFileDialog.getOpenFileName(self, "Seleziona Video", "", "Video (*.mp4 *.avi *.mov)")
        if not path:
            return

        self.video_path = path
        self.cap = cv2.VideoCapture(path)

        self.total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.fps = self.cap.get(cv2.CAP_PROP_FPS)

        self.slider.setMaximum(self.total_frames)
        self.slider.setEnabled(True)
        self.btn_tag.setEnabled(True)
        self.btn_export.setEnabled(True)

        self.timer.start(int(1000 / self.fps))

    def next_frame(self):
        if not self.cap:
            return

        ret, frame = self.cap.read()
        if not ret:
            return

        self.frame_pos = int(self.cap.get(cv2.CAP_PROP_POS_FRAMES))
        self.slider.setValue(self.frame_pos)

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        h, w, ch = frame.shape
        img = QImage(frame.data, w, h, ch * w, QImage.Format_RGB888)
        self.video_label.setPixmap(QPixmap.fromImage(img))

    def seek_frame(self, pos):
        if self.cap:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, pos)

    def add_tag(self):
        timestamp = self.frame_pos / self.fps
        tag_text = f"Tag @ {timestamp:.2f}s (frame {self.frame_pos})"
        self.tags.append((self.frame_pos, timestamp))
        self.tag_list.addItem(tag_text)

    def export_tags(self):
        path, _ = QFileDialog.getSaveFileName(self, "Esporta CSV", "", "CSV (*.csv)")
        if not path:
            return

        with open(path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["frame", "timestamp_sec"])
            writer.writerows(self.tags)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    win = VideoTagger()
    win.show()
    sys.exit(app.exec_())
