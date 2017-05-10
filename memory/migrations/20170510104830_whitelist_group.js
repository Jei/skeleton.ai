
exports.up = function(knex) {
	return knex.schema
	.createTable('whitelist_groups', function(table) {
		table.increments('id').primary();
		table.string('groupId');
		table.integer('level');
	});
};

exports.down = function(knex) {
	return knex.schema
	.dropTable('whitelist_groups');
};