
exports.up = function(knex) {
	return knex.schema
	.createTable('whitelist_groups', function(table) {
		table.string('groupId').primary();
		table.integer('level');
	});
};

exports.down = function(knex) {
	return knex.schema
	.dropTable('whitelist_groups');
};
