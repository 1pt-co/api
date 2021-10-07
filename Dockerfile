FROM python:3.5

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV FLASK_APP=server

EXPOSE 5000

CMD flask run --host=0.0.0.0
