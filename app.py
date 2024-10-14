from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app=Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Mysql%4012345@localhost/dashboard"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Records(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    end_year = db.Column(db.Integer)
    intensity = db.Column(db.Integer)
    sector = db.Column(db.String(255))
    topic = db.Column(db.String(255))
    insight = db.Column(db.Text)
    url = db.Column(db.Text)
    region = db.Column(db.String(255))
    start_year = db.Column(db.Integer)
    impact = db.Column(db.Integer)
    added = db.Column(db.DateTime, default=datetime.utcnow)
    # added = db.Column(db.DateTime, default=datetime)
    published = db.Column(db.DateTime)
    country = db.Column(db.String(255))
    relevance = db.Column(db.Integer)
    pestle = db.Column(db.String(255))
    source = db.Column(db.String(255))
    title = db.Column(db.Text)
    likelihood = db.Column(db.Integer)


@app.route("/get-energy-consumption-trends", methods=["GET"])
def data():
    records = Records.query.all()
    records = [{"consumption":record.intensity, "sector" : record.sector, "year" : record.start_year}for record in records]
    return(records)

@app.route("/get-sector-impact-data")
def sector():
    records = Records.query.all()
    records = [{"impact":record.impact, "sector" : record.sector, "intensity" : record.intensity, "relevance" : record.relevance}for record in records]
    return(records)

@app.route("/get-risk-likelihood")
def risk():
    records = Records.query.all()
    records = [{"impact":record.impact, "likelihood" : record.likelihood, "risk" : record.insight, "relevance" : record.relevance}for record in records]
    return(records)

@app.route("/get-source-distribution")
def source():
    records = Records.query.all()
    records = [{"label" : record.sector, "value" : record.relevance}for record in records]
    return(records)

@app.route("/get-pastel-analysis")
def pastel():
    records = Records.query.all()
    records = [{"category":record.pestle, "year" : record.start_year}for record in records]
    return(records)

@app.route("/get-gio-insights")
def gio():
    records = Records.query.all()
    records = [{"id":record.country, "value" : record.relevance}for record in records]
    return(records)

@app.route("/get-time-based-trends")
def trends():
    records = Records.query.all()
    records = [{"date":record.published, "value" : record.relevance}for record in records]
    return(records)
    


if __name__ == "__main__":
    with app.app_context():    
        db.create_all()
        app.run(debug=True)
    