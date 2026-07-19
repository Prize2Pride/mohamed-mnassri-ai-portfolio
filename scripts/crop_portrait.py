from pathlib import Path

from PIL import Image


SOURCE = Path("/home/ubuntu/webdev-static-assets/mohamed-mnassri/portrait-000.png")
OUTPUT = Path("/home/ubuntu/webdev-static-assets/mohamed-mnassri/mohamed-reference-portrait.jpg")


def main() -> None:
    with Image.open(SOURCE) as image:
        crop = image.crop((200, 415, 870, 1095))
        crop.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1200, 1200), "#f8f8f7")
        x = (canvas.width - crop.width) // 2
        y = (canvas.height - crop.height) // 2
        canvas.paste(crop.convert("RGB"), (x, y))
        canvas.save(OUTPUT, "JPEG", quality=92, optimize=True)


if __name__ == "__main__":
    main()
