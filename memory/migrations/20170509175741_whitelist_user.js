
exports.up = function(knex) {
	return knex.schema
	.createTable('whitelist_users', function(table) {
		table.increments('id').primary();
		table.string('chatId');
		table.integer('level');
	});
};

exports.down = function(knex) {
	return knex.schema
	.dropTable('whitelist_users');
};
