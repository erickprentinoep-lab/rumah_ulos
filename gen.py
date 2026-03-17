import re

images = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "5.jpeg", "13.jpeg", "18.jpeg", "42.jpeg", "46.jpeg", "47.jpeg", "52.jpeg", "56.jpeg", "63.jpeg"]

html = '<div class=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4\">\n'
for i in range(1, 61):
    img = images[i % len(images)]
    html += f'''  <div class="gallery-item h-64 rounded-sm overflow-hidden reveal shadow-sm border border-gray-100 relative group"
       data-category="all"
       data-lightbox="assets/{img}"
       data-caption="Koleksi Ulos {i}">
    <img src="assets/{img}" alt="Koleksi Ulos {i}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
    <div class="overlay"><svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
  </div>\n'''
html += '</div>\n'

with open('e:/lp-ulos/gallery.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = re.sub(r'<!-- Simple Grid 60 Items -->.*?\{html\}', f'<!-- Simple Grid 60 Items -->\n      {{html}}'.format(html=html), content, flags=re.DOTALL)

with open('e:/lp-ulos/gallery.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
