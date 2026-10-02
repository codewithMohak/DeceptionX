FROM python:3.12-slim

WORKDIR /app

COPY requirement.txt .
RUN pip install --no-cache-dir -r requirement.txt

COPY app.py .

# Ensure the HTTP decoy log directory exists inside the container.
RUN mkdir -p /var/log/http-decoy

EXPOSE 80

CMD ["python", "app.py"]