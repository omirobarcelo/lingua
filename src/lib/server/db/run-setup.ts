import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const phase = process.argv[2]; // 'fts' or 'trigger'

if (!phase || !['fts', 'trigger'].includes(phase)) {
	console.error('Usage: tsx run-setup.ts <fts|trigger>');
	process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL!);
const file = phase === 'fts' ? 'setup-fts.sql' : 'setup-trigger.sql';
const setupSql = readFileSync(join(dir, file), 'utf8');
await sql.unsafe(setupSql);
console.log(`DB setup (${phase}) complete`);
await sql.end();
