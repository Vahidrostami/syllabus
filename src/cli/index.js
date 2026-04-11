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
      console.log(chalk.gray('  │   └── react-developer.agent.md'));
      console.log(chalk.gray('  └── skills/'));
      console.log(chalk.gray('      ├── web-research/SKILL.md'));
      console.log(chalk.gray('      ├── syllabus-design/SKILL.md'));
      console.log(chalk.gray('      ├── content-writing/SKILL.md'));
      console.log(chalk.gray('      ├── quiz-generation/SKILL.md'));
      console.log(chalk.gray('      ├── react-coding/SKILL.md'));
      console.log(chalk.gray('      ├── design-system/SKILL.md'));
      console.log(chalk.gray('      ├── progress-tracking/SKILL.md'));
      console.log(chalk.gray('      └── accessibility/SKILL.md'));
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

program.parse();
