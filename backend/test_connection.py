from db.database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful")
except Exception as e:
    print(f"Connection failed: {e}")