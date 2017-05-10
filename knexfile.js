// Update with your config settings.

module.exports = {

	development: {
		client: 'sqlite3',
		connection: {
			filename: './memory/dev.sqlite3'
		},
		migrations: {
			directory: './memory/migrations/',
			tableName: 'knex_migrations'
		},
		useNullAsDefault: true
	},

	staging: {
		client: 'sqlite3',
		connection: {
			filename: './memory/stage.sqlite3'
		},
		migrations: {
			directory: './memory/migrations/',
			tableName: 'knex_migrations'
		},
		useNullAsDefault: true
	},

	production: {
		client: 'sqlite3',
		connection: {
			filename: './memory/prod.sqlite3'
		},
		migrations: {
			directory: './memory/migrations/',
			tableName: 'knex_migrations'
		},
		useNullAsDefault: true
	}

};
