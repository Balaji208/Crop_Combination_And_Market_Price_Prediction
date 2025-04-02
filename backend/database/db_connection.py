import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='balaji@06',  
            database='croprecommendation'
        )
        return connection
    except Error as err:
        print(f"Database Connection Error: {err}")
        return None

# Optional: Function to close connection
def close_db_connection(connection, cursor=None):
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()