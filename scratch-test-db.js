const { Client } = require('pg');

const passwords = ['postgrespassword', 'postgres', 'admin', 'root', '123', ''];

async function test() {
  for (const pw of passwords) {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres', // fallback database that always exists
      password: pw,
      port: 5432,
    });
    try {
      await client.connect();
      console.log(`SUCCESS: Password is "${pw}"`);
      await client.end();
      return;
    } catch (err) {
      if (err.message.includes('password authentication failed')) {
        console.log(`FAILED: Password "${pw}" - authentication failed`);
      } else {
        console.log(`FAILED: Password "${pw}" - ${err.message}`);
      }
    }
  }
}
test();
