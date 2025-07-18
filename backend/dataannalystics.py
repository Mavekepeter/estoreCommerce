from pymongo import MongoClient
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# --- MongoDB Setup ---
MONGO_URI = "mongodb+srv://mavekepeter2022:1234@cluster0.itavc.mongodb.net/estoredb?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "estoredb"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# --- Load Data ---
users_df = pd.DataFrame(list(db.users.find()))
products_df = pd.DataFrame(list(db.products.find()))
orders_df = pd.DataFrame(list(db.orders.find()))
orders_df['createdAt'] = pd.to_datetime(orders_df['createdAt'])

# --- Function: Daily Sales ---
def get_daily_sales(start_date, end_date):
    mask = (orders_df['createdAt'] >= start_date) & (orders_df['createdAt'] <= end_date)
    filtered = orders_df.loc[mask]

    daily_summary = (
        filtered.groupby(filtered['createdAt'].dt.date)
        .agg(Sales=('totalAmount', 'count'), Revenue=('totalAmount', 'sum'))
        .reset_index()
        .rename(columns={'createdAt': 'Date'})
    )

    all_dates = pd.date_range(start=start_date, end=end_date).date
    daily_summary = pd.DataFrame({'Date': all_dates}).merge(
        daily_summary, on='Date', how='left'
    ).fillna({'Sales': 0, 'Revenue': 0})

    return daily_summary

# --- Visualization 1: Daily Orders ---
start_date = datetime(2024, 8, 1)
end_date = datetime(2024, 8, 7)
daily_df = get_daily_sales(start_date, end_date)

plt.figure(figsize=(14, 6))
sns.set_style("whitegrid")
plt.subplot(1, 3, 1)
plt.plot(daily_df['Date'], daily_df['Revenue'], marker='o', label='Revenue (KSh)', color='green')
plt.bar(daily_df['Date'], daily_df['Sales'], alpha=0.4, label='Sales Count', color='blue')
plt.title("🧾 Daily Orders & Revenue")
plt.xlabel("Date")
plt.xticks(rotation=45)
plt.ylabel("Amount / Sales")
plt.legend()

# --- Visualization 2: Products per Category ---
plt.subplot(1, 3, 2)
if 'category' in products_df.columns:
    category_counts = products_df['category'].value_counts()
    sns.barplot(x=category_counts.index, y=category_counts.values, palette='muted')
    plt.title("📦 Products by Category")
    plt.xlabel("Category")
    plt.ylabel("Count")
    plt.xticks(rotation=45)
else:
    plt.text(0.5, 0.5, "No 'category' field in products", ha='center')

plt.subplot(1, 3, 3)
if 'gender' in users_df.columns:
    gender_counts = users_df['gender'].value_counts()
    plt.pie(gender_counts, labels=gender_counts.index, autopct='%1.1f%%', startangle=140)
    plt.title("👤 Users by Gender")
else:
    plt.text(0.5, 0.5, "No 'gender' field in users", ha='center')

plt.tight_layout()
plt.show()
