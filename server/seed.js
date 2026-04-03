/**
 * Seed script — run once to populate default categories.
 * Usage:  node server/seed.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

const { Category } = require("./models/index");

const DEFAULT_CATEGORIES = [
  { name: "Web Development",      description: "HTML, CSS, JavaScript, React, Node.js and more",    icon: "🌐" },
  { name: "Mobile Development",   description: "iOS, Android, React Native, Flutter",               icon: "📱" },
  { name: "Data Science",         description: "Python, Machine Learning, Data Analysis, AI",        icon: "📊" },
  { name: "Cloud Computing",      description: "AWS, Azure, GCP, DevOps, Docker, Kubernetes",       icon: "☁️" },
  { name: "Cybersecurity",        description: "Ethical hacking, Network security, Cryptography",   icon: "🔒" },
  { name: "Database",             description: "SQL, MongoDB, PostgreSQL, Redis, Firebase",         icon: "🗄️" },
  { name: "UI-UX Design",          description: "Figma, Adobe XD, user research, prototyping",       icon: "🎨" },
  { name: "Game Development",     description: "Unity, Unreal Engine, 2D/3D game design",           icon: "🎮" },
  { name: "DevOps",               description: "CI/CD, Jenkins, Terraform, infrastructure as code", icon: "⚙️" },
  { name: "Business & Finance",   description: "Entrepreneurship, investing, accounting, marketing", icon: "💼" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const cat of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name: cat.name });
    if (exists) {
      console.log(`  skip  "${cat.name}" (already exists)`);
      skipped++;
    } else {
      await Category.create(cat);
      console.log(`  added "${cat.name}"`);
      created++;
    }
  }

  console.log(`\nDone — ${created} added, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
