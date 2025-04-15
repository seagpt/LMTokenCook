import customtkinter as ctk
import tkinter.filedialog as fd
import threading
import queue
import pathlib
from PIL import Image
import os
import sys

# DEBUG: Print tiktoken version and location at runtime
try:
    import tiktoken
    print("tiktoken version in exe:", getattr(tiktoken, "__version__", "NO_VERSION_ATTR"))
    print("tiktoken location:", getattr(tiktoken, "__file__", "NO_FILE"))
except Exception as e:
    print("tiktoken import error:", e)

# Set dark mode appearance only
ctk.set_appearance_mode("Dark")

# Dark mode color palette only
PALETTE = {
    "PRIMARY_YELLOW": "#FFEB70",
    "DARK_YELLOW": "#FFE066",
    "BG_COLOR": "#232323",
    "TEXT_COLOR": "#FFEB70",
    "TITLE_COLOR": "#FFEB70",
    "ACCENT_COLOR": "#FFF9C4"
}
ctk.set_default_color_theme("green")  # We'll override widget colors manually

# Helper for resource paths (works for dev and PyInstaller bundle)
def resource_path(relative_path):
    import sys, os
    # Handles both PyInstaller bundles and dev mode
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.abspath(relative_path)

class LMTokenCookApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("LMTokenCook")
        self.queue = queue.Queue()
        self.minsize(600, 900)
        self.resizable(True, True)
        self._build_widgets()


    def _rebuild_widgets(self):
        # Remove all widgets and rebuild with new palette
        for widget in self.winfo_children():
            widget.destroy()
        self._build_widgets()

    def _build_widgets(self):
        # Helper for drag-and-drop support (macOS/Tkinter native)
        def drop(event):
            path = event.data.strip()
            if path.startswith('{') and path.endswith('}'):
                path = path[1:-1]
            self.input_entry.delete(0, 'end')
            self.input_entry.insert(0, path)
        def enable_drag_and_drop(entry_widget):
            try:
                import tkinterdnd2 as tkdnd
                self.tk.call('package', 'require', 'tkdnd')
                entry_widget.drop_target_register('DND_Files')
                entry_widget.dnd_bind('<<Drop>>', drop)
            except Exception:
                pass
        self._enable_drag_and_drop = enable_drag_and_drop
        self.configure(bg_color=PALETTE["BG_COLOR"])

        # --- Header: Logo, Motto, Byline ---
        header = ctk.CTkFrame(self, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        header.pack(side="top", pady=(8, 0))
        try:
            logo_path = resource_path("assets/LMTC_Patch.png")
            image = Image.open(logo_path)
            image = image.resize((268, 268), Image.LANCZOS)
            icon_image = ctk.CTkImage(light_image=image, dark_image=image, size=(268, 268))
            icon_label = ctk.CTkLabel(header, image=icon_image, text="", bg_color=PALETTE["BG_COLOR"])
            icon_label.pack(pady=(0, 4))
        except Exception as e:
            print(f"[WARN] Could not load logo: {e}")
        # Motto (centered, below logo)
        motto_label = ctk.CTkLabel(
            header,
            text="Cook your files into perfect AI-ready bites",
            font=("Arial", 16, "italic"),
            text_color=PALETTE["PRIMARY_YELLOW"],
            bg_color=PALETTE["BG_COLOR"]
        )
        motto_label.pack(pady=(0, 2))

        # Byline (centered, below motto)
        byline_label = ctk.CTkLabel(
            header,
            text="by Steven Seagondollar & DropShock Digital",
            font=("Arial", 12, "italic"),
            text_color=PALETTE["PRIMARY_YELLOW"],
            bg_color=PALETTE["BG_COLOR"]
        )
        byline_label.pack(pady=(0, 10))

        # --- Main Content ---
        main_frame = ctk.CTkFrame(self, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=12)
        main_frame.pack(side="top", pady=8)
        main_frame.configure(width=480)


        # Input Row
        input_row = ctk.CTkFrame(main_frame, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        input_row.pack(fill="x", pady=(4, 2))
        input_label = ctk.CTkLabel(input_row, text="Input Folder", text_color=PALETTE["TEXT_COLOR"], bg_color=PALETTE["BG_COLOR"])
        input_label.pack(side="left", padx=(0, 8))
        self.input_entry = ctk.CTkEntry(input_row, width=320)
        self.input_entry.configure(width=320)
        self.input_entry.pack(side="left", padx=(0, 8), expand=True, fill="x")
        input_browse = ctk.CTkButton(input_row, text="Browse", command=self.browse_input, fg_color=PALETTE["PRIMARY_YELLOW"], text_color=PALETTE["BG_COLOR"])
        input_browse.pack(side="left")

        # Output Row
        output_row = ctk.CTkFrame(main_frame, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        output_row.pack(fill="x", pady=(2, 6))
        output_label = ctk.CTkLabel(output_row, text="Output Folder", text_color=PALETTE["TEXT_COLOR"], bg_color=PALETTE["BG_COLOR"])
        output_label.pack(side="left", padx=(0, 8))
        self.output_entry = ctk.CTkEntry(output_row, width=320)
        self.output_entry.configure(width=320)
        self.output_entry.pack(side="left", padx=(0, 8), expand=True, fill="x")
        output_browse = ctk.CTkButton(output_row, text="Browse", command=self.browse_output, fg_color=PALETTE["PRIMARY_YELLOW"], text_color=PALETTE["BG_COLOR"])
        output_browse.pack(side="left")

        # Chunk size and checkbox row
        chunk_row = ctk.CTkFrame(main_frame, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        chunk_row.pack(fill="x", pady=(2, 4))
        chunk_label = ctk.CTkLabel(chunk_row, text="Chunk Size (tokens):", font=("Arial", 13, "bold"), text_color=PALETTE["TEXT_COLOR"], bg_color=PALETTE["BG_COLOR"])
        chunk_label.pack(side="left", padx=(0, 8))
        self.chunk_entry = ctk.CTkEntry(chunk_row, width=80, fg_color=PALETTE["ACCENT_COLOR"], text_color="#000000")
        self.chunk_entry.insert(0, "28000")
        self.chunk_entry.pack(side="left", padx=(0, 8))
        self.keep_master_var = ctk.BooleanVar(value=False)
        self.keep_master_checkbox = ctk.CTkCheckBox(chunk_row, text="Keep masterfile.txt", variable=self.keep_master_var, font=("Arial", 11), text_color=PALETTE["PRIMARY_YELLOW"], bg_color=PALETTE["BG_COLOR"])
        self.keep_master_checkbox.pack(side="left", padx=(12, 0))

        # Add line numbers checkbox
        self.add_line_numbers_var = ctk.BooleanVar(value=False)
        self.add_line_numbers_checkbox = ctk.CTkCheckBox(chunk_row, text="Add line numbers", variable=self.add_line_numbers_var, font=("Arial", 11), text_color=PALETTE["PRIMARY_YELLOW"], bg_color=PALETTE["BG_COLOR"])
        self.add_line_numbers_checkbox.pack(side="left", padx=(12, 0))

        # Skip empty lines checkbox
        self.skip_empty_lines_var = ctk.BooleanVar(value=False)
        self.skip_empty_lines_checkbox = ctk.CTkCheckBox(chunk_row, text="Skip empty lines", variable=self.skip_empty_lines_var, font=("Arial", 11), text_color=PALETTE["PRIMARY_YELLOW"], bg_color=PALETTE["BG_COLOR"])
        self.skip_empty_lines_checkbox.pack(side="left", padx=(12, 0))

        # Warning label (initially hidden)
        self.warning_label = ctk.CTkLabel(main_frame, text="", font=("Arial", 11, "bold"), text_color="#FFAA00", bg_color=PALETTE["BG_COLOR"])
        self.warning_label.pack(fill="x", padx=4, pady=(0, 4))

        # Progress bar and percent label
        progress_row = ctk.CTkFrame(main_frame, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        progress_row.pack(fill="x", pady=(2, 2))
        self.progress = ctk.CTkProgressBar(progress_row, width=440, height=16, fg_color="#555555", progress_color=PALETTE["PRIMARY_YELLOW"], corner_radius=8)
        self.progress.pack(side="left", padx=(0, 8), pady=(0, 0), fill="x", expand=True)
        self.progress.set(0)
        self.progress_percent = ctk.CTkLabel(progress_row, text="0%", font=("Arial", 11, "bold"), text_color=PALETTE["PRIMARY_YELLOW"], bg_color=PALETTE["BG_COLOR"])
        self.progress_percent.pack(side="left", padx=(0, 0))

        # Status log (console)
        self.status_box = ctk.CTkTextbox(main_frame, width=540, height=100, state="disabled", fg_color=PALETTE["ACCENT_COLOR"], text_color="#000000")
        self.status_box.pack(fill="x", pady=(10, 8))

        # Buttons row
        buttons_row = ctk.CTkFrame(main_frame, fg_color=PALETTE["BG_COLOR"], bg_color=PALETTE["BG_COLOR"], corner_radius=0)
        buttons_row.pack(fill="x", pady=(4, 8))
        self.start_btn = ctk.CTkButton(buttons_row, text="Start", command=self.start_processing, fg_color=PALETTE["PRIMARY_YELLOW"], text_color="#000000", font=("Arial", 13, "bold"))
        self.start_btn.pack(side="left", padx=(0, 10), expand=True, fill="x")
        self.cancel_btn = ctk.CTkButton(buttons_row, text="Cancel", command=self.cancel_processing, fg_color="#FF5555", text_color="#FFFFFF", font=("Arial", 13, "bold"), state="disabled")
        self.cancel_btn.pack(side="left", padx=(0, 10), expand=True, fill="x")
        self.open_output_btn = ctk.CTkButton(buttons_row, text="Open Output", command=self.open_output_folder, fg_color=PALETTE["DARK_YELLOW"], text_color="#000000", font=("Arial", 13, "bold"), state="disabled")
        self.open_output_btn.pack(side="left", padx=(0, 10), expand=True, fill="x")
        self.github_btn = ctk.CTkButton(buttons_row, text="GitHub", command=self.open_github, fg_color="#2222AA", text_color="#FFFFFF", font=("Arial", 13, "bold"))
        self.github_btn.pack(side="left", padx=(0, 0), expand=True, fill="x")

    def _update_warning_label(self, *args):
        if self.add_line_numbers_var.get() and self.skip_empty_lines_var.get():
            self.warning_label.configure(text="Warning: With both options enabled, line numbers will not match the original file. For code, consider leaving ‘Skip empty lines’ OFF.")
        else:
            self.warning_label.configure(text="")


    def browse_input(self):
        path = fd.askdirectory(title="Select Input Directory")
        if path:
            self.input_entry.delete(0, "end")
            self.input_entry.insert(0, path)

    def browse_output(self):
        path = fd.askdirectory(title="Select Output Directory")
        if path:
            self.output_entry.delete(0, "end")
            self.output_entry.insert(0, path)

    def start_processing(self):
        input_path = self.input_entry.get().strip()
        output_path = self.output_entry.get().strip()
        keep_masterfile = self.keep_master_var.get()
        add_line_numbers = self.add_line_numbers_var.get()
        skip_empty_lines = self.skip_empty_lines_var.get()
        try:
            chunk_size = int(self.chunk_entry.get().strip())
        except ValueError:
            self.log_status("[ERROR] Invalid chunk size.")
            return
        if not input_path or not output_path:
            self.log_status("[ERROR] Please select both input and output paths.")
            return
        self.status_box.configure(state="normal")
        self.status_box.delete("1.0", "end")
        self.status_box.configure(state="disabled")
        self.progress.set(0)
        self.start_btn.configure(state="disabled")
        self.cancel_btn.configure(state="normal")
        self.open_output_btn.configure(state="disabled")
        self.cancel_flag = threading.Event()
        self.progress_queue = queue.Queue()
        self.processing_thread = threading.Thread(
            target=self._run_processing,
            args=(input_path, output_path, chunk_size, keep_masterfile, add_line_numbers, skip_empty_lines),
            daemon=True
        )
        self.processing_thread.start()
        self.after(100, self._process_queue)

    def _run_processing(self, input_path, output_path, chunk_size, keep_masterfile, add_line_numbers, skip_empty_lines):
        import traceback
        from lmtokencook.main import run_lmtokencook, CancelledError
        try:
            def progress_callback(msg, current=None, total=None):
                self.progress_queue.put((msg, current, total))
            result = run_lmtokencook(
                input_path,
                output_path,
                chunk_size,
                progress_callback=progress_callback,
                cancel_flag=self.cancel_flag,
                keep_masterfile=keep_masterfile,
                add_line_numbers=add_line_numbers,
                skip_empty_lines=skip_empty_lines
            )
            self.progress_queue.put(("[SUCCESS] Processing complete.", None, None, result))
        except FileNotFoundError as e:
            self.progress_queue.put((f"[ERROR] File not found: {e}", None, None, None))
        except PermissionError as e:
            self.progress_queue.put((f"[ERROR] Permission denied: {e}", None, None, None))
        except ImportError as e:
            self.progress_queue.put((f"[ERROR] Missing dependency: {e}", None, None, None))
        except CancelledError:
            self.progress_queue.put(("[INFO] Processing cancelled by user.", None, None, None))
        except Exception as e:
            # Try to provide ExtractionError details if available
            from lmtokencook.extractors import ExtractionError
            if isinstance(e, ExtractionError):
                self.progress_queue.put((f"[ERROR] Extraction failed: {e}", None, None, None))
            else:
                tb = traceback.format_exc()
                self.progress_queue.put((f"[ERROR] {e}\n{tb}", None, None, None))

    def _process_queue(self):
        try:
            while True:
                item = self.progress_queue.get_nowait()
                if len(item) == 4:
                    msg, current, total, result = item
                else:
                    msg, current, total = item
                    result = None
                self.log_status(msg)
                if current is not None and total is not None and total > 0:
                    self.progress.set(current / total)
                    self.progress_percent.configure(text=f"{int((current / total) * 100)}%")
                if result is not None:
                    self.processing_result = result
                    self.open_output_btn.configure(state="normal")
                    self.start_btn.configure(state="normal")
                    self.cancel_btn.configure(state="disabled")
                elif "cancelled" in msg.lower() or "error" in msg.lower():
                    self.start_btn.configure(state="normal")
                    self.cancel_btn.configure(state="disabled")
                    self.open_output_btn.configure(state="disabled")
        except queue.Empty:
            pass
        if hasattr(self, "processing_thread") and self.processing_thread.is_alive():
            self.after(100, self._process_queue)

    def cancel_processing(self):
        if hasattr(self, "cancel_flag"):
            self.cancel_flag.set()
            self.log_status("[INFO] Cancellation requested.")
        self.cancel_btn.configure(state="disabled")

    def open_output_folder(self):
        import os
        import subprocess
        import sys
        result = getattr(self, "processing_result", None)
        output_dir = None
        if result and "output_dir" in result:
            output_dir = result["output_dir"]
        else:
            output_dir = self.output_entry.get().strip()
            if not output_dir:
                self.log_status("[INFO] No output directory available.")
                return
        if os.path.isdir(output_dir):
            if os.name == "nt":
                os.startfile(output_dir)
            else:
                subprocess.Popen(["open" if sys.platform == "darwin" else "xdg-open", output_dir])
        else:
            self.log_status(f"[INFO] Output directory does not exist: {output_dir}")

    def log_status(self, msg):
        self.status_box.configure(state="normal")
        self.status_box.insert("end", msg + "\n")
        self.status_box.see("end")
        self.status_box.configure(state="disabled")

    def open_github(self):
        import webbrowser
        webbrowser.open_new_tab("https://github.com/seagpt")

if __name__ == "__main__":
    app = LMTokenCookApp()
    app.mainloop()
