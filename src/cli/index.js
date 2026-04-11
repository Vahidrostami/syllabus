#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.join(__dirname, '../..');

const BANNER = `
  ╔═╗╦ ╦╦  ╦  ╔═╗╔╗ ╦ ╦╔═╗
  ╚═╗╚╦╝║  ║  ╠═╣╠╩╗║ ║╚═╗
  ╚═╝ ╩ ╩═╝╩═╝╩ ╩╚═╝╚═╝╚═╝
  Turn any topic into an interactive tutorial
`;

const program = new Command();

program
  .name('syllabus')
  .description('Agentic education builder for GitHub Copilot & Claude Code')
  .version('0.2.0');

// ─── INIT ───────────────────────────────────────────────────────
program
  .command('init')
  .description('Add Syllabus agents & skills to your project')
  .action(async () => {
    console.log(chalk.hex('#6366f1').bold(BANNER));

    const spinner = ora('Installing Syllabus agents & skills...').start();

    try {
      // Copy agent definitions
      const agentsSrc = path.join(PKG_ROOT, '.github/agents');
      const agentsDst = path.resolve('.github/agents');
      if (await fs.pathExists(agentsSrc)) {
        await fs.copy(agentsSrc, agentsDst, { overwrite: false });
      }

      // Copy skill definitions
      const skillsSrc = path.join(PKG_ROOT, '.github/skills');
      const skillsDst = path.resolve('.github/skills');
      if (await fs.pathExists(skillsSrc)) {
        await fs.copy(skillsSrc, skillsDst, { overwrite: false });
      }

      // Copy copilot instructions
      const copilotSrc = path.join(PKG_ROOT, '.github/copilot-instructions.md');
      const copilotDst = path.resolve('.github/copilot-instructions.md');
      if (await fs.pathExists(copilotSrc)) {
        await fs.copy(copilotSrc, copilotDst, { overwrite: false });
      }

      // Copy CLAUDE.md
      const claudeSrc = path.join(PKG_ROOT, 'CLAUDE.md');
      const claudeDst = path.resolve('CLAUDE.md');
      if (await fs.pathExists(claudeSrc)) {
        await fs.copy(claudeSrc, claudeDst, { overwrite: false });
      }

      spinner.succeed(chalk.green('Syllabus installed!'));

      console.log();
      console.log(chalk.white('  What was added:'));
      console.log();
      console.log(chalk.gray('  .github/'));
      console.log(chalk.gray('  ├── copilot-instructions.md        ← Copilot reads this'));
      console.log(chalk.gray('  ├── agents/'));
      console.log(chalk.cyan('  │   ├── syllabus.agent.md          ← Orchestrator (user-facing)'));
      console.log(chalk.gray('  │   ├── curriculum-architect.agent.md'));
      console.log(chalk.gray('  │   ├── content-reviewer.agent.md'));
      console.log(chalk.gray('  │   ├── lesson-writer.agent.md'));
      console.log(chalk.gray('  │   ├── quiz-master.agent.md'));
      console.log(chalk.gray('  │   ├── ui-designer.agent.md'));
      console.log(chalk.gray('  │   ├── react-developer.agent.md'));
      console.log(chalk.hex('#22d3ee')('  │   ├── narration-engineer.agent.md ← Audio narration'));
      console.log(chalk.gray('  │   ├── quality-auditor.agent.md'));
      console.log(chalk.hex('#22d3ee')('  │   └── deployer.agent.md           ← Auto-deployment'));
      console.log(chalk.gray('  └── skills/'));
      console.log(chalk.gray('      ├── web-research/SKILL.md'));
      console.log(chalk.gray('      ├── syllabus-design/SKILL.md'));
      console.log(chalk.gray('      ├── content-writing/SKILL.md'));
      console.log(chalk.gray('      ├── quiz-generation/SKILL.md'));
      console.log(chalk.gray('      ├── react-coding/SKILL.md'));
      console.log(chalk.gray('      ├── design-system/SKILL.md'));
      console.log(chalk.gray('      ├── progress-tracking/SKILL.md'));
      console.log(chalk.gray('      ├── accessibility/SKILL.md'));
      console.log(chalk.gray('      ├── audit-automation/SKILL.md'));
      console.log(chalk.hex('#22d3ee')('      ├── audio-narration/SKILL.md     ← TTS & audio player'));
      console.log(chalk.hex('#22d3ee')('      └── deployment/SKILL.md          ← Free hosting'));
      console.log(chalk.gray('  CLAUDE.md                          ← Claude Code reads this'));

      console.log();
      console.log(chalk.white.bold('  How to use:'));
      console.log();
      console.log(chalk.white('  In GitHub Copilot (switch to @Syllabus agent):'));
      console.log(chalk.cyan('    "I want to learn fine-tuning SLMs to prepare for interviews"'));
      console.log();
      console.log(chalk.white('  In Claude Code:'));
      console.log(chalk.cyan('    "Build me a tutorial on Kubernetes for backend devs"'));
      console.log();
      console.log(chalk.gray('  That\'s it. @Syllabus orchestrates 6 specialist agents,'));
      console.log(chalk.gray('  researches your topic, and builds a full React tutorial.'));
      console.log();
    } catch (err) {
      spinner.fail(chalk.red('Init failed: ' + err.message));
      process.exit(1);
    }
  });

