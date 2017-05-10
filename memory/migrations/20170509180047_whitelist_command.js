
exports.up = function(knex) {
	return knex.schema
	.createTable('whitelist_commands', function(table) {
		table.increments('id').primary();
		table.string('command');
		table.integer('level');
	});
};

exports.down = function(knex) {
	return knex.schema
	.dropTable('whitelist_commands');
};
