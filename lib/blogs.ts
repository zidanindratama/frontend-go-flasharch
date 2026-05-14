export type BlogCategory = {
  id: string;
  name: string;
  description: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  featured?: boolean;
  html: string;
};

export const blogCategories: BlogCategory[] = [
  {
    id: "shopping-guide",
    name: "Shopping Guide",
    description: "Simple help for choosing, comparing, and checking out.",
  },
  {
    id: "flash-sale-tips",
    name: "Flash Sale Tips",
    description: "Prep habits for busy drops and limited stock moments.",
  },
  {
    id: "buyer-safety",
    name: "Buyer Safety",
    description: "Account, password, and order clarity for shoppers.",
  },
  {
    id: "product-picks",
    name: "Product Picks",
    description: "Curated tech ideas before the next sale starts.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "post-001",
    slug: "how-to-prepare-for-a-flash-sale",
    title: "How to prepare before a flash sale starts",
    excerpt:
      "A calm checklist for signing in early, picking products, and moving faster when limited deals open.",
    categoryId: "flash-sale-tips",
    author: "Go FlashArch Team",
    publishedAt: "2026-05-12",
    readMinutes: 4,
    featured: true,
    html: `
      <p>Flash sales move quickly, but shopping does not need to feel rushed. The goal is to remove small decisions before the timer hits zero.</p>
      <h2>Before the drop</h2>
      <ul>
        <li>Sign in before the sale starts.</li>
        <li>Check your email is verified.</li>
        <li>Open the products you care about most.</li>
        <li>Decide your backup option if the first item sells out.</li>
      </ul>
      <h2>Simple order of action</h2>
      <ol>
        <li>Open the active drop page.</li>
        <li>Pick the product with visible stock.</li>
        <li>Move to checkout while the item is still available.</li>
        <li>Watch the order status after checkout.</li>
      </ol>
      <h2>Quick comparison</h2>
      <table>
        <thead>
          <tr><th>Before sale</th><th>During sale</th><th>After checkout</th></tr>
        </thead>
        <tbody>
          <tr><td>Sign in</td><td>Claim item</td><td>Check status</td></tr>
          <tr><td>Pick favorites</td><td>Move fast</td><td>Save order number</td></tr>
        </tbody>
      </table>
      <blockquote>Good prep turns a crowded sale into a clear shopping flow.</blockquote>
    `,
  },
  {
    id: "post-002",
    slug: "why-clear-stock-matters",
    title: "Why clear stock matters when deals move fast",
    excerpt:
      "Visible stock helps shoppers decide quickly and reduces the frustration of trying to buy an item that is already gone.",
    categoryId: "shopping-guide",
    author: "Go FlashArch Team",
    publishedAt: "2026-05-09",
    readMinutes: 3,
    featured: true,
    html: `
      <p>Clear stock is not only a number. It tells you whether a product is worth acting on now or whether you should move to another choice.</p>
      <h2>What clear stock helps with</h2>
      <ul>
        <li>Deciding faster without opening too many tabs.</li>
        <li>Avoiding products that are nearly gone.</li>
        <li>Knowing when a backup option is smarter.</li>
      </ul>
      <h2>Stock labels shoppers can trust</h2>
      <table>
        <thead>
          <tr><th>Label</th><th>Meaning</th><th>Best action</th></tr>
        </thead>
        <tbody>
          <tr><td>In Stock</td><td>Still available</td><td>Compare calmly</td></tr>
          <tr><td>Limited</td><td>Running low</td><td>Act quickly</td></tr>
          <tr><td>Sold Out</td><td>No longer available</td><td>Choose backup</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "post-003",
    slug: "sign-in-before-checkout",
    title: "Why signing in before checkout saves time",
    excerpt:
      "Signing in early keeps the sale focused on the product, not account setup, password reset, or email verification.",
    categoryId: "buyer-safety",
    author: "Go FlashArch Team",
    publishedAt: "2026-05-07",
    readMinutes: 5,
    html: `
      <p>During a flash sale, every extra step feels bigger. Signing in before the drop keeps checkout focused.</p>
      <h2>What to finish early</h2>
      <ol>
        <li>Create your account.</li>
        <li>Verify your email.</li>
        <li>Save your password somewhere safe.</li>
        <li>Open the sale page before the timer ends.</li>
      </ol>
      <h2>Account checklist</h2>
      <ul>
        <li>Your email is correct.</li>
        <li>Your password is ready.</li>
        <li>You know where to find order status.</li>
      </ul>
    `,
  },
  {
    id: "post-004",
    slug: "best-tech-deals-to-watch",
    title: "Tech deals worth watching this week",
    excerpt:
      "A practical shortlist of categories that usually sell fast: storage, audio, keyboards, and wearables.",
    categoryId: "product-picks",
    author: "Go FlashArch Team",
    publishedAt: "2026-05-04",
    readMinutes: 4,
    featured: true,
    html: `
      <p>The best deal is not always the biggest discount. It is the product you will actually use after the sale ends.</p>
      <h2>Categories to watch</h2>
      <ul>
        <li>Portable SSDs for school, work, and backups.</li>
        <li>Wireless earbuds for daily use.</li>
        <li>Mechanical keyboards for desk upgrades.</li>
        <li>Smart watches for fitness and notifications.</li>
      </ul>
      <h2>How to compare quickly</h2>
      <table>
        <thead>
          <tr><th>Category</th><th>Check first</th><th>Good sign</th></tr>
        </thead>
        <tbody>
          <tr><td>Storage</td><td>Capacity</td><td>Enough space for 2 years</td></tr>
          <tr><td>Audio</td><td>Battery</td><td>All-day listening</td></tr>
          <tr><td>Keyboard</td><td>Layout</td><td>Comfortable daily typing</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "post-005",
    slug: "what-to-do-after-checkout",
    title: "What to do right after checkout",
    excerpt:
      "Do not refresh randomly. Check the order status, save the order number, and wait for the next clear update.",
    categoryId: "shopping-guide",
    author: "Go FlashArch Team",
    publishedAt: "2026-04-30",
    readMinutes: 3,
    html: `
      <p>After checkout, the best next step is to follow the order status. It tells you what happened without guessing.</p>
      <h2>After-checkout checklist</h2>
      <ol>
        <li>Read the status message.</li>
        <li>Save your order number.</li>
        <li>Check your order page if you need updates.</li>
      </ol>
      <blockquote>If a sale is busy, a clear status is more helpful than refreshing the page again and again.</blockquote>
    `,
  },
  {
    id: "post-006",
    slug: "how-to-pick-a-backup-item",
    title: "How to pick a smart backup item",
    excerpt:
      "Backup choices make limited drops less stressful, especially when your first choice sells out quickly.",
    categoryId: "flash-sale-tips",
    author: "Go FlashArch Team",
    publishedAt: "2026-04-28",
    readMinutes: 4,
    html: `
      <p>A backup item keeps you from starting over when your first pick is gone.</p>
      <h2>Good backup rules</h2>
      <ul>
        <li>Pick the same category if possible.</li>
        <li>Stay near your budget.</li>
        <li>Choose a product you would still enjoy using.</li>
      </ul>
      <h2>Backup example</h2>
      <table>
        <thead>
          <tr><th>First choice</th><th>Backup</th><th>Reason</th></tr>
        </thead>
        <tbody>
          <tr><td>1TB SSD</td><td>2TB SSD</td><td>More storage, same use</td></tr>
          <tr><td>Earbuds Pro</td><td>Earbuds Lite</td><td>Similar daily use</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "post-007",
    slug: "password-reset-before-sale",
    title: "Forgot your password? Reset it before the drop",
    excerpt:
      "A password reset during a live sale can cost time. Handle it early and return to shopping calmly.",
    categoryId: "buyer-safety",
    author: "Go FlashArch Team",
    publishedAt: "2026-04-24",
    readMinutes: 3,
    html: `
      <p>Password issues are easier before a sale begins. If you are not sure, reset early.</p>
      <h2>Reset early if</h2>
      <ul>
        <li>You have not signed in for a while.</li>
        <li>You use a different device.</li>
        <li>You are unsure which email you used.</li>
      </ul>
      <h2>Fast recovery steps</h2>
      <ol>
        <li>Open forgot password.</li>
        <li>Enter your email.</li>
        <li>Use the reset code.</li>
        <li>Sign in again before shopping.</li>
      </ol>
    `,
  },
  {
    id: "post-008",
    slug: "shopping-with-less-stress",
    title: "How to shop limited deals with less stress",
    excerpt:
      "A calmer shopping plan helps you avoid panic clicks and focus on the products you actually want.",
    categoryId: "shopping-guide",
    author: "Go FlashArch Team",
    publishedAt: "2026-04-20",
    readMinutes: 5,
    html: `
      <p>Limited deals can feel intense. A small plan helps you shop with better decisions.</p>
      <h2>Keep it simple</h2>
      <ul>
        <li>Set a budget before opening the sale.</li>
        <li>Pick two or three products, not ten.</li>
        <li>Use stock labels to decide quickly.</li>
      </ul>
      <h2>Stress reducers</h2>
      <table>
        <thead>
          <tr><th>Problem</th><th>Better habit</th></tr>
        </thead>
        <tbody>
          <tr><td>Too many choices</td><td>Pick favorites first</td></tr>
          <tr><td>Fear of missing out</td><td>Set a budget</td></tr>
          <tr><td>Unclear result</td><td>Check order status</td></tr>
        </tbody>
      </table>
    `,
  },
];

export function getBlogCategory(categoryId: string) {
  return blogCategories.find((category) => category.id === categoryId);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return blogPosts
    .filter((item) => item.id !== post.id && item.categoryId === post.categoryId)
    .concat(blogPosts.filter((item) => item.id !== post.id))
    .filter((item, index, list) => list.findIndex((p) => p.id === item.id) === index)
    .slice(0, limit);
}