// ─── EXAMPLES ───────────────────────────────────────────────────
program
  .command('examples')
  .description('Show example prompts you can use in Copilot or Claude Code')
  .action(() => {
    console.log(chalk.hex('#6366f1').bold(BANNER));
    console.log(chalk.white.bold('  Example prompts to try:\n'));

    const examples = [
      { prompt: 'I want to learn fine-tuning SLMs to prepare for job interviews', tags: 'ML · interview-prep' },
      { prompt: 'Teach me Kubernetes from scratch, I\'m a backend dev', tags: 'DevOps · beginner' },
      { prompt: 'Build a hands-on tutorial on React hooks with coding exercises', tags: 'Frontend · hands-on' },
      { prompt: 'I need to understand system design for FAANG interviews', tags: 'Architecture · interview-prep' },
      { prompt: 'Create a project-based course on building a CLI in Rust', tags: 'Rust · project-based' },
      { prompt: 'Help me learn GraphQL — I know REST but not GraphQL', tags: 'API · intermediate' },
    ];

    for (const ex of examples) {
      console.log(chalk.cyan('  > ') + chalk.white(ex.prompt));
      console.log(chalk.gray('    ' + ex.tags));
      console.log();
    }

    console.log(chalk.gray('  Just type any of these in Copilot Agent Mode or Claude Code'));
    console.log(chalk.gray('  after running `syllabus init` in your project.\n'));
  });

