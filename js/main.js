/**
 * ZORNAVIK.ME — Main JavaScript
 * Handles: JSON-driven blog loading, dynamic nav, pagination, category filtering
 */

"use strict";

// ── Config ──────────────────────────────────────────────────
const CONFIG = {
  postsPerPage: 9,
  blogDataPath: "/blog/blog-data.json",
  blogBasePath: "/blog/",
};

// ── State ────────────────────────────────────────────────────
let allPosts = [];
let currentPage = 1;
let currentCategory = null; // null = all posts

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  setupMobileNav();
  await loadPosts();
  resolvePageType();
});

// ── Load posts from JSON ──────────────────────────────────────
async function loadPosts() {
  try {
    const res = await fetch(CONFIG.blogDataPath);
    if (!res.ok) throw new Error("Failed to load blog-data.json");
    allPosts = await res.json();
  } catch (err) {
    console.warn("Blog data could not be loaded:", err);
    allPosts = [];
  }
  buildNav();
}

// ── Figure out what page we're on ────────────────────────────
function resolvePageType() {
  const body = document.body;

  if (body.classList.contains("page-home")) {
    currentCategory = null;
    renderPostsGrid();
  } else if (body.classList.contains("page-category")) {
    // Read category slug from data attribute on body
    const slug = body.dataset.category || "";
    currentCategory = slug;
    renderCategoryPage(slug);
  }
  // Individual blog pages don't need JS rendering
}

// ── Dynamic Nav: auto-generate category links from JSON ───────
function buildNav() {
  const navEls = document.querySelectorAll(".main-nav, .mobile-nav");
  if (!navEls.length) return;

  // Unique categories preserving insertion order
  const seen = new Set();
  const categories = [];
  allPosts.forEach((p) => {
    if (p.category_slug && !seen.has(p.category_slug)) {
      seen.add(p.category_slug);
      categories.push({ slug: p.category_slug, name: p.category });
    }
  });

  navEls.forEach((nav) => {
    // Remove old dynamic links
    nav.querySelectorAll(".nav-dynamic").forEach((el) => el.remove());

    // Current path for active state
    const path = window.location.pathname;

    categories.forEach(({ slug, name }) => {
      const a = document.createElement("a");
      a.href = `/${slug}/`;
      a.textContent = name || slug.replace(/-/g, " ");
      a.className = "nav-dynamic";
      if (path.startsWith(`/${slug}`)) a.classList.add("active");
      nav.appendChild(a);
    });
  });
}

// ── Render home / category grid with pagination ───────────────
function renderPostsGrid() {
  const container = document.getElementById("posts-container");
  const paginationEl = document.getElementById("pagination");
  if (!container) return;

  // Filter
  const filtered =
    currentCategory
      ? allPosts.filter((p) => p.category_slug === currentCategory)
      : allPosts;

  // Sort: newest first (using date field if present)
  filtered.sort((a, b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CONFIG.postsPerPage));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * CONFIG.postsPerPage;
  const pagePosts = filtered.slice(start, start + CONFIG.postsPerPage);

  // Render cards
  if (pagePosts.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <h3>No posts found</h3>
        <p>Check back soon for new content.</p>
      </div>`;
  } else {
    container.innerHTML = `<div class="posts-grid">${pagePosts.map(postCardHTML).join("")}</div>`;
  }

  // Pagination
  if (paginationEl) {
    paginationEl.innerHTML = buildPaginationHTML(currentPage, totalPages);
    paginationEl.querySelectorAll("a[data-page]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = parseInt(a.dataset.page, 10);
        renderPostsGrid();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }
}

// ── Category page setup ────────────────────────────────────────
function renderCategoryPage(slug) {
  // Update category hero text
  const catTitle = document.getElementById("category-title");
  const catCount = document.getElementById("category-count");
  if (catTitle) {
    const post = allPosts.find((p) => p.category_slug === slug);
    const catName = post ? post.category : slug.replace(/-/g, " ");
    catTitle.innerHTML = `<span>${catName}</span> Reviews &amp; Guides`;
  }
  if (catCount) {
    const count = allPosts.filter((p) => p.category_slug === slug).length;
    catCount.textContent = `${count} article${count !== 1 ? "s" : ""}`;
  }
  renderPostsGrid();
}

// ── Post card HTML ─────────────────────────────────────────────
function postCardHTML(post) {
  const url = `/${post.category_slug}/${post.slug}/`;
  const imgHTML = post.thumbnail
    ? `<img class="card-img lazy-fade" src="${post.thumbnail}" alt="${escapeHTML(post.title)}" loading="lazy" onload="this.classList.add('loaded')">`
    : `<div class="card-img-placeholder">🔍</div>`;

  const excerpt = post.excerpt
    ? `<p class="card-excerpt">${escapeHTML(post.excerpt)}</p>`
    : "";

  const date = post.date
    ? `<span>${formatDate(post.date)}</span>`
    : "";

  return `
    <article class="post-card">
      <a href="${url}" aria-label="${escapeHTML(post.title)}">
        ${imgHTML}
      </a>
      <div class="card-body">
        <a class="card-category" href="/${post.category_slug}/">${escapeHTML(post.category || post.category_slug)}</a>
        <h2 class="card-title"><a href="${url}">${escapeHTML(post.title)}</a></h2>
        ${excerpt}
        <div class="card-meta">
          <div class="card-meta-row">
            ${date}
            <a class="btn-read-more" href="${url}">
              Read more
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>`;
}

// ── Pagination HTML ────────────────────────────────────────────
function buildPaginationHTML(current, total) {
  if (total <= 1) return "";
  let html = "";

  // Prev
  html += current === 1
    ? `<span class="disabled">← Prev</span>`
    : `<a href="#" data-page="${current - 1}">← Prev</a>`;

  // Pages
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || i === total ||
      (i >= current - 2 && i <= current + 2)
    ) {
      html += i === current
        ? `<span class="active">${i}</span>`
        : `<a href="#" data-page="${i}">${i}</a>`;
    } else if (i === current - 3 || i === current + 3) {
      html += `<span>…</span>`;
    }
  }

  // Next
  html += current === total
    ? `<span class="disabled">Next →</span>`
    : `<a href="#" data-page="${current + 1}">Next →</a>`;

  return html;
}

// ── Mobile Nav ─────────────────────────────────────────────────
function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  // Close on link click
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileNav.classList.remove("open"));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove("open");
    }
  });
}

// ── Helpers ────────────────────────────────────────────────────
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
