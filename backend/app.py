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
load_dotenv()
DATA_PATH = "countryfinancial2024/backend/uploads/example.pdf"

MAX_LENGTH = 4097
MODEL = "gpt-3.5-turbo-instruct"
MAX_COMPLETION_LENGTH = 150
CHROMA_FOLDER = 'countryfinancial2024/backend/chroma'
UPLOAD_FOLDER = 'countryfinancial2024/backend/uploads'

app.config['CHROMA_FOLDER'] = CHROMA_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CHROMA_PATH = 'countryfinancial2024/backend/chroma'
# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(CHROMA_FOLDER):
    os.makedirs(CHROMA_FOLDER)

prompt = """
Declaration Packet: {packet}
Question: {question}

You are a conversational tool for an insurance company, COUNTRY Financial. Your job is to help clients
understand the policy coverages within the provided declaration packet. Use the packet
to answer the client's question.
Be concise and make sure to answer the question. Use less than 80 words in your response.
Do not say to reach out to the agent if they have more questions, instead offer answer those questions.
"""

client = OpenAI(
    
    api_key="insert_API_key_here", # or env var
)

def load_chroma():
    
    loader = PyPDFLoader(DATA_PATH)
    chroma_path_created = False
    pages = loader.load_and_split()
    shutil.rmtree(CHROMA_PATH)
    
    # if not os.path.exists(CHROMA_FOLDER):
    #     os.makedirs(CHROMA_FOLDER)
    chroma_path_created = False
    if not chroma_path_created:
        print("Creating Chroma...")
        chroma = Chroma.from_documents(pages, OpenAIEmbeddings(), persist_directory=CHROMA_PATH)
        chroma.persist()
        chroma_path_created = True


def get_most_similar_context(query):
    
    emb_function = OpenAIEmbeddings()
    chroma = Chroma(persist_directory=CHROMA_PATH, embedding_function=emb_function)
    context = chroma.similarity_search(query, k = 10)
    context = str(" ".join([c.page_content for c in context]))
    encoding = tiktoken.encoding_for_model(MODEL)
    encoded_string = encoding.encode(str(context))
    prompt_string = encoding.encode(prompt)
    query_string = encoding.encode(query)
    num_tokens = len(encoded_string)
    if num_tokens > MAX_LENGTH:
        context = encoding.decode(encoded_string[:MAX_LENGTH-len(prompt_string)-len(query_string)-MAX_COMPLETION_LENGTH])
    return context


def generate_response(query, context):
    #context = get_most_similar_context(query)
    formatted_prompt = prompt.format(packet=context, question=query)
    response = client.completions.create(
        
        model="gpt-3.5-turbo-instruct", 
        prompt=formatted_prompt, 
        max_tokens=MAX_COMPLETION_LENGTH  
    )
    return response.choices[0].text.strip()

@app.route('/')
def index():

    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        load_chroma()
        return jsonify({'message': 'File uploaded successfully'}), 200
    

@app.route('/process_message', methods=['POST'])
def process_message():
    print("Processing")
    data = request.get_json()
    user_message = data['message']
    context = get_most_similar_context(user_message)
    bot_response = generate_response(user_message, context)
    
    return jsonify(response=bot_response)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