// ─── AUDIT ──────────────────────────────────────────────────────
program
  .command('audit')
  .description('Audit the generated tutorial for accessibility, performance, and quality')
  .option('-d, --dir <path>', 'Path to syllabus output directory', 'syllabus-output')
  .option('--fix', 'Automatically fix issues found during audit')
  .option('--report', 'Generate audit-report.json with full results')
  .action(async (opts) => {
    console.log(chalk.hex('#6366f1').bold(BANNER));

    const outputDir = path.resolve(opts.dir);

    if (!await fs.pathExists(outputDir)) {
      console.log(chalk.red(`  ✗ Directory not found: ${outputDir}`));
      console.log(chalk.gray('  Run a tutorial build first, then audit it.'));
      process.exit(1);
    }

    if (!await fs.pathExists(path.join(outputDir, 'package.json'))) {
      console.log(chalk.red(`  ✗ No package.json found in ${outputDir}`));
      console.log(chalk.gray('  This doesn\'t look like a Syllabus tutorial output.'));
      process.exit(1);
    }

    const spinner = ora('Running quality audit...').start();
    const results = { categories: [], totalScore: 0, maxScore: 0, fixes: [] };

    try {
      // ── 1. Build Integrity ─────────────────────────────────────
      spinner.text = 'Checking build integrity...';
      const buildChecks = [];

      // Check package.json has required deps
      const pkgJson = await fs.readJson(path.join(outputDir, 'package.json'));
      const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'framer-motion'];
      const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
      for (const dep of requiredDeps) {
        buildChecks.push({ name: `Dependency: ${dep}`, passed: !!allDeps[dep] });
      }

      // Check no hardcoded localhost in src files
      const srcDir = path.join(outputDir, 'src');
      let hasHardcodedUrls = false;
      if (await fs.pathExists(srcDir)) {
        const srcFiles = await getAllFiles(srcDir, ['.js', '.jsx', '.ts', '.tsx']);
        for (const file of srcFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('localhost:') && !file.includes('vite.config')) {
            hasHardcodedUrls = true;
            if (opts.fix) {
              const fixed = content.replace(/http:\/\/localhost:\d+/g, '');
              await fs.writeFile(file, fixed);
              results.fixes.push({ category: 'Build', file: path.relative(outputDir, file), fix: 'Removed hardcoded localhost URL' });
            }
          }
        }
      }
      buildChecks.push({ name: 'No hardcoded localhost URLs', passed: !hasHardcodedUrls || opts.fix });

      // Check index.html has lang attribute
      const indexHtml = path.join(outputDir, 'index.html');
      if (await fs.pathExists(indexHtml)) {
        const htmlContent = await fs.readFile(indexHtml, 'utf-8');
        const hasLang = /lang=["'][a-z]{2}/.test(htmlContent);
        buildChecks.push({ name: 'HTML lang attribute', passed: hasLang });
        if (!hasLang && opts.fix) {
          const fixed = htmlContent.replace('<html>', '<html lang="en">');
          await fs.writeFile(indexHtml, fixed);
          results.fixes.push({ category: 'Build', file: 'index.html', fix: 'Added lang="en" to <html>' });
          buildChecks[buildChecks.length - 1].passed = true;
        }
      }

      results.categories.push(summarizeCategory('Build Integrity', buildChecks));

      // ── 2. Content Validation ──────────────────────────────────
      spinner.text = 'Validating content...';
      const contentChecks = [];

      const syllabusPath = path.join(outputDir, 'src/data/syllabus.json');
      if (await fs.pathExists(syllabusPath)) {
        const syllabus = await fs.readJson(syllabusPath);
        contentChecks.push({ name: 'syllabus.json valid', passed: true });
        contentChecks.push({ name: 'Has modules', passed: syllabus.modules && syllabus.modules.length > 0 });
        contentChecks.push({ name: 'Has title', passed: !!syllabus.title });
        contentChecks.push({ name: 'Has description', passed: !!syllabus.description });

        // Check lesson files exist
        const lessonsDir = path.join(outputDir, 'src/data/lessons');
        if (await fs.pathExists(lessonsDir)) {
          const lessonFiles = await fs.readdir(lessonsDir);
          contentChecks.push({ name: 'Lesson files present', passed: lessonFiles.length > 0 });
        } else {
          contentChecks.push({ name: 'Lesson files present', passed: false });
        }

        // Check quiz files exist for modules with quizzes
        const quizzesDir = path.join(outputDir, 'src/data/quizzes');
        if (await fs.pathExists(quizzesDir)) {
          const quizFiles = await fs.readdir(quizzesDir);
          const modulesWithQuiz = syllabus.modules.filter(m => m.quiz);
          contentChecks.push({ name: 'Quiz files present', passed: quizFiles.length >= modulesWithQuiz.length });
        } else {
          const hasQuizModules = syllabus.modules.some(m => m.quiz);
          contentChecks.push({ name: 'Quiz files present', passed: !hasQuizModules });
        }
      } else {
        contentChecks.push({ name: 'syllabus.json exists', passed: false });
      }

      results.categories.push(summarizeCategory('Content Validation', contentChecks));

      // ── 3. Accessibility ───────────────────────────────────────
      spinner.text = 'Checking accessibility...';
      const a11yChecks = [];

      if (await fs.pathExists(srcDir)) {
        const srcFiles = await getAllFiles(srcDir, ['.jsx', '.js']);
        let hasSkipLink = false;
        let hasAriaLive = false;
        let hasProgressBar = false;
        let allButtonsLabeled = true;
        let allImagesHaveAlt = true;

        for (const file of srcFiles) {
          const content = await fs.readFile(file, 'utf-8');

          if (content.includes('skip-link') || content.includes('Skip to')) hasSkipLink = true;
          if (content.includes('aria-live')) hasAriaLive = true;
          if (content.includes('role="progressbar"')) hasProgressBar = true;

          // Check for unlabeled icon buttons (simple heuristic)
          const iconButtonRegex = /<button[^>]*>[\s]*<[A-Z]\w+[^>]*\/?>[\s]*<\/button>/g;
          const iconButtons = content.match(iconButtonRegex) || [];
          for (const btn of iconButtons) {
            if (!btn.includes('aria-label')) {
              allButtonsLabeled = false;
            }
          }

          // Check for images without alt
          const imgRegex = /<img[^>]*>/g;
          const imgs = content.match(imgRegex) || [];
          for (const img of imgs) {
            if (!img.includes('alt=') && !img.includes('alt =')) {
              allImagesHaveAlt = false;
            }
          }
        }

        a11yChecks.push({ name: 'Skip-to-content link', passed: hasSkipLink });
        a11yChecks.push({ name: 'ARIA live regions', passed: hasAriaLive });
        a11yChecks.push({ name: 'Progress bar roles', passed: hasProgressBar });
        a11yChecks.push({ name: 'Buttons have labels', passed: allButtonsLabeled });
        a11yChecks.push({ name: 'Images have alt text', passed: allImagesHaveAlt });

        // Check focus styles
        const cssFiles = await getAllFiles(srcDir, ['.css']);
        let hasFocusStyles = false;
        for (const file of cssFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('focus-visible') || content.includes(':focus')) {
            hasFocusStyles = true;
          }
        }
        a11yChecks.push({ name: 'Focus indicators', passed: hasFocusStyles });

        // Check reduced motion
        let hasReducedMotion = false;
        for (const file of cssFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('prefers-reduced-motion')) {
            hasReducedMotion = true;
          }
        }
        a11yChecks.push({ name: 'Reduced motion support', passed: hasReducedMotion });
      }

      results.categories.push(summarizeCategory('Accessibility', a11yChecks));

      // ── 4. Responsive ──────────────────────────────────────────
      spinner.text = 'Checking responsive design...';
      const responsiveChecks = [];

      if (await fs.pathExists(srcDir)) {
        const allSrcFiles = await getAllFiles(srcDir, ['.jsx', '.js', '.css']);
        let hasMediaQuery = false;
        let hasOverflowX = false;
        let hasFlexWrap = false;

        for (const file of allSrcFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('@media') || content.includes('useMediaQuery') || content.includes('max-w-')) hasMediaQuery = true;
          if (content.includes('overflow-x') || content.includes('overflow-auto')) hasOverflowX = true;
          if (content.includes('flex-wrap') || content.includes('flex wrap')) hasFlexWrap = true;
        }

        responsiveChecks.push({ name: 'Responsive breakpoints', passed: hasMediaQuery });
        responsiveChecks.push({ name: 'Code block overflow handling', passed: hasOverflowX });
        responsiveChecks.push({ name: 'Flexible layouts (flex-wrap)', passed: hasFlexWrap });
      }

      results.categories.push(summarizeCategory('Responsive Layout', responsiveChecks));

      // ── 5. Routes ──────────────────────────────────────────────
      spinner.text = 'Checking routes...';
      const routeChecks = [];

      if (await fs.pathExists(srcDir)) {
        const jsxFiles = await getAllFiles(srcDir, ['.jsx', '.js']);
        let hasRoutes = false;
        let hasErrorBoundary = false;

        for (const file of jsxFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('<Route') || content.includes('Routes')) hasRoutes = true;
          if (content.includes('ErrorBoundary') || content.includes('getDerivedStateFromError') || content.includes('componentDidCatch')) hasErrorBoundary = true;
        }

        routeChecks.push({ name: 'Routes defined', passed: hasRoutes });
        routeChecks.push({ name: 'Error boundary', passed: hasErrorBoundary });
      }

      results.categories.push(summarizeCategory('Routes & Navigation', routeChecks));

      // ── 6. Visual Effects ──────────────────────────────────────
      spinner.text = 'Checking visual effects...';
      const visualChecks = [];

      if (await fs.pathExists(srcDir)) {
        const allFiles = await getAllFiles(srcDir, ['.jsx', '.js', '.css']);
        let hasMeshBg = false;
        let hasGlass = false;
        let hasGradientText = false;
        let hasAnimations = false;

        for (const file of allFiles) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('mesh-bg') || content.includes('mesh_bg') || content.includes('radial-gradient')) hasMeshBg = true;
          if (content.includes('glass') || content.includes('backdrop-filter') || content.includes('backdropFilter')) hasGlass = true;
          if (content.includes('gradient-text') || content.includes('background-clip: text') || content.includes('backgroundClip')) hasGradientText = true;
          if (content.includes('framer-motion') || content.includes('motion.') || content.includes('AnimatePresence')) hasAnimations = true;
        }

        visualChecks.push({ name: 'Mesh gradient background', passed: hasMeshBg });
        visualChecks.push({ name: 'Glassmorphism effects', passed: hasGlass });
        visualChecks.push({ name: 'Gradient text headings', passed: hasGradientText });
        visualChecks.push({ name: 'Framer Motion animations', passed: hasAnimations });
      }

      results.categories.push(summarizeCategory('Visual Effects', visualChecks));

      // ── Summary ────────────────────────────────────────────────
      spinner.stop();

      let totalPassed = 0;
      let totalChecks = 0;
      console.log();
      console.log(chalk.white.bold('  🔍 Quality Audit Results\n'));

      for (const cat of results.categories) {
        totalPassed += cat.passed;
        totalChecks += cat.total;
        const icon = cat.passed === cat.total ? chalk.green('✅') : cat.passed >= cat.total * 0.7 ? chalk.yellow('⚠️') : chalk.red('✗');
        const counts = chalk.gray(`${cat.passed}/${cat.total}`);
        const failures = cat.failures.length > 0 ? chalk.red(` (${cat.failures.join(', ')})`) : '';
        console.log(`  ${icon} ${chalk.white(cat.name.padEnd(22))} ${counts}${failures}`);
      }

      const score = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
      console.log();
      console.log(chalk.white.bold(`  Score: ${score}/100`));

      if (results.fixes.length > 0) {
        console.log();
        console.log(chalk.white.bold('  Auto-fixed:'));
        for (const fix of results.fixes) {
          console.log(chalk.green(`  • ${fix.fix}`) + chalk.gray(` (${fix.file})`));
        }
      }

      if (score < 100) {
        console.log();
        console.log(chalk.gray('  Run with --fix to auto-fix common issues.'));
      }

      console.log();

      // Write report if requested
      if (opts.report) {
        const reportPath = path.join(outputDir, 'audit-report.json');
        await fs.writeJson(reportPath, { ...results, score, timestamp: new Date().toISOString() }, { spaces: 2 });
        console.log(chalk.gray(`  Report saved to ${reportPath}\n`));
      }

      process.exit(score >= 70 ? 0 : 1);

    } catch (err) {
      spinner.fail(chalk.red('Audit failed: ' + err.message));
      process.exit(1);
    }
  });

// ─── HELPERS ────────────────────────────────────────────────────

async function getAllFiles(dir, extensions) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function summarizeCategory(name, checks) {
  const passed = checks.filter(c => c.passed).length;
  const failures = checks.filter(c => !c.passed).map(c => c.name);
  return { name, passed, total: checks.length, failures };
}

program.parse();
