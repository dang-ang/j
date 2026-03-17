import sys
import cv2
import csv
import json
import os
from PyQt5.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QVBoxLayout,
    QHBoxLayout, QFileDialog, QListWidget, QSlider, QListWidgetItem,
    QColorDialog, QDialog, QLineEdit, QFormLayout, QMessageBox
)
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QImage, QPixmap, QColor, QIcon


CATEGORIES_FILE = "categories.json"


# ---------------------------------------------------------
#  CATEGORY EDITOR DIALOG
# ---------------------------------------------------------
class CategoryEditor(QDialog):
    def __init__(self, categories):
        super().__init__()
        self.setWindowTitle("Modifica Categorie")
        self.categories = categories
        self.new_categories = {}

        layout = QVBoxLayout()

        self.forms = {}

        for name, cfg in categories.items():
            form = QFormLayout()

            name_edit = QLineEdit(name)
            key_edit = QLineEdit(cfg["key"])
            color_btn = QPushButton("Colore")
            color_btn.setStyleSheet(f"background-color: {cfg['color']}")
            color_btn.clicked.connect(lambda _, n=name: self.pick_color(n))

            form.addRow("Nome:", name_edit)
            form.addRow("Tasto:", key_edit)
            form.addRow("Colore:", color_btn)

            self.forms[name] = {
                "name": name_edit,
                "key": key_edit,
                "color": cfg["color"],
                "button": color_btn
            }

            layout.addLayout(form)

        save_btn = QPushButton("Salva")
        save_btn.clicked.connect(self.save)

        layout.addWidget(save_btn)
        self.setLayout(layout)

    def pick_color(self, name):
        color = QColorDialog.getColor()
        if color.isValid():
            self.forms[name]["color"] = color.name()
            self.forms[name]["button"].setStyleSheet(f"background-color: {color.name()}")

    def save(self):
        new_data = {}
        for old_name, widgets in self.forms.items():
            new_name = widgets["name"].text()
            key = widgets["key"].text().upper()
            color = widgets["color"]

            if not new_name or not key:
                QMessageBox.warning(self, "Errore", "Nome e tasto non possono essere vuoti.")
                return

            new_data[new_name] = {"key": key, "color": color}

        self.new_categories = new_data
        self.accept()


# ---------------------------------------------------------
#  MAIN VIDEO TAGGER
# ---------------------------------------------------------
class VideoTagger(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Video Tagging Events (Qt Edition)")
        self.resize(1000, 650)
        self.setWindowIcon(QIcon("icon.ico"))

        self.video_path = None
        self.cap = None
        self.frame_pos = 0
        self.total_frames = 0
        self.fps = 30

        self.tags = []

        self.categories = self.load_categories()
        self.shortcut_map = {cfg["key"].upper(): name for name, cfg in self.categories.items()}

        # --- UI ---
        self.video_label = QLabel("Carica un video per iniziare")
        self.video_label.setAlignment(Qt.AlignCenter)

        self.slider = QSlider(Qt.Horizontal)
        self.slider.setEnabled(False)
        self.slider.sliderMoved.connect(self.seek_frame)

        self.btn_load = QPushButton("Carica Video")
        self.btn_load.clicked.connect(self.load_video)

        self.btn_edit_cat = QPushButton("Categorie…")
        self.btn_edit_cat.clicked.connect(self.edit_categories)

        self.btn_export = QPushButton("Esporta Tag (CSV)")
        self.btn_export.setEnabled(False)
        self.btn_export.clicked.connect(self.export_tags)

        self.tag_list = QListWidget()

        controls = QHBoxLayout()
        controls.addWidget(self.btn_load)
        controls.addWidget(self.btn_edit_cat)
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

    # ---------------------------------------------------------
    #  CATEGORY SYSTEM
    # ---------------------------------------------------------
    def load_categories(self):
        if not os.path.exists(CATEGORIES_FILE):
            default = {
                "Passaggio": {"key": "P", "color": "#4CAF50"},
                "Tiro": {"key": "T", "color": "#F44336"},
                "Errore": {"key": "E", "color": "#FF9800"},
                "Recupero": {"key": "R", "color": "#2196F3"}
            }
            with open(CATEGORIES_FILE, "w") as f:
                json.dump(default, f, indent=4)
            return default

        with open(CATEGORIES_FILE, "r") as f:
            return json.load(f)

    def save_categories(self):
        with open(CATEGORIES_FILE, "w") as f:
            json.dump(self.categories, f, indent=4)

    def edit_categories(self):
        dlg = CategoryEditor(self.categories)
        if dlg.exec_():
            self.categories = dlg.new_categories
            self.shortcut_map = {cfg["key"].upper(): name for name, cfg in self.categories.items()}
            self.save_categories()

    # ---------------------------------------------------------
    #  VIDEO FUNCTIONS
    # ---------------------------------------------------------
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

    # ---------------------------------------------------------
    #  TAGGING
    # ---------------------------------------------------------
    def keyPressEvent(self, event):
        key = event.text().upper()
        if key in self.shortcut_map:
            self.add_tag(self.shortcut_map[key])

    def add_tag(self, category):
        timestamp = self.frame_pos / self.fps
        self.tags.append((self.frame_pos, timestamp, category))

        color = self.categories.get(category, {}).get("color", "#FFFFFF")

        item_text = f"{category} @ {timestamp:.2f}s (frame {self.frame_pos})"
        item = QListWidgetItem(item_text)
        item.setForeground(QColor(color))

        self.tag_list.addItem(item)

    # ---------------------------------------------------------
    #  EXPORT
    # ---------------------------------------------------------
    def export_tags(self):
        path, _ = QFileDialog.getSaveFileName(self, "Esporta CSV", "", "CSV (*.csv)")
        if not path:
            return

        with open(path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["frame", "timestamp_sec", "category"])
            writer.writerows(self.tags)


# ---------------------------------------------------------
#  MAIN
# ---------------------------------------------------------
if __name__ == "__main__":
    app = QApplication(sys.argv)
    win = VideoTagger()
    win.show()
    sys.exit(app.exec_())
