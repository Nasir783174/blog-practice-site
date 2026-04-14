# zornavik.me — Site Guide

## 📁 Folder Structure

```
zornavik/
├── index.html              ← Home page
├── vercel.json             ← Vercel routing config
├── css/
│   └── style.css           ← ALL styles (never edit blog files for CSS)
├── js/
│   └── main.js             ← ALL JavaScript (nav, blog loading, pagination)
├── images/                 ← All images go here
│   └── favicon.ico
├── blog/
│   └── blog-data.json      ← ⭐ YOU EDIT THIS for every new post
│   └── best/
│       └── best-cordless-vacuum-cleaners-2026/
│           └── index.html  ← Example blog post
│   └── reviews/
│       └── (your review posts go here)
├── best/
│   └── index.html          ← "Best" category page
├── reviews/
│   └── index.html          ← "Reviews" category page
├── author/
│   └── index.html
├── contact/
│   └── index.html
├── privacy-policy/
│   └── index.html
├── disclaimer/
│   └── index.html
└── terms/
    └── index.html
```

---

## ✅ How to Add a New Blog Post

### Step 1: Create the folder and file

For a post in the "best" category with slug `best-robot-vacuums-2026`:

```
blog/best/best-robot-vacuums-2026/index.html
```

For a "reviews" category post with slug `dyson-v15-review`:

```
blog/reviews/dyson-v15-review/index.html
```

### Step 2: Copy the blog template

Copy `blog/best/best-cordless-vacuum-cleaners-2026/index.html` and:

1. Update `<title>` tag
2. Update `<meta name="description">` 
3. Update `<link rel="canonical">` URL
4. Update the Schema.org JSON-LD block (headline, datePublished, description)
5. Update the category badge (`<a class="post-category-link">`)
6. Update the `<h1>` title
7. Update the `<time>` date
8. Replace the content inside `<div class="blog-css">` with your blog

### Step 3: Update blog-data.json

Open `blog/blog-data.json` and add your post to the array:

```json
{
  "title": "Best Robot Vacuums of 2026",
  "slug": "best-robot-vacuums-2026",
  "category": "Best",
  "category_slug": "best",
  "date": "2026-04-20",
  "excerpt": "We tested 12 robot vacuums to find the best picks for every budget and floor type.",
  "thumbnail": "/images/robot-vacuum-cover.jpg"
}
```

**That's it!** The post will automatically appear on the home page and the /best/ category page.

---

## 📝 Blog Content Cheat Sheet (inside .blog-css)

All these elements are already styled — just use them:

### Headings
```html
<h2>Section Title</h2>
<h3>Subsection</h3>
<h4>Minor heading</h4>
```

### Lists
```html
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>

<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>
```

### Table
```html
<table>
  <thead>
    <tr><th>Model</th><th>Suction</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Dyson Gen5</td><td>280 AW</td><td>$$$</td></tr>
  </tbody>
</table>
```

### Pros & Cons box
```html
<div class="pros-cons">
  <div class="pros">
    <h4>✅ Pros</h4>
    <ul>
      <li>Great suction</li>
    </ul>
  </div>
  <div class="cons">
    <h4>❌ Cons</h4>
    <ul>
      <li>Expensive</li>
    </ul>
  </div>
</div>
```

### Tip / Info / Warning boxes
```html
<div class="tip-box">💡 <strong>Tip:</strong> Your tip here</div>
<div class="info-box">ℹ️ <strong>Note:</strong> Your note here</div>
<div class="warning-box">⚠️ <strong>Warning:</strong> Your warning here</div>
```

### Table of Contents
```html
<div class="toc">
  <div class="toc-title">📋 Table of Contents</div>
  <ol>
    <li><a href="#section1">Section 1</a></li>
    <li><a href="#section2">Section 2</a></li>
  </ol>
</div>
```

### Image
```html
<img src="/images/your-image.jpg" alt="Description of image">
```

### YouTube Video
```html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>
```

### Blockquote
```html
<blockquote>
  <p>Your quote here.</p>
  <cite>— Source Name</cite>
</blockquote>
```

---

## ➕ Adding a New Category

1. Add posts with the new `category_slug` to `blog-data.json`
2. Create folder: e.g. `guides/`
3. Copy `best/index.html` → `guides/index.html`
4. Change `data-category="best"` to `data-category="guides"` on the `<body>` tag
5. The nav will automatically update to include the new category link

---

## 🚀 Deploying to Vercel

1. Push everything to your GitHub repository
2. Go to vercel.com → Import your repo
3. Set framework to **Other** (no build step needed)
4. Root directory = `/` (or wherever you put the files)
5. Deploy!

The `vercel.json` handles all URL routing automatically.

---

## 📸 Images

Put all images inside the `/images/` folder.

Reference them as: `/images/your-image.jpg`

Recommended image size for thumbnails: **800×450px** (16:9 ratio)
Featured blog images: **1200×630px**

---

## ✉️ Contact Form

The contact form uses Netlify Forms (attribute `netlify` on the form tag).
If using Vercel, replace with Formspree or EmailJS — see their docs for setup.
