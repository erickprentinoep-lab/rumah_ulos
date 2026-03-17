const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const footerRegex = /<footer[\s\S]*?<\/footer>/;
const match = indexHtml.match(footerRegex);

if (!match) {
  console.error("Footer not found in index.html");
  process.exit(1);
}

const footerContent = match[0];
const filesToUpdate = ['team.html', 'products.html', 'gallery.html', 'business.html'];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<footer[\s\S]*?<\/footer>/, footerContent);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated footer in ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
