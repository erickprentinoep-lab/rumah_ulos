const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const navRegex = /<nav[\s\S]*?<\/nav>/;
const match = indexHtml.match(navRegex);

if (!match) {
  console.error("Navbar not found in index.html");
  process.exit(1);
}

const navContent = match[0];
const filesToUpdate = ['team.html', 'products.html', 'gallery.html', 'business.html'];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Create page-specific active state
    let specificNavContent = navContent;
    let activeClass = 'text-ru-gold font-semibold';
    let inactiveClass = 'hover:text-ru-gold transition-colors duration-200';
    let mobileInactiveClass = 'py-2 hover:text-ru-gold transition-colors';
    let mobileActiveClass = 'py-2 text-ru-gold font-semibold';

    // 1. Reset all active states to inactive
    // Desktop Home
    specificNavContent = specificNavContent.replace(
      /<a href="index\.html" data-nav class="text-ru-gold font-semibold">Beranda<\/a>/,
      `<a href="index.html" data-nav class="${inactiveClass}">Beranda</a>`
    );
    // Mobile Home
    specificNavContent = specificNavContent.replace(
      /<a href="index\.html" data-nav class="py-2 text-ru-gold font-semibold">Beranda<\/a>/,
      `<a href="index.html" data-nav class="${mobileInactiveClass}">Beranda</a>`
    );

    // 2. Set the current page to active
    let fileName = file.replace('.html', '');
    let CapitalizedName = fileName === 'team' ? 'Tim' : 
                          fileName === 'products' ? 'Produk' : 
                          fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    // Desktop Active
    const desktopInactiveRegex = new RegExp(`<a href="${file}" data-nav class="${inactiveClass.replace(/\./g, '\\.')}">${CapitalizedName}</a>`);
    specificNavContent = specificNavContent.replace(
      desktopInactiveRegex,
      `<a href="${file}" data-nav class="${activeClass}">${CapitalizedName}</a>`
    );

    // Mobile Active
    const mobileInactiveRegex = new RegExp(`<a href="${file}" data-nav class="${mobileInactiveClass.replace(/\./g, '\\.')}">${CapitalizedName}</a>`);
    specificNavContent = specificNavContent.replace(
      mobileInactiveRegex,
      `<a href="${file}" data-nav class="${mobileActiveClass}">${CapitalizedName}</a>`
    );
    
    // Replace old nav with new specific nav
    content = content.replace(/<nav[\s\S]*?<\/nav>/, specificNavContent);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navbar in ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
