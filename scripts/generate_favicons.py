import os
import base64
from PIL import Image

def generate_favicons():
    logo_path = os.path.join("app", "static", "img", "ole_logo.png")
    logo = Image.open(logo_path)

    def make_square_icon(size):
        icon = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        scale = (size * 0.92) / max(logo.width, logo.height)
        new_w = int(logo.width * scale)
        new_h = int(logo.height * scale)
        resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
        px = (size - new_w) // 2
        py = (size - new_h) // 2
        icon.paste(resized, (px, py), resized)
        return icon

    # 16x16
    icon16 = make_square_icon(16)
    icon16.save(os.path.join("app", "static", "favicon-16x16.png"))

    # 32x32
    icon32 = make_square_icon(32)
    icon32.save(os.path.join("app", "static", "favicon-32x32.png"))

    # 180x180
    icon180 = make_square_icon(180)
    icon180.save(os.path.join("app", "static", "apple-touch-icon.png"))

    # 512x512
    icon512 = make_square_icon(512)
    icon512.save(os.path.join("app", "static", "favicon-512x512.png"))

    # ICO
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
    icon512.save(os.path.join("app", "static", "favicon.ico"), format='ICO', sizes=sizes)

    # SVG
    with open(os.path.join("app", "static", "favicon-512x512.png"), "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{b64}" x="0" y="0" width="512" height="512"/>
</svg>'''

    with open(os.path.join("app", "static", "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)

    print("Successfully regenerated all favicons from user logo!")

if __name__ == "__main__":
    generate_favicons()
