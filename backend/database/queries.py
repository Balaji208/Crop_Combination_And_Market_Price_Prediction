from db_connection import get_connection

def fetch_data():
    """Fetches data from the database."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM guru;")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    cursor.close()
    conn.close()

def insert_data(value1, value2):
    """Inserts data into the database."""
    conn = get_connection()
    cursor = conn.cursor()

    query = "INSERT INTO guru VALUES (%s, %s)"
    cursor.execute(query, (value1, value2))
    conn.commit()

    print("Data inserted successfully!")

    cursor.close()
    conn.close()
