import re, base64, mimetypes, os
src = open('src.html').read()
fonts = open('fonts-local.css').read()
html = src.replace('/*FONTS*/', fonts)
open('print.html', 'w').write(html)          # relative assets, used for the PDF render

MIME = {'.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'}
def inline(m):
    path = m.group(0)
    ext = os.path.splitext(path)[1]
    data = base64.b64encode(open(path, 'rb').read()).decode()
    return f'data:{MIME[ext]};base64,{data}'
single = re.sub(r'assets/[A-Za-z0-9._-]+', inline, html)
open('PastaMania-Pitch-Animated.html', 'w').write(single)
print('print.html', len(html)//1024, 'KB | single-file', round(len(single)/1048576, 1), 'MB')
