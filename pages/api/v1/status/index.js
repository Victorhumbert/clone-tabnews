import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();
  const maxConections = await database.query("SHOW max_connections;");
  const postgresVersion = await database.query("SHOW server_version;");

  const databaseName = process.env.POSTGRES_DB;
  const usedConections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  response.status(200).send({
    update_at: updateAt,
    dependencies: {
      database: {
        version: postgresVersion.rows[0].server_version,
        max_connections: +maxConections.rows[0].max_connections,
        opened_connections: usedConections.rows[0].count,
      },
    },
  });
}
export default status;
