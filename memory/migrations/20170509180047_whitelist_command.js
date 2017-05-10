
exports.up = function(knex) {
	return knex.schema
	.createTable('whitelist_commands', function(table) {
		table.string('command').primary();
		table.integer('level');
	});
};

exports.down = function(knex) {
	return knex.schema
	.dropTable('whitelist_commands');
};
