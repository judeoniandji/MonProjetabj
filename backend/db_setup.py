#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import subprocess
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Load environment variables
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
env_file = os.path.join(basedir, '.env')

try:
    load_dotenv(env_file)
    print("Environment variables loaded from .env file")
except Exception as e:
    print(f"Warning: Could not load .env file: {e}")

def get_db_params():
    """Get database connection parameters from environment variables"""
    db_url = os.environ.get('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/campusconnect')
    
    # Parse database URL
    # Expected format: postgresql://user:password@host:port/dbname
    try:
        if '://' in db_url:
            # Remove the postgresql:// prefix
            db_url = db_url.split('://', 1)[1]
        
        # Split authentication info from host part
        if '@' in db_url:
            auth, host_part = db_url.split('@', 1)
            # Extract user and password
            if ':' in auth:
                user, password = auth.split(':', 1)
            else:
                user, password = auth, ''
        else:
            user, password = 'postgres', 'password'
            host_part = db_url
        
        # Extract host, port and database name
        if '/' in host_part:
            host_port, dbname = host_part.split('/', 1)
            # Extract host and port
            if ':' in host_port:
                host, port = host_port.split(':', 1)
                port = int(port)
            else:
                host, port = host_port, 5432
        else:
            host, port = host_part, 5432
            dbname = 'campusconnect'
        
        return {
            'dbname': dbname,
            'user': user,
            'password': password,
            'host': host,
            'port': port
        }
    except Exception as e:
        print(f"Error parsing database URL: {e}")
        print("Using default parameters")
        return {
            'dbname': 'campusconnect',
            'user': 'postgres',
            'password': 'password',
            'host': 'localhost',
            'port': 5432
        }

def check_postgres():
    """Check if PostgreSQL is installed and running"""
    try:
        # Try to connect to the default postgres database
        params = get_db_params()
        params['dbname'] = 'postgres'  # Connect to default database first
        
        conn = psycopg2.connect(**params)
        conn.close()
        print("PostgreSQL is running and accessible.")
        return True
    except psycopg2.OperationalError:
        print("PostgreSQL is not running or credentials are incorrect.")
        return False
    except Exception as e:
        print(f"Error checking PostgreSQL: {e}")
        return False

def create_database():
    """Create the PostgreSQL database if it doesn't exist"""
    params = get_db_params()
    dbname = params.pop('dbname')
    
    print(f"Attempting to connect to PostgreSQL on {params['host']}:{params['port']} with user {params['user']}")
    
    try:
        # Connect to the default postgres database
        conn = psycopg2.connect(dbname='postgres', **params)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database already exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
        exists = cursor.fetchone()
        
        if exists:
            print(f"Database '{dbname}' already exists.")
        else:
            # Create the database
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))
            print(f"Database '{dbname}' created successfully.")
        
        cursor.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        print(f"PostgreSQL Error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def init_database():
    """Initialize the database with Flask-Migrate"""
    print("\n=== Initializing database with Flask-Migrate ===")
    
    try:
        # Change to the project root directory
        os.chdir(basedir)
        
        # Set environment variables for Flask
        os.environ['FLASK_APP'] = 'run.py'
        
        # Initialize migrations directory if it doesn't exist
        migrations_dir = os.path.join(basedir, 'migrations')
        if not os.path.exists(migrations_dir):
            print("Initializing migrations directory...")
            subprocess.run([sys.executable, '-m', 'flask', 'db', 'init'], check=True)
            print("Migrations directory created.")
        
        # Generate migration
        print("Generating migration...")
        subprocess.run([sys.executable, '-m', 'flask', 'db', 'migrate', '-m', "Initial migration"], check=True)
        
        # Apply migration
        print("Applying migration...")
        subprocess.run([sys.executable, '-m', 'flask', 'db', 'upgrade'], check=True)
        
        print("Database initialized successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error during database initialization: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def main():
    """Main function to set up the database"""
    print("=== PostgreSQL Database Setup ===")
    
    # Check if PostgreSQL is running
    if not check_postgres():
        print("Please install and start PostgreSQL before continuing.")
        sys.exit(1)
    
    # Create the database
    if not create_database():
        print("Failed to create database.")
        sys.exit(1)
    
    # Initialize the database with Flask-Migrate
    if not init_database():
        print("Failed to initialize database.")
        sys.exit(1)
    
    print("\n=== Database setup completed successfully! ===")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
