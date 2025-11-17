"""
Seed database with sample data for demo
"""

from app import app, db, bcrypt
from models import User, Listing, QAPost
from datetime import datetime, timedelta

def seed_database():
    with app.app_context():
        # Create tables if they don't exist
        print("Creating database tables...")
        db.create_all()

        # Clear existing data
        print("Clearing existing data...")
        QAPost.query.delete()
        Listing.query.delete()
        User.query.delete()
        db.session.commit()

        # Create sample users
        print("Creating sample users...")

        # Farmers
        farmer1_password = bcrypt.generate_password_hash('farmer123').decode('utf-8')
        farmer1 = User(
            username='rajesh_farmer',
            password_hash=farmer1_password,
            role='farmer',
            display_name='Rajesh Kumar',
            location='Pune, Maharashtra',
            contact_info='+91-9876543210'
        )

        farmer2_password = bcrypt.generate_password_hash('farmer123').decode('utf-8')
        farmer2 = User(
            username='priya_farms',
            password_hash=farmer2_password,
            role='farmer',
            display_name='Priya Patel',
            location='Ahmedabad, Gujarat',
            contact_info='+91-9876543211'
        )

        farmer3_password = bcrypt.generate_password_hash('farmer123').decode('utf-8')
        farmer3 = User(
            username='suresh_agro',
            password_hash=farmer3_password,
            role='farmer',
            display_name='Suresh Reddy',
            location='Hyderabad, Telangana',
            contact_info='+91-9876543212'
        )

        # Clients
        client1_password = bcrypt.generate_password_hash('client123').decode('utf-8')
        client1 = User(
            username='anil_trader',
            password_hash=client1_password,
            role='client',
            display_name='Anil Sharma',
            location='Mumbai, Maharashtra',
            contact_info='+91-9876543220'
        )

        client2_password = bcrypt.generate_password_hash('client123').decode('utf-8')
        client2 = User(
            username='neha_wholesale',
            password_hash=client2_password,
            role='client',
            display_name='Neha Gupta',
            location='Delhi, NCR',
            contact_info='+91-9876543221'
        )

        db.session.add_all([farmer1, farmer2, farmer3, client1, client2])
        db.session.commit()

        # Create sample listings
        print("Creating sample listings...")

        listings = [
            Listing(
                farmer_id=farmer1.id,
                crop_name='Rice',
                variety='Basmati',
                quality='Grade A',
                price=2500.00,
                quantity=1000,
                unit='kg',
                location='Pune, Maharashtra',
                harvest_date=datetime.now().date() + timedelta(days=15),
                description='Premium quality Basmati rice. Organic farming methods used. Ready for harvest in 15 days.'
            ),
            Listing(
                farmer_id=farmer1.id,
                crop_name='Wheat',
                variety='Lokwan',
                quality='Grade A',
                price=2200.00,
                quantity=2000,
                unit='kg',
                location='Pune, Maharashtra',
                harvest_date=datetime.now().date() + timedelta(days=30),
                description='High-quality wheat suitable for making atta. Grown with minimal pesticides.'
            ),
            Listing(
                farmer_id=farmer2.id,
                crop_name='Cotton',
                variety='BT Cotton',
                quality='Grade B',
                price=5000.00,
                quantity=500,
                unit='kg',
                location='Ahmedabad, Gujarat',
                harvest_date=datetime.now().date() + timedelta(days=45),
                description='BT Cotton with good fiber quality. Suitable for textile industry.'
            ),
            Listing(
                farmer_id=farmer2.id,
                crop_name='Groundnut',
                variety='TMV-2',
                quality='Grade A',
                price=4500.00,
                quantity=750,
                unit='kg',
                location='Ahmedabad, Gujarat',
                harvest_date=datetime.now().date() + timedelta(days=20),
                description='High oil content groundnut. Good for oil extraction and direct consumption.'
            ),
            Listing(
                farmer_id=farmer3.id,
                crop_name='Tomato',
                variety='Hybrid',
                quality='Grade A',
                price=30.00,
                quantity=5000,
                unit='kg',
                location='Hyderabad, Telangana',
                harvest_date=datetime.now().date() + timedelta(days=7),
                description='Fresh hybrid tomatoes. Ideal for both cooking and salads. Ready for immediate sale.'
            ),
            Listing(
                farmer_id=farmer3.id,
                crop_name='Onion',
                variety='Red Onion',
                quality='Grade B',
                price=25.00,
                quantity=3000,
                unit='kg',
                location='Hyderabad, Telangana',
                harvest_date=datetime.now().date() + timedelta(days=10),
                description='Red onions with good storage life. Bulk quantities available.'
            ),
            Listing(
                farmer_id=farmer1.id,
                crop_name='Sugarcane',
                variety='Co-86032',
                quality='Grade A',
                price=2800.00,
                quantity=10000,
                unit='kg',
                location='Pune, Maharashtra',
                harvest_date=datetime.now().date() + timedelta(days=60),
                description='High-yielding sugarcane variety. Good sucrose content. Suitable for sugar mills.'
            ),
            Listing(
                farmer_id=farmer2.id,
                crop_name='Maize',
                variety='Sweet Corn',
                quality='Grade A',
                price=1800.00,
                quantity=1500,
                unit='kg',
                location='Ahmedabad, Gujarat',
                harvest_date=datetime.now().date() + timedelta(days=25),
                description='Sweet corn suitable for direct consumption and processing. Good kernel quality.'
            )
        ]

        db.session.add_all(listings)
        db.session.commit()

        # Create sample Q&A posts
        print("Creating sample Q&A posts...")

        qa_posts = [
            QAPost(
                author_id=farmer1.id,
                title='Best practices for rice pest management?',
                body='I am growing Basmati rice and facing issues with stem borer. What are the best organic methods to control this pest? I want to avoid heavy chemical use.',
                tags='rice,pest-management,organic'
            ),
            QAPost(
                author_id=client1.id,
                title='How to identify quality wheat?',
                body='I am a trader looking to buy wheat in bulk. What are the key indicators of good quality wheat? What should I check before making a purchase?',
                tags='wheat,quality,trading'
            ),
            QAPost(
                author_id=farmer2.id,
                title='Cotton market prices - What to expect?',
                body='Planning to sell my cotton harvest next month. What are the current market trends? Should I wait or sell immediately?',
                tags='cotton,market,pricing'
            ),
            QAPost(
                author_id=farmer3.id,
                title='Tomato storage tips needed',
                body='I have a large tomato harvest. What are the best storage methods to extend shelf life? Temperature and humidity requirements?',
                tags='tomato,storage,post-harvest'
            ),
            QAPost(
                author_id=client2.id,
                title='Organic certification - Is it worth it?',
                body='As a buyer, I am interested in sourcing organic produce. How can I verify organic certification? What are the benefits?',
                tags='organic,certification,quality'
            )
        ]

        db.session.add_all(qa_posts)
        db.session.commit()

        print("\n" + "="*50)
        print("Database seeded successfully!")
        print("="*50)
        print("\nSample Login Credentials:")
        print("-"*50)
        print("Farmers:")
        print("  Username: rajesh_farmer | Password: farmer123")
        print("  Username: priya_farms   | Password: farmer123")
        print("  Username: suresh_agro   | Password: farmer123")
        print("\nClients:")
        print("  Username: anil_trader     | Password: client123")
        print("  Username: neha_wholesale  | Password: client123")
        print("-"*50)
        print(f"\nCreated {len(listings)} sample listings")
        print(f"Created {len(qa_posts)} sample Q&A posts")
        print("="*50)


if __name__ == '__main__':
    seed_database()
