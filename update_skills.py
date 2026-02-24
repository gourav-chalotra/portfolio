import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# The categories
categories = [
    ("Programming", "terminal"),
    ("Web Technologies", "html"),
    ("Databases", "database"),
    ("Tools", "build"),
    ("Core Concepts", "psychology")
]

for title, icon in categories:
    # Find the comment block for the category
    # E.g. <!-- Programming -->
    # Then the <div data-aos=... class="glass-card... transition-colors duration-500">
    # Then the h3
    # Then the flex div
    # Then the </div>
    
    pattern = r'(<!-- ' + re.escape(title) + r' -->\s*<div data-aos="[^"]*"\s*class="glass-card[^>]*>)(.*?)(</div>\s*</div>)'
    
    # We will use a more robust regex that just finds the category comment and its outer <div> ... </div>
    # Actually finding the balanced </div> is hard in regex. Let's do it with simple string splits on the comment.
    
    start_idx = html.find(f'<!-- {title} -->')
    if start_idx == -1:
        print(f"Could not find {title}")
        continue
        
    aos_idx = html.find('<div data-aos=', start_idx)
    end_div_idx = html.find('</div>', aos_idx) 
    
    # Since there are nested divs (like h3, div.flex), we need to find the matching closing div for the outer one.
    nested = 0
    i = aos_idx
    while i < len(html):
        if html[i:i+4] == '<div':
            nested += 1
        elif html[i:i+5] == '</div':
            nested -= 1
            if nested == 0:
                end_idx = i + 6
                break
        i += 1
        
    old_block = html[aos_idx:end_idx]
    
    # Extract the AOS tag
    aos_match = re.search(r'<div (data-aos="[^"]*"(?:\s*data-aos-delay="[^"]*")?)', old_block)
    aos_attr = aos_match.group(1) if aos_match else 'data-aos="fade-up"'
    
    # Extract the inner content (h3 and flex div)
    inner_content = re.sub(r'^<div[^>]*>', '', old_block)
    inner_content = re.sub(r'</div>\s*$', '', inner_content)
    
    # Check if the class contains md:col-span-2 (e.g for Core Concepts)
    span_class = ""
    if "md:col-span-2" in old_block:
        span_class = "md:col-span-2 lg:col-span-2"

    new_block = f'''<div {aos_attr} class="relative w-full h-[280px] group perspective-[1000px] cursor-pointer {span_class}">
                    <!-- 3D Cube (Default State) -->
                    <div class="skill-cube absolute inset-0 m-auto w-32 h-32 preserve-3d transition-all duration-700 ease-in-out z-10 group-hover:opacity-0 group-hover:scale-50 group-hover:-translate-y-10 pointer-events-none">
                        <div class="cube-face cube-front bg-white/10 dark:bg-[#111] border border-gray-200 dark:border-white/10 backdrop-blur-md rounded-xl shadow-lg flex flex-col items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-4xl text-accentPurple bg-accentPurple/10 p-3 rounded-full">{icon}</span>
                            <span class="text-sm font-bold text-textDark dark:text-white text-center px-1">{title}</span>
                        </div>
                        <div class="cube-face cube-back bg-accentPurple/10 border-accentPurple/20 rounded-xl"></div>
                        <div class="cube-face cube-right bg-accentPurple/5 border-accentPurple/20 rounded-xl"></div>
                        <div class="cube-face cube-left bg-accentPurple/5 border-accentPurple/20 rounded-xl"></div>
                        <div class="cube-face cube-top bg-accentPurple/10 border-accentPurple/20 rounded-xl"></div>
                        <div class="cube-face cube-bottom bg-accentPurple/10 border-accentPurple/20 rounded-xl"></div>
                    </div>

                    <!-- 2D Card (Hover State) -->
                    <div class="glass-card w-full h-full absolute inset-0 dark:bg-white/5 dark:border-white/10 dark:hover:border-accentPurple/30 transition-all duration-700 ease-in-out scale-90 opacity-0 z-0 group-hover:scale-100 group-hover:opacity-100 group-hover:z-20 p-6 pointer-events-none group-hover:pointer-events-auto flex flex-col justify-center">
{inner_content}
                    </div>
                </div>'''

    html = html[:aos_idx] + new_block + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Successfully updated index.html!")
