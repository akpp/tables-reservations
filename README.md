# Tables reservations
Online Table Reservation System and Planner


## How to Install                                                                                                            
```bash
git clone https://github.com/akpp/tables-reservations.git
cd tables-reservations/

virtualenv venv
source venv/bin/activate
pip install -r requirements.txt

# you must update this line !!!
echo "export SENDGRID_API_KEY='enter_your_secret_api_key'" > sendgrid.env
source ./sendgrid.env

python manage.py migrate
python manage.py loaddata dump/tables.json
```