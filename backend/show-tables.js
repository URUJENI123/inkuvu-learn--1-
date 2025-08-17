import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showTables() {
  try {
    console.log(' Database Tables:');
    console.log('==================');
    
    // Get all table names from SQLite
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `;
    
    console.log('\nTables found:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.name}`);
    });
    
    console.log(`\nTotal tables: ${tables.length}`);
    
    // Show table schemas
    for (const table of tables) {
      console.log(`\n ${table.name}:`);
      const schema = await prisma.$queryRawUnsafe(
        `PRAGMA table_info(${table.name});`
      );
      
      schema.forEach(col => {
        console.log(`   - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showTables();
