import psycopg2

conn = psycopg2.connect(host='localhost', dbname='postgres', user='postgres')
conn.autocommit = True
cur = conn.cursor()

cur.execute("SELECT 1 FROM pg_database WHERE datname = 'complaints_db'")
if not cur.fetchone():
    cur.execute("CREATE DATABASE complaints_db")
    print("Created database: complaints_db")
else:
    print("Database complaints_db already exists")

cur.close()
conn.close()



