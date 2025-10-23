#!/bin/bash

DB_NAME="poll"
DB_USER="polluser"

# Create the database
createdb $DB_NAME

# Create the user
createuser $DB_USER

# Grant privileges to the user on the database
psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Database '$DB_NAME' and user '$DB_USER' created successfully."
