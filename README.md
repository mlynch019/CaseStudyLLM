# Retrieval-augmented generation (RAG) bot built with React, Flask, and OpenAI's API.

User can upload their lengthy policy packet and receive immediate answers to their personalized questions. 70-80 page packets are chunked and filed as separate entries in Chroma vector database. When a user submits a query, the relevant section of the packet is retrieved using a similarity search and fed into the LLM prompt for the generated answer. 
* This project does not reflect current initiatives of Country. The LLM frontend and backed were my contributions to the overall feature suite. 
<img width="1512" alt="Screenshot 2024-07-11 at 2 46 17 PM" src="https://github.com/user-attachments/assets/d544250d-018d-44d7-960a-b5432f9a0346">

