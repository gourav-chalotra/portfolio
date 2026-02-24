import re

with open('skills.js', 'r', encoding='utf-8') as f:
    js_text = f.read()

# Speed up rotation
js_text = re.sub(r'duration:\s*"random\([^\)]+\)"', 'duration: "random(2.5, 5)"', js_text)

with open('skills.js', 'w', encoding='utf-8') as f:
    f.write(js_text)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Increase z-index of wrapper on hover to prevent overlapping issues from siblings
html = html.replace('group perspective-[1000px]', 'group hover:z-50 perspective-[1000px]')
# Make it scale much larger
html = html.replace('group-hover:scale-100 group-hover:opacity-100 group-hover:z-20', 'group-hover:scale-[1.25] group-hover:opacity-100 group-hover:z-50 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Updated hover scaling and rotation speed!")
