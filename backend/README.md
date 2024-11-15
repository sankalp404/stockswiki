# stockswiki-backend
Backend for stockswiki.chat

# Drop the existing database
npx sequelize-cli db:drop

# Create the database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# Seed the database with dummy data
npx sequelize-cli db:seed:all
