from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
app = Flask(__name__)
CORS(app)
from PyPDF2 import PdfReader
import os
import tiktoken
import shutil
from dotenv import load_dotenv
import re
import pandas as pd

load_dotenv()
DATA_PATH = "uploads/example.pdf"
CHROMA_PATH = "chroma/"
MAX_LENGTH = 4097
MODEL = "gpt-3.5-turbo-instruct"
MAX_COMPLETION_LENGTH = 500

# ID58709,1
# ID58710,0

prompt = """
You are an informational tool for an insurance agent at an insurance company, COUNTRY Financial. The company
offers insurance products such as all different types of life insurance, auto insurance, and home insurance.
Your job is to provide recommendations for products that will fit the customer's needs based on their age, income,
targeted retirement age, amount of driving, whether they own a car and its value, and whether they own a home and its value.
For example, if the customer's car isn't worth as much, they may only need bodily injury; if they make a lot of money, they will need life insurance.
Be specific and provide a specific list of matching products. Do not explain the policies as agents already know what each policy means.
Instead, provide specific parameters of the policies that will match the customer's needs.

Client Description: {desc}
"""

def generate_desc(age, income, retirement_age, owns_car, car_worth, miles, owns_home, home_worth, addl):
    car_ownership = f"own a car worth ${car_worth} and drive {miles} yearly" if owns_car else "do not own a car"
    home_ownership = f"own a home worth ${home_worth}" if owns_home else "do not own a home"
    
    return (f"My client is {age} years old, their income is ${income} per year, they aim to retire by {retirement_age}, they {car_ownership}, and they {home_ownership}. Also, {addl}.")


client = OpenAI(
    # This is the default and can be omitted
    api_key="insert_API_key_here", # or env var
)


def generate_response(query):
    #context = get_most_similar_context(query)
    formatted_prompt = prompt.format(desc=query)
    print("\n")
    print(formatted_prompt)
    response = client.completions.create(
        
        model="gpt-3.5-turbo-instruct",  # Choose the appropriate engine
        prompt=formatted_prompt, 
        max_tokens=MAX_COMPLETION_LENGTH  # Adjust as needed
        # temperature=0.7,  # Adjust as needed
    )
    return response.choices[0].text.strip()

@app.route('/')
def index():

    return render_template('index.html')


@app.route('/process_message', methods=['POST'])
def process_message():
    print("Processing")
    data = request.get_json().get('surveyData')
    age = str(data.get('age'))
    income = str(data.get('income')) 
    retirement_age = str(data.get('retirementAge'))
    owns_car = data.get('ownsCar') 
    car_worth = str(data.get('carWorth'))
    miles = str(data.get('miles'))
    owns_home = data.get('ownsHome') 
    home_worth = str(data.get('homeWorth'))
    addl = str(data.get('additionalInfo'))

    desc = generate_desc(age, income, retirement_age, owns_car, car_worth, miles, owns_home, home_worth, addl)
    print(desc)
    bot_response = generate_response(desc)
    print(bot_response)
    
    return jsonify(response=bot_response)

data = pd.read_csv('/Users/mlynch/Desktop/Hackathon/countryfinancial2024/frontend/src/static/data/submission.csv')

@app.route('/api/predict', methods=['POST'])
def predict():
    policy_id = request.json.get('policy_id')
    print(policy_id)

    if policy_id is None:
        return jsonify({'error': 'Policy ID is required'}), 400
    
    try:
        prediction = data.loc[data['policy_id'] == policy_id, 'prediction'].values[0]
        return jsonify({'prediction': int(prediction)})
    except IndexError:
        return jsonify({'error': 'Policy ID not found'}), 40


if __name__ == '__main__':
    app.run(debug=True, port=4000)

