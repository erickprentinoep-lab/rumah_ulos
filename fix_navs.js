const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const navContent = indexHtml.match(/<nav[\s\S]*?<\/nav>/)[0];
const filesToUpdate = ['team.html', 'products.html', 'gallery.html', 'business.html'];

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let specificNavContent = navContent;
  let inactiveClass = 'hover:text-ru-gold transition-colors duration-200';
  let activeClass = 'text-ru-gold font-semibold';
  let mobileInactiveClass = 'py-2 hover:text-ru-gold transition-colors';
  let mobileActiveClass = 'py-2 text-ru-gold font-semibold';

  specificNavContent = specificNavContent.replace(/<a href="index\.html" data-nav class="text-ru-gold font-semibold">Beranda<\/a>/, `<a href="index.html" data-nav class="${inactiveClass}">Beranda</a>`);
  specificNavContent = specificNavContent.replace(/<a href="index\.html" data-nav class="py-2 text-ru-gold font-semibold">Beranda<\/a>/, `<a href="index.html" data-nav class="${mobileInactiveClass}">Beranda</a>`);

  let titleMap = {'team.html': 'Tim', 'products.html': 'Produk', 'gallery.html': 'Galeri', 'business.html': 'Bisnis'};
  let CapitalizedName = titleMap[file];

  const desktopInactiveRegex = new RegExp(`<a href="${file}" data-nav class="${inactiveClass.replace(/\./g, '\\.')}">${CapitalizedName}</a>`);
  specificNavContent = specificNavContent.replace(desktopInactiveRegex, `<a href="${file}" data-nav class="${activeClass}">${CapitalizedName}</a>`);

  const mobileInactiveRegex = new RegExp(`<a href="${file}" data-nav class="${mobileInactiveClass.replace(/\./g, '\\.')}">${CapitalizedName}</a>`);
  specificNavContent = specificNavContent.replace(mobileInactiveRegex, `<a href="${file}" data-nav class="${mobileActiveClass}">${CapitalizedName}</a>`);

  content = content.replace(/<nav[\s\S]*?<\/nav>/, specificNavContent);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed active state in ' + file);
});
